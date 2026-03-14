import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('stats')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    getStats() {
        return this.dashboardService.getStats();
    }

    @Get('charts')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    getCharts() {
        return this.dashboardService.getCharts();
    }

    @Get('recent-bookings')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    getRecentBookings() {
        return this.dashboardService.getRecentBookings();
    }

    @Get('top-listings')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    getTopListings() {
        return this.dashboardService.getTopListings();
    }
}