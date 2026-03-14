import {
    Body,
    Controller,
    Get,
    Headers,
    Param,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CurrentUserType } from '../common/types/current-user.type';
import { CreatePaymentDto } from './dto/create-payment.dto';
import Stripe from 'stripe';
import { Request } from 'express';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { QueryPaymentDto } from './dto/query-payment.dto';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    createPayment(
        @CurrentUser() user: CurrentUserType,
        @Body() dto: CreatePaymentDto,
    ) {
        return this.paymentsService.createPayment(user, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('my')
    getMyPayments(@CurrentUser() user: CurrentUserType) {
        return this.paymentsService.getMyPayments(user);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    findAll(@Query() query: QueryPaymentDto) {
        return this.paymentsService.findAll(query);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    findOne(@Param('id') id: string) {
        return this.paymentsService.findOne(id);
    }

    @Post('stripe/webhook')
    async stripeWebhook(
        @Req() req: Request & { body: Buffer },
        @Headers('stripe-signature') signature: string,
    ) {
        const stripe = this.paymentsService.getStripeInstance();
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!webhookSecret) {
            throw new Error('STRIPE_WEBHOOK_SECRET is not set');
        }

        const event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            webhookSecret,
        );

        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                await this.paymentsService.handleCheckoutCompleted(session);
                break;
            }

            case 'checkout.session.async_payment_failed':
            case 'checkout.session.expired': {
                const session = event.data.object as Stripe.Checkout.Session;
                await this.paymentsService.handlePaymentFailed(session);
                break;
            }

            default:
                break;
        }

        return { received: true };
    }
}