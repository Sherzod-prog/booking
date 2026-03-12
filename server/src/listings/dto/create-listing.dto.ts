import { ListingStatus } from '@prisma/client';
import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    Min,
} from 'class-validator';

export class CreateListingDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    pricePerNight: number;

    @IsInt()
    @Min(1)
    guests: number;

    @IsInt()
    @Min(1)
    bedrooms: number;

    @IsInt()
    @Min(1)
    bathrooms: number;

    @IsOptional()
    @IsEnum(ListingStatus)
    status?: ListingStatus;
}