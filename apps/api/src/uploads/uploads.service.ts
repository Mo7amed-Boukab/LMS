import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { Model } from 'mongoose';
import * as path from 'path';
import { FileUpload, FileUploadDocument } from './schemas/file-upload.schema';

interface SaveFileMetadataDto {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  type: 'VIDEO' | 'PDF' | 'IMAGE';
  uploadedBy: string;
}

@Injectable()
export class UploadsService {
  constructor(
    @InjectModel(FileUpload.name)
    private readonly fileUploadModel: Model<FileUploadDocument>,
  ) {}

  /**
   * Save file metadata to database
   */
  async saveFileMetadata(data: SaveFileMetadataDto) {
    const fileUpload = new this.fileUploadModel(data);
    await fileUpload.save();

    // Return public URL
    const baseUrl = process.env.API_URL || 'http://localhost:4000';
    const publicPath = data.path.replace(/\\/g, '/');

    return {
      _id: fileUpload._id,
      filename: fileUpload.filename,
      originalName: fileUpload.originalName,
      url: `${baseUrl}/${publicPath}`,
      type: fileUpload.type,
      size: fileUpload.size,
      mimetype: fileUpload.mimetype,
      uploadedAt: fileUpload.createdAt,
    };
  }

  /**
   * Get file by ID
   */
  async getFileById(id: string): Promise<FileUpload | null> {
    return this.fileUploadModel.findById(id).exec();
  }

  /**
   * Delete file from filesystem and database
   */
  async deleteFile(id: string): Promise<void> {
    const file = await this.fileUploadModel.findById(id).exec();

    if (file) {
      // Delete from filesystem
      const filePath = path.join(process.cwd(), file.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Delete from database
      await file.deleteOne();
    }
  }

  /**
   * Get all files uploaded by a user
   */
  async getUserFiles(userId: string): Promise<FileUpload[]> {
    return this.fileUploadModel
      .find({ uploadedBy: userId })
      .sort({ createdAt: -1 })
      .exec();
  }
}
