import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CurrentUserType } from '../common/types/current-user.type';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me/profile')
    me(@CurrentUser() user: CurrentUserType) {
        return this.usersService.findById(user.id);
    }
}