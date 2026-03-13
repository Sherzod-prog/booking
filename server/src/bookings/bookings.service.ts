import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { BookingStatus, PaymentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserType } from '../common/types/current-user.type';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryMyBookingsDto } from './dto/query-my-bookings.dto';
import { UpdateBookingAdminDto } from './dto/update-booking-admin.dto';
import { QueryBookingDto } from './dto/query-booking.dto';


@Injectable()
export class BookingsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(user: CurrentUserType, dto: CreateBookingDto) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: dto.listingId },
            select: {
                id: true,
                ownerId: true,
                status: true,
                pricePerNight: true,
            },
        });

        if (!listing) {
            throw new NotFoundException('Listing not found');
        }

        if (listing.status !== 'PUBLISHED') {
            throw new BadRequestException('This listing is not available for booking');
        }

        if (listing.ownerId === user.id) {
            throw new ForbiddenException('You cannot book your own listing');
        }

        const checkIn = new Date(dto.checkIn);
        const checkOut = new Date(dto.checkOut);

        if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
            throw new BadRequestException('Invalid booking dates');
        }

        if (checkOut <= checkIn) {
            throw new BadRequestException('Check-out must be after check-in');
        }

        const now = new Date();
        if (checkIn < new Date(now.setHours(0, 0, 0, 0))) {
            throw new BadRequestException('Check-in date cannot be in the past');
        }
        const overlappingBooking = await this.prisma.booking.findFirst({
            where: {
                listingId: dto.listingId,
                status: {
                    in: [
                        BookingStatus.PENDING,
                        BookingStatus.CONFIRMED,
                        BookingStatus.COMPLETED,
                    ],
                },
                checkIn: {
                    lt: checkOut,
                },
                checkOut: {
                    gt: checkIn,
                },
            },
            select: {
                id: true,
            },
        });


        if (overlappingBooking) {
            throw new BadRequestException(
                'Selected dates are already booked for this listing',
            );
        }

        const nights = this.calculateNights(checkIn, checkOut);
        const totalPrice = Number(listing.pricePerNight) * nights;

        return this.prisma.booking.create({
            data: {
                userId: user.id,
                listingId: dto.listingId,
                checkIn,
                checkOut,
                totalPrice,
                status: BookingStatus.PENDING,
                paymentStatus: PaymentStatus.UNPAID,
            },
            include: {
                listing: {
                    include: {
                        images: true,
                        owner: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true,
                            },
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
            },
        });
    }

    async findMyBookings(user: CurrentUserType, query: QueryMyBookingsDto) {
        const page = Number(query.page ?? 1);
        const limit = Number(query.limit ?? 10);
        const skip = (page - 1) * limit;

        const where: Prisma.BookingWhereInput = {
            userId: user.id,
            ...(query.status && { status: query.status }),
        };

        const [data, total] = await this.prisma.$transaction([
            this.prisma.booking.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    listing: {
                        include: {
                            images: true,
                            owner: {
                                select: {
                                    id: true,
                                    fullName: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            }),
            this.prisma.booking.count({ where }),
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

    async cancelMyBooking(id: string, user: CurrentUserType) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: {
                listing: {
                    select: {
                        ownerId: true,
                    },
                },
            },
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        if (booking.userId !== user.id) {
            throw new ForbiddenException('You cannot cancel this booking');
        }

        if (booking.status === BookingStatus.CANCELLED) {
            throw new BadRequestException('Booking is already cancelled');
        }

        if (booking.status === BookingStatus.COMPLETED) {
            throw new BadRequestException('Completed booking cannot be cancelled');
        }

        return this.prisma.booking.update({
            where: { id },
            data: {
                status: BookingStatus.CANCELLED,
            },
            include: {
                listing: true,
            },
        });
    }

    private calculateNights(checkIn: Date, checkOut: Date) {
        const diffMs = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (nights < 1) {
            throw new BadRequestException('Booking must be at least 1 night');
        }

        return nights;
    }
    async findAll(query: QueryBookingDto) {
        const {
            status,
            paymentStatus,
            userId,
            listingId,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = query;

        const skip = (page - 1) * limit;

        const allowedSortFields = [
            'createdAt',
            'updatedAt',
            'checkIn',
            'checkOut',
            'totalPrice',
            'status',
            'paymentStatus',
        ];

        const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
        const safeSortOrder = String(sortOrder).toLowerCase() === 'asc' ? 'asc' : 'desc';

        const where: Prisma.BookingWhereInput = {
            AND: [
                status ? { status } : {},
                paymentStatus ? { paymentStatus } : {},
                userId ? { userId } : {},
                listingId ? { listingId } : {},
            ],
        };

        const [data, total] = await this.prisma.$transaction([
            this.prisma.booking.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [safeSortBy]: safeSortOrder,
                },
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
            }),
            this.prisma.booking.count({ where }),
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
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
                listing: {
                    include: {
                        images: true,
                        owner: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        return booking;
    }

    async adminUpdate(id: string, dto: UpdateBookingAdminDto) {
        const existing = await this.prisma.booking.findUnique({
            where: { id },
            select: {
                id: true,
                listingId: true,
                checkIn: true,
                checkOut: true,
            },
        });

        if (!existing) {
            throw new NotFoundException('Booking not found');
        }

        const nextCheckIn = dto.checkIn ? new Date(dto.checkIn) : existing.checkIn;
        const nextCheckOut = dto.checkOut ? new Date(dto.checkOut) : existing.checkOut;

        if (nextCheckOut <= nextCheckIn) {
            throw new BadRequestException('Check-out must be after check-in');
        }

        const overlappingBooking = await this.prisma.booking.findFirst({
            where: {
                id: { not: id },
                listingId: existing.listingId,
                status: {
                    in: [
                        BookingStatus.PENDING,
                        BookingStatus.CONFIRMED,
                        BookingStatus.COMPLETED,
                    ],
                },
                checkIn: {
                    lt: nextCheckOut,
                },
                checkOut: {
                    gt: nextCheckIn,
                },
            },
            select: {
                id: true,
            },
        });

        if (overlappingBooking) {
            throw new BadRequestException(
                'Updated dates overlap with another booking',
            );
        }

        return this.prisma.booking.update({
            where: { id },
            data: {
                ...(dto.checkIn && { checkIn: new Date(dto.checkIn) }),
                ...(dto.checkOut && { checkOut: new Date(dto.checkOut) }),
                ...(dto.totalPrice !== undefined && { totalPrice: dto.totalPrice }),
                ...(dto.status && { status: dto.status }),
                ...(dto.paymentStatus && { paymentStatus: dto.paymentStatus }),
            },
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
        });
    }

}
