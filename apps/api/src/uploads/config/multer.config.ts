import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';

// Ensure directories exist
const uploadDirs = ['./uploads/videos', './uploads/pdfs', './uploads/images'];
uploadDirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configuration pour les vidéos
export const videoFileFilter = (req: any, file: any, callback: any) => {
    const allowedExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.webm'];
    const ext = extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
        return callback(
            new BadRequestException(
                `Invalid video format. Allowed: ${allowedExtensions.join(', ')}`,
            ),
            false,
        );
    }

    callback(null, true);
};

// Configuration pour les PDFs
export const pdfFileFilter = (req: any, file: any, callback: any) => {
    const ext = extname(file.originalname).toLowerCase();

    if (ext !== '.pdf') {
        return callback(
            new BadRequestException('Invalid file format. Only PDF allowed'),
            false,
        );
    }

    callback(null, true);
};

// Configuration pour images (thumbnails)
export const imageFileFilter = (req: any, file: any, callback: any) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
        return callback(
            new BadRequestException(
                `Invalid image format. Allowed: ${allowedExtensions.join(', ')}`,
            ),
            false,
        );
    }

    callback(null, true);
};

// Génération de nom de fichier unique
export const editFileName = (req: any, file: any, callback: any) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(16)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');

    callback(null, `${name}-${Date.now()}-${randomName}${fileExtName}`);
};

// Storage pour vidéos
export const videoStorage = diskStorage({
    destination: './uploads/videos',
    filename: editFileName,
});

// Storage pour PDFs
export const pdfStorage = diskStorage({
    destination: './uploads/pdfs',
    filename: editFileName,
});

// Storage pour images
export const imageStorage = diskStorage({
    destination: './uploads/images',
    filename: editFileName,
});

// Limites de taille
export const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500 MB
export const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10 MB
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
