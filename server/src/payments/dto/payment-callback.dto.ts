import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaymentCallbackDto {
    @IsOptional()
    @IsString()
    transactionId?: string;

    @IsOptional()
    @IsString()
    providerRef?: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsNumber()
    amount?: number;
}