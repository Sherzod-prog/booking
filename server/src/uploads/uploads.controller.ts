import {
    Controller,
    Delete,
    Param,
    ParseFilePipe,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { imageFileFilter, listingImageStorage } from './multer.config';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CurrentUserType } from '../common/types/current-user.type';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('uploads')
export class UploadsController {
    constructor(private readonly uploadsService: UploadsService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'MANAGER')
    @Post('listings/:listingId/image')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: listingImageStorage,
            fileFilter: imageFileFilter,
            limits: {
                fileSize: 5 * 1024 * 1024,
            },
        }),
    )
    uploadListingImage(
        @Param('listingId') listingId: string,
        @CurrentUser() user: CurrentUserType,
        @UploadedFile(
            new ParseFilePipe({
                validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })],
            }),
        )
        file: Express.Multer.File,
    ) {
        return this.uploadsService.attachListingImage(listingId, user, file);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'MANAGER')
    @Delete('images/:imageId')
    removeListingImage(
        @Param('imageId') imageId: string,
        @CurrentUser() user: CurrentUserType,
    ) {
        return this.uploadsService.removeListingImage(imageId, user);
    }
}
