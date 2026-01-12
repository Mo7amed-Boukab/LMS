import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  CourseModule,
  CourseModuleDocument,
  ModuleContentType,
} from './schemas/course-module.schema';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';

import { Course, CourseDocument } from '../courses/schemas/course.schema';

@Injectable()
export class CourseModulesService {
  constructor(
    @InjectModel(CourseModule.name)
    private readonly courseModuleModel: Model<CourseModuleDocument>,

    @InjectModel(Course.name)
    private readonly courseModel: Model<CourseDocument>,
  ) {}

  /* -------------------------------------------------------------------------- */
  /*                               CREATE MODULE                                 */
  /* -------------------------------------------------------------------------- */
  async create(
    createDto: CreateCourseModuleDto,
    userId: string,
  ): Promise<CourseModule> {
    if (!Types.ObjectId.isValid(createDto.courseId)) {
      throw new BadRequestException('Invalid courseId');
    }

    this.validateMetadata(createDto.type, createDto.metadata);

    const course = await this.courseModel.findById(createDto.courseId).exec();

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (!course.ownerId.equals(userId)) {
      throw new ForbiddenException('You do not own this course');
    }

    let order = createDto.order;
    if (order === undefined) {
      const lastModule = await this.courseModuleModel
        .findOne({ courseId: new Types.ObjectId(createDto.courseId) })
        .sort({ order: -1 })
        .lean()
        .exec();
      order = lastModule ? lastModule.order + 1 : 1;
    }

    const module = new this.courseModuleModel({
      ...createDto,
      order,
      courseId: course._id,
    });

    return module.save();
  }

  /* -------------------------------------------------------------------------- */
  /*                         GET MODULES BY COURSE                                */
  /* -------------------------------------------------------------------------- */
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

  /* -------------------------------------------------------------------------- */
  /*                               FIND ONE MODULE                                */
  /* -------------------------------------------------------------------------- */
  async findOne(id: string): Promise<CourseModule> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid module id');
    }

    const module = await this.courseModuleModel.findById(id).exec();

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    return module;
  }

  /* -------------------------------------------------------------------------- */
  /*                               UPDATE MODULE                                  */
  /* -------------------------------------------------------------------------- */
  async update(
    id: string,
    updateDto: UpdateCourseModuleDto,
    userId: string,
  ): Promise<CourseModule> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid module id');
    }

    const module = await this.courseModuleModel.findById(id).exec();

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    const course = await this.courseModel.findById(module.courseId).exec();

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (!course.ownerId.equals(userId)) {
      throw new ForbiddenException('You do not own this course');
    }

    if (updateDto.type || updateDto.metadata) {
      const type = updateDto.type || module.type;
      const metadata = updateDto.metadata || module.metadata;
      this.validateMetadata(type, metadata);
    }

    Object.assign(module, updateDto);
    return module.save();
  }

  /* -------------------------------------------------------------------------- */
  /*                             REORDER MODULES                                  */
  /* -------------------------------------------------------------------------- */
  async reorderModules(courseId: string, moduleIds: string[]): Promise<void> {
    if (!Types.ObjectId.isValid(courseId)) {
      throw new BadRequestException('Invalid courseId');
    }

    const bulkOps = moduleIds.map((moduleId, index) => ({
      updateOne: {
        filter: {
          _id: new Types.ObjectId(moduleId),
          courseId: new Types.ObjectId(courseId),
        },
        update: { $set: { order: index + 1 } },
      },
    }));

    if (bulkOps.length > 0) {
      await this.courseModuleModel.bulkWrite(bulkOps);
    }
  }

  private validateMetadata(type: ModuleContentType, metadata: any) {
    if (!metadata) return;

    if (type === ModuleContentType.VIDEO) {
      if (
        metadata.duration !== undefined &&
        typeof metadata.duration !== 'number'
      ) {
        throw new BadRequestException(
          'Video metadata duration must be a number',
        );
      }
    } else if (type === ModuleContentType.PDF) {
      if (
        metadata.pageCount !== undefined &&
        typeof metadata.pageCount !== 'number'
      ) {
        throw new BadRequestException(
          'PDF metadata pageCount must be a number',
        );
      }
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                               DELETE MODULE                                  */
  /* -------------------------------------------------------------------------- */
  async remove(id: string, userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid module id');
    }

    const module = await this.courseModuleModel.findById(id).exec();

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    const course = await this.courseModel.findById(module.courseId).exec();

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (!course.ownerId.equals(userId)) {
      throw new ForbiddenException('You do not own this course');
    }

    await module.deleteOne();
  }
}
