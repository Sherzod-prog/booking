import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma, ListingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { QueryListingDto } from './dto/query-listing.dto';
import { CurrentUserType } from '../common/types/current-user.type';

@Injectable()
export class ListingsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(ownerId: string, dto: CreateListingDto) {
        return this.prisma.listing.create({
            data: {
                title: dto.title,
                description: dto.description,
                location: dto.location,
                address: dto.address,
                pricePerNight: dto.pricePerNight,
                guests: dto.guests,
                bedrooms: dto.bedrooms,
                bathrooms: dto.bathrooms,
                status: dto.status ?? ListingStatus.DRAFT,
                ownerId,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
                images: true,
            },
        });
    }

    async findAll(query: QueryListingDto) {
        const {
            search,
            location,
            status,
            ownerId,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = query;

        const skip = (page - 1) * limit;

        const allowedSortFields = [
            'createdAt',
            'updatedAt',
            'title',
            'location',
            'pricePerNight',
            'status',
        ];

        const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
        const safeSortOrder = String(sortOrder).toLowerCase() === 'asc' ? 'asc' : 'desc';

        const where: Prisma.ListingWhereInput = {
            AND: [
                search
                    ? {
                        OR: [
                            { title: { contains: search, mode: 'insensitive' } },
                            { description: { contains: search, mode: 'insensitive' } },
                        ],
                    }
                    : {},
                location
                    ? {
                        location: { contains: location, mode: 'insensitive' },
                    }
                    : {},
                status ? { status } : {},
                ownerId ? { ownerId } : {},
            ],
        };

        const [data, total] = await this.prisma.$transaction([
            this.prisma.listing.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [safeSortBy]: safeSortOrder,
                },
                include: {
                    owner: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                        },
                    },
                    images: true,
                },
            }),
            this.prisma.listing.count({ where }),
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
        const listing = await this.prisma.listing.findUnique({
            where: { id },
            include: {
                owner: {
                    select: { id: true, fullName: true, email: true },
                },
                images: true,
                reviews: {
                    include: {
                        user: {
                            select: { id: true, fullName: true },
                        },
                    },
                },
            },
        });

        if (!listing) {
            throw new NotFoundException('Listing not found');
        }

        return listing;
    }

    async update(id: string, user: CurrentUserType, dto: UpdateListingDto) {
        const listing = await this.getListingOrThrow(id);
        this.assertOwnerOrAdmin(user, listing.ownerId);

        return this.prisma.listing.update({
            where: { id },
            data: {
                ...(dto.title !== undefined && { title: dto.title }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(dto.location !== undefined && { location: dto.location }),
                ...(dto.address !== undefined && { address: dto.address }),
                ...(dto.pricePerNight !== undefined && {
                    pricePerNight: dto.pricePerNight,
                }),
                ...(dto.guests !== undefined && { guests: dto.guests }),
                ...(dto.bedrooms !== undefined && { bedrooms: dto.bedrooms }),
                ...(dto.bathrooms !== undefined && { bathrooms: dto.bathrooms }),
                ...(dto.status !== undefined && { status: dto.status }),
            },
            include: {
                owner: {
                    select: { id: true, fullName: true, email: true },
                },
                images: true,
            },
        });
    }

    async remove(id: string, user: CurrentUserType) {
        const listing = await this.getListingOrThrow(id);
        this.assertOwnerOrAdmin(user, listing.ownerId);

        return this.prisma.listing.delete({
            where: { id },
        });
    }

    async findByIdForOwnership(id: string) {
        return this.prisma.listing.findUnique({
            where: { id },
            select: { id: true, ownerId: true },
        });
    }

    private async getListingOrThrow(id: string) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
            select: { id: true, ownerId: true },
        });

        if (!listing) {
            throw new NotFoundException('Listing not found');
        }

        return listing;
    }

    private assertOwnerOrAdmin(user: CurrentUserType, ownerId: string) {
        const isOwner = user.id === ownerId;
        const isAdmin = user.role === 'ADMIN';

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException(
                'You do not have permission to manage this listing',
            );
        }
    }
}