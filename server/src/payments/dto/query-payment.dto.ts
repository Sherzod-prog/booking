import { PaymentProvider, PaymentStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class QueryPaymentDto extends PaginationQueryDto {
    @IsOptional()
    @IsEnum(PaymentStatus)
    status?: PaymentStatus;

    @IsOptional()
    @IsEnum(PaymentProvider)
    provider?: PaymentProvider;

    @IsOptional()
    @IsString()
    bookingId?: string;

    @IsOptional()
    @IsString()
    userId?: string;
}