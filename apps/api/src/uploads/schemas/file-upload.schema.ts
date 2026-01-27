import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type FileUploadDocument = HydratedDocument<FileUpload>;

@Schema({ timestamps: true })
export class FileUpload {
    @Prop({ required: true })
    filename: string;

    @Prop({ required: true })
    originalName: string;

    @Prop({ required: true })
    mimetype: string;

    @Prop({ required: true })
    size: number;

    @Prop({ required: true })
    path: string;

    @Prop({ required: true, enum: ['VIDEO', 'PDF', 'IMAGE'] })
    type: string;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    })
    uploadedBy: Types.ObjectId;

    createdAt?: Date;
    updatedAt?: Date;
}

export const FileUploadSchema = SchemaFactory.createForClass(FileUpload);

FileUploadSchema.index({ uploadedBy: 1, createdAt: -1 });
FileUploadSchema.index({ type: 1 });
