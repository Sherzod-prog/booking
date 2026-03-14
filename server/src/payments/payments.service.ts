import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    BookingStatus,
    PaymentProvider,
    PaymentStatus,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserType } from '../common/types/current-user.type';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { QueryPaymentDto } from './dto/query-payment.dto';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
    private stripe: Stripe;

    constructor(private readonly prisma: PrismaService) {
        const secretKey = process.env.STRIPE_SECRET_KEY;

        if (!secretKey) {
            throw new Error('STRIPE_SECRET_KEY is not set');
        }

        this.stripe = new Stripe(secretKey);
    }

    async createPayment(user: CurrentUserType, dto: CreatePaymentDto) {
        if (dto.provider !== PaymentProvider.STRIPE) {
            throw new BadRequestException('Only STRIPE is supported for now');
        }

        const booking = await this.prisma.booking.findUnique({
            where: { id: dto.bookingId },
            include: {
                payment: true,
                listing: {
                    select: {
                        id: true,
                        title: true,
                        location: true,
                    },
                },
            },
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        if (booking.userId !== user.id) {
            throw new ForbiddenException('You cannot pay for this booking');
        }

        if (booking.status === BookingStatus.CANCELLED) {
            throw new BadRequestException('Cancelled booking cannot be paid');
        }

        if (booking.paymentStatus === PaymentStatus.PAID) {
            throw new BadRequestException('Booking is already paid');
        }

        const amount = Number(booking.totalPrice);
        if (amount <= 0) {
            throw new BadRequestException('Invalid booking amount');
        }

        const amountInSmallestUnit = Math.round(amount * 100);

        const payment = booking.payment
            ? await this.prisma.payment.update({
                where: { bookingId: booking.id },
                data: {
                    provider: PaymentProvider.STRIPE,
                    amount,
                    currency: 'USD',
                    status: PaymentStatus.UNPAID,
                    paidAt: null,
                },
            })
            : await this.prisma.payment.create({
                data: {
                    bookingId: booking.id,
                    provider: PaymentProvider.STRIPE,
                    amount,
                    currency: 'USD',
                    status: PaymentStatus.UNPAID,
                },
            });

        const successUrl = process.env.STRIPE_SUCCESS_URL;
        const cancelUrl = process.env.STRIPE_CANCEL_URL;

        if (!successUrl || !cancelUrl) {
            throw new Error('STRIPE_SUCCESS_URL or STRIPE_CANCEL_URL is not set');
        }

        const session = await this.stripe.checkout.sessions.create({
            mode: 'payment',
            success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl,
            payment_method_types: ['card'],
            client_reference_id: booking.id,
            metadata: {
                bookingId: booking.id,
                paymentId: payment.id,
                userId: user.id,
            },
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: 'usd',
                        unit_amount: amountInSmallestUnit,
                        product_data: {
                            name: booking.listing.title,
                            description: `Booking in ${booking.listing.location}`,
                        },
                    },
                },
            ],
        });

        await this.prisma.payment.update({
            where: { id: payment.id },
            data: {
                transactionId: session.id,
                providerRef: session.payment_intent?.toString() ?? null,
            },
        });

        return {
            message: 'Stripe checkout session created',
            checkoutUrl: session.url,
            sessionId: session.id,
            paymentId: payment.id,
        };
    }

    async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
        const bookingId = session.metadata?.bookingId;
        const paymentId = session.metadata?.paymentId;

        if (!bookingId || !paymentId) {
            throw new BadRequestException('Missing bookingId/paymentId in Stripe metadata');
        }

        const existingPayment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
        });

        if (!existingPayment) {
            throw new NotFoundException('Payment not found');
        }

        if (existingPayment.status === PaymentStatus.PAID) {
            return {
                message: 'Payment already confirmed',
            };
        }

        return this.prisma.$transaction(async (tx) => {
            const payment = await tx.payment.update({
                where: { id: paymentId },
                data: {
                    status: PaymentStatus.PAID,
                    paidAt: new Date(),
                    transactionId: session.id,
                    providerRef: session.payment_intent?.toString() ?? null,
                },
            });

            const booking = await tx.booking.update({
                where: { id: bookingId },
                data: {
                    paymentStatus: PaymentStatus.PAID,
                    status: BookingStatus.CONFIRMED,
                },
            });

            return {
                message: 'Payment confirmed successfully',
                payment,
                booking,
            };
        });
    }

    async handlePaymentFailed(session: Stripe.Checkout.Session) {
        const bookingId = session.metadata?.bookingId;
        const paymentId = session.metadata?.paymentId;

        if (!bookingId || !paymentId) {
            throw new BadRequestException('Missing bookingId/paymentId in Stripe metadata');
        }

        return this.prisma.$transaction(async (tx) => {
            const payment = await tx.payment.update({
                where: { id: paymentId },
                data: {
                    status: PaymentStatus.FAILED,
                    transactionId: session.id,
                    providerRef: session.payment_intent?.toString() ?? null,
                },
            });

            const booking = await tx.booking.update({
                where: { id: bookingId },
                data: {
                    paymentStatus: PaymentStatus.UNPAID,
                    status: BookingStatus.PENDING,
                },
            });

            return {
                message: 'Payment marked as failed',
                payment,
                booking,
            };
        });
    }

    async getMyPayments(user: CurrentUserType) {
        return this.prisma.payment.findMany({
            where: {
                booking: {
                    userId: user.id,
                },
            },
            include: {
                booking: {
                    include: {
                        listing: {
                            select: {
                                id: true,
                                title: true,
                                location: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    getStripeInstance() {
        return this.stripe;
    }
    async findAll(query: QueryPaymentDto) {
        const {
            status,
            provider,
            bookingId,
            userId,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = query;

        const skip = (page - 1) * limit;

        const allowedSortFields = [
            'createdAt',
            'updatedAt',
            'amount',
            'status',
            'provider',
            'paidAt',
        ];

        const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
        const safeSortOrder = String(sortOrder).toLowerCase() === 'asc' ? 'asc' : 'desc';

        const where = {
            AND: [
                status ? { status } : {},
                provider ? { provider } : {},
                bookingId ? { bookingId } : {},
                userId
                    ? {
                        booking: {
                            userId,
                        },
                    }
                    : {},
            ],
        };

        const [data, total] = await this.prisma.$transaction([
            this.prisma.payment.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [safeSortBy]: safeSortOrder,
                },
                include: {
                    booking: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    fullName: true,
                                    email: true,
                                },
                            },
                            listing: {
                                select: {
                                    id: true,
                                    title: true,
                                    location: true,
                                },
                            },
                        },
                    },
                },
            }),
            this.prisma.payment.count({ where }),
        ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: {
                booking: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true,
                            },
                        },
                        listing: {
                            select: {
                                id: true,
                                title: true,
                                location: true,
                            },
                        },
                    },
                },
            },
        });

        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        return payment;
    }
}