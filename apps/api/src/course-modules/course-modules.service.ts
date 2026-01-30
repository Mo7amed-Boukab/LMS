import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';
import {
    CourseModuleDocument,
    Module as CourseModuleEntity,
} from './schemas/course-module.schema';

import { Course, CourseDocument } from 'src/courses/schemas/course.schema';

@Injectable()
export class CourseModulesService {
  constructor(
    @InjectModel(CourseModuleEntity.name)
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
  ): Promise<CourseModuleEntity> {
    if (!Types.ObjectId.isValid(createDto.courseId)) {
      throw new BadRequestException('Invalid courseId');
    }

    const course = await this.courseModel.findById(createDto.courseId).exec();

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (!course.instructorId.equals(userId)) {
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
  async getModulesByCourse(courseId: string): Promise<CourseModuleEntity[]> {
    if (!Types.ObjectId.isValid(courseId)) {
      throw new BadRequestException('Invalid courseId');
    }

    return this.courseModuleModel
      .find({ courseId: new Types.ObjectId(courseId), isActive: true })
      .populate('lessons')
      .sort({ order: 1 })
      .lean({ virtuals: true })
      .exec();
  }

  /* -------------------------------------------------------------------------- */
  /*                               FIND ONE MODULE                                */
  /* -------------------------------------------------------------------------- */
  async findOne(id: string): Promise<CourseModuleEntity> {
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
  ): Promise<CourseModuleEntity> {
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

    if (!course.instructorId.equals(userId)) {
      throw new ForbiddenException('You do not own this course');
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

    if (!course.instructorId.equals(userId)) {
      throw new ForbiddenException('You do not own this course');
    }

    await module.deleteOne();
  }
}
