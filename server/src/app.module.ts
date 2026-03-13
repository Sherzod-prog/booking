import { Module } from '@nestjs/common';

import { ConfigModule } from "@nestjs/config";
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ListingsModule } from './listings/listings.module';
import { UploadsModule } from './uploads/uploads.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [ConfigModule.forRoot(
    { isGlobal: true }
  ), AuthModule, UsersModule, PrismaModule, ListingsModule, UploadsModule, BookingsModule],

})
export class AppModule { }
