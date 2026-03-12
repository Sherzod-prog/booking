import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { QueryListingDto } from './dto/query-listing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CurrentUserType } from '../common/types/current-user.type';

@Controller('listings')
export class ListingsController {
    constructor(private readonly listingsService: ListingsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(
        @CurrentUser() user: CurrentUserType,
        @Body() dto: CreateListingDto,
    ) {
        return this.listingsService.create(user.id, dto);
    }

    @Get()
    findAll(@Query() query: QueryListingDto) {
        return this.listingsService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.listingsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserType,
        @Body() dto: UpdateListingDto,
    ) {
        return this.listingsService.update(id, user, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserType,
    ) {
        return this.listingsService.remove(id, user);
    }
}