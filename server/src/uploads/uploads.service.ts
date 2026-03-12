import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { CurrentUserType } from '../common/types/current-user.type';

@Injectable()
export class UploadsService {
    constructor(private readonly prisma: PrismaService) { }

    async attachListingImage(
        listingId: string,
        user: CurrentUserType,
        file: Express.Multer.File,
    ) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
            select: { id: true, ownerId: true },
        });

        if (!listing) {
            throw new NotFoundException('Listing not found');
        }

        this.assertOwnerOrAdmin(user, listing.ownerId);

        const relativeUrl = `/uploads/listings/${file.filename}`;

        return this.prisma.image.create({
            data: {
                url: relativeUrl,
                filename: file.filename,
                mimetype: file.mimetype,
                size: file.size,
                listingId,
            },
        });
    }

    async removeListingImage(imageId: string, user: CurrentUserType) {
        const image = await this.prisma.image.findUnique({
            where: { id: imageId },
            include: {
                listing: {
                    select: {
                        id: true,
                        ownerId: true,
                    },
                },
            },
        });

        if (!image) {
            throw new NotFoundException('Image not found');
        }

        this.assertOwnerOrAdmin(user, image.listing.ownerId);

        if (image.filename) {
            const filePath = join(process.cwd(), 'uploads', 'listings', image.filename);

            if (existsSync(filePath)) {
                unlinkSync(filePath);
            }
        }

        return this.prisma.image.delete({
            where: { id: imageId },
        });
    }

    private assertOwnerOrAdmin(user: CurrentUserType, ownerId: string) {
        const isOwner = user.id === ownerId;
        const isAdmin = user.role === 'ADMIN';

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException(
                'You do not have permission to manage this listing image',
            );
        }
    }
}