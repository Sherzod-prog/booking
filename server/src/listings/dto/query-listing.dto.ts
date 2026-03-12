import { Transform } from 'class-transformer';
import { ListingStatus } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class QueryListingDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsEnum(ListingStatus)
    status?: ListingStatus;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(1)
    limit?: number = 10;
}