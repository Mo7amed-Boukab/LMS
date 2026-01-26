import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    UseGuards,
    BadRequestException,
    Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import {
    videoStorage,
    pdfStorage,
    imageStorage,
    videoFileFilter,
    pdfFileFilter,
    imageFileFilter,
    MAX_VIDEO_SIZE,
    MAX_PDF_SIZE,
    MAX_IMAGE_SIZE,
} from './config/multer.config';
import { UploadsService } from './uploads.service';

@Controller('uploads')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Formateur, Role.Admin)
export class UploadsController {
    constructor(private readonly uploadsService: UploadsService) { }

    /**
     * Upload video for course lessons
     */
    @Post('video')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: videoStorage,
            fileFilter: videoFileFilter,
            limits: { fileSize: MAX_VIDEO_SIZE },
        }),
    )
    async uploadVideo(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: any,
    ) {
        if (!file) {
            throw new BadRequestException('No video file provided');
        }

        return this.uploadsService.saveFileMetadata({
            filename: file.filename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            path: file.path,
            type: 'VIDEO',
            uploadedBy: req.user._id,
        });
    }

    /**
     * Upload PDF for course lessons
     */
    @Post('pdf')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: pdfStorage,
            fileFilter: pdfFileFilter,
            limits: { fileSize: MAX_PDF_SIZE },
        }),
    )
    async uploadPdf(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: any,
    ) {
        if (!file) {
            throw new BadRequestException('No PDF file provided');
        }

        return this.uploadsService.saveFileMetadata({
            filename: file.filename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            path: file.path,
            type: 'PDF',
            uploadedBy: req.user._id,
        });
    }

    /**
     * Upload thumbnail for courses
     */
    @Post('image')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: imageStorage,
            fileFilter: imageFileFilter,
            limits: { fileSize: MAX_IMAGE_SIZE },
        }),
    )
    async uploadImage(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: any,
    ) {
        if (!file) {
            throw new BadRequestException('No image file provided');
        }

        return this.uploadsService.saveFileMetadata({
            filename: file.filename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            path: file.path,
            type: 'IMAGE',
            uploadedBy: req.user._id,
        });
    }
}
