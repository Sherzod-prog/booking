import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';

function ensureUploadPath(path: string) {
    if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
    }
}

export const listingImageStorage = diskStorage({
    destination: (_req, _file, cb) => {
        const uploadPath = join(process.cwd(), 'uploads', 'listings');
        ensureUploadPath(uploadPath);
        cb(null, uploadPath);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = extname(file.originalname);
        cb(null, `listing-${uniqueSuffix}${ext}`);
    },
});

export function imageFileFilter(
    _req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
) {
    if (!file.mimetype.match(/^image\/(jpeg|jpg|png|webp)$/)) {
        return cb(
            new BadRequestException('Only jpg, jpeg, png, webp files are allowed'),
            false,
        );
    }

    cb(null, true);
}