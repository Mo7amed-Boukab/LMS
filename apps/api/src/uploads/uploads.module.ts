import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { FileUpload, FileUploadSchema } from './schemas/file-upload.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: FileUpload.name, schema: FileUploadSchema },
        ]),
    ],
    controllers: [UploadsController],
    providers: [UploadsService],
    exports: [UploadsService],
})
export class UploadsModule { }
