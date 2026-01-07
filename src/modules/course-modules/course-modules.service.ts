import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CourseModule, CourseModuleDocument } from './schemas/course-module.schema';

@Injectable()
export class CourseModulesService {
  constructor(
    @InjectModel(CourseModule.name)
    private readonly courseModuleModel: Model<CourseModuleDocument>,
  ) {}

  async getModulesByCourse(courseId: string): Promise<CourseModule[]> {
    if (!Types.ObjectId.isValid(courseId)) {
      throw new BadRequestException('Invalid courseId');
    }

    return this.courseModuleModel
      .find({ courseId: new Types.ObjectId(courseId), isActive: true })
      .sort({ order: 1 })
      .lean()
      .exec();
  }
}
