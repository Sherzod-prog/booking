import { Type } from 'class-transformer';
import { IsDateString, IsString, IsUUID } from 'class-validator';

export class CreateBookingDto {
    @IsUUID()
    listingId: string;

    @IsDateString()
    checkIn: string;

    @IsDateString()
    checkOut: string;
}
