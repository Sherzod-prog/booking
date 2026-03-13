import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CurrentUserType } from '../common/types/current-user.type';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryMyBookingsDto } from './dto/query-my-bookings.dto';
import { QueryBookingDto } from './dto/query-booking.dto';
import { UpdateBookingAdminDto } from './dto/update-booking-admin.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(
        @CurrentUser() user: CurrentUserType,
        @Body() dto: CreateBookingDto,
    ) {
        return this.bookingsService.create(user, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('my')
    findMyBookings(
        @CurrentUser() user: CurrentUserType,
        @Query() query: QueryMyBookingsDto,
    ) {
        return this.bookingsService.findMyBookings(user, query);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/cancel')
    cancelMyBooking(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserType,
    ) {
        return this.bookingsService.cancelMyBooking(id, user);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    findAll(@Query() query: QueryBookingDto) {
        return this.bookingsService.findAll(query);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    findOne(@Param('id') id: string) {
        return this.bookingsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    adminUpdate(@Param('id') id: string, @Body() dto: UpdateBookingAdminDto) {
        return this.bookingsService.adminUpdate(id, dto);
    }
}
