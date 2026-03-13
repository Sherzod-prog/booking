import { BookingStatus, PaymentStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';

export class UpdateBookingAdminDto {
    @IsOptional()
    @IsDateString()
    checkIn?: string;

    @IsOptional()
    @IsDateString()
    checkOut?: string;

    @IsOptional()
    @IsNumber()
    totalPrice?: number;

    @IsOptional()
    @IsEnum(BookingStatus)
    status?: BookingStatus;

    @IsOptional()
    @IsEnum(PaymentStatus)
    paymentStatus?: PaymentStatus;
}
