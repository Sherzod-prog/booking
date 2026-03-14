import { Injectable } from '@nestjs/common';
import { BookingStatus, PaymentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns';

@Injectable()
export class DashboardService {
    constructor(private readonly prisma: PrismaService) { }

    async getStats() {
        const [
            totalUsers,
            totalListings,
            totalBookings,
            pendingBookings,
            confirmedBookings,
            cancelledBookings,
            completedBookings,
            paidBookingsAggregate,
        ] = await this.prisma.$transaction([
            this.prisma.user.count(),
            this.prisma.listing.count(),
            this.prisma.booking.count(),
            this.prisma.booking.count({
                where: { status: BookingStatus.PENDING },
            }),
            this.prisma.booking.count({
                where: { status: BookingStatus.CONFIRMED },
            }),
            this.prisma.booking.count({
                where: { status: BookingStatus.CANCELLED },
            }),
            this.prisma.booking.count({
                where: { status: BookingStatus.COMPLETED },
            }),
            this.prisma.booking.aggregate({
                _sum: {
                    totalPrice: true,
                },
                where: {
                    paymentStatus: PaymentStatus.PAID,
                },
            }),
        ]);

        return {
            totalUsers,
            totalListings,
            totalBookings,
            pendingBookings,
            confirmedBookings,
            cancelledBookings,
            completedBookings,
            totalRevenue: Number(paidBookingsAggregate._sum.totalPrice ?? 0),
        };
    }
    async getCharts() {
        const now = new Date();

        const months = Array.from({ length: 6 }).map((_, index) => {
            const date = subMonths(now, 5 - index);
            return {
                start: startOfMonth(date),
                end: endOfMonth(date),
                label: format(date, 'MMM'),
            };
        });

        const bookingsByMonth = await Promise.all(
            months.map(async (month) => {
                const count = await this.prisma.booking.count({
                    where: {
                        createdAt: {
                            gte: month.start,
                            lte: month.end,
                        },
                    },
                });

                return {
                    month: month.label,
                    bookings: count,
                };
            }),
        );

        const pending = await this.prisma.booking.count({
            where: { status: 'PENDING' },
        });

        const confirmed = await this.prisma.booking.count({
            where: { status: 'CONFIRMED' },
        });

        const cancelled = await this.prisma.booking.count({
            where: { status: 'CANCELLED' },
        });

        const completed = await this.prisma.booking.count({
            where: { status: 'COMPLETED' },
        });

        return {
            bookingsByMonth,
            bookingsByStatus: [
                { name: 'Pending', value: pending },
                { name: 'Confirmed', value: confirmed },
                { name: 'Cancelled', value: cancelled },
                { name: 'Completed', value: completed },
            ],
        };
    }
    async getRecentBookings() {
        return this.prisma.booking.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc',
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
    async getTopListings() {
        const listings = await this.prisma.listing.findMany({
            include: {
                _count: {
                    select: {
                        bookings: true,
                    },
                },
                images: {
                    take: 1,
                },
            },
            orderBy: {
                bookings: {
                    _count: 'desc',
                },
            },
            take: 5,
        });

        return listings.map((listing) => ({
            id: listing.id,
            title: listing.title,
            location: listing.location,
            pricePerNight: listing.pricePerNight,
            image: listing.images[0]?.url ?? null,
            bookingsCount: listing._count.bookings,
        }));
    }
}