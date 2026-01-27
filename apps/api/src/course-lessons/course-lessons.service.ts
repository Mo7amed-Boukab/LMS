import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  CourseLesson,
  CourseLessonDocument,
  LessonContentType,
} from './schemas/course-lesson.schema';
import { CreateCourseLessonDto } from './dto/create-course-lesson.dto';
import { UpdateCourseLessonDto } from './dto/update-course-lesson.dto';

import {
  Module as CourseModuleEntity,
  CourseModuleDocument,
} from 'src/course-modules/schemas/course-module.schema';
import { Course, CourseDocument } from 'src/courses/schemas/course.schema';

@Injectable()
export class CourseLessonsService {
  constructor(
    @InjectModel(CourseLesson.name)
    private readonly courseLessonModel: Model<CourseLessonDocument>,

    @InjectModel(CourseModuleEntity.name)
    private readonly courseModuleModel: Model<CourseModuleDocument>,

    @InjectModel(Course.name)
    private readonly courseModel: Model<CourseDocument>,
  ) {}

  /* -------------------------------------------------------------------------- */
  /*                               CREATE LESSON                                 */
  /* -------------------------------------------------------------------------- */
  async create(
    createDto: CreateCourseLessonDto,
    userId: string,
  ): Promise<CourseLesson> {
    if (!Types.ObjectId.isValid(createDto.moduleId)) {
      throw new BadRequestException('Invalid moduleId');
    }

    // Valider les metadata selon le type
    this.validateMetadata(createDto.type, createDto.metadata);

    // Vérifier que le module existe
    const module = await this.courseModuleModel
      .findById(createDto.moduleId)
      .exec();

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    // Vérifier que l'utilisateur possède le cours
    const course = await this.courseModel.findById(module.courseId).exec();

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (!course.instructorId.equals(userId)) {
      throw new ForbiddenException('You do not own this course');
    }

    // Calculer l'ordre si non fourni
    let order = createDto.order;
    if (order === undefined) {
      const lastLesson = await this.courseLessonModel
        .findOne({ moduleId: new Types.ObjectId(createDto.moduleId) })
        .sort({ order: -1 })
        .lean()
        .exec();
      order = lastLesson ? lastLesson.order + 1 : 1;
    }

    const lesson = new this.courseLessonModel({
      ...createDto,
      order,
      moduleId: module._id,
    });

    return lesson.save();
  }

  /* -------------------------------------------------------------------------- */
  /*                         GET LESSONS BY MODULE                                */
  /* -------------------------------------------------------------------------- */
  async getLessonsByModule(moduleId: string): Promise<CourseLesson[]> {
    if (!Types.ObjectId.isValid(moduleId)) {
      throw new BadRequestException('Invalid moduleId');
    }

    return this.courseLessonModel
      .find({ moduleId: new Types.ObjectId(moduleId), isActive: true })
      .sort({ order: 1 })
      .lean()
      .exec();
  }

  /* -------------------------------------------------------------------------- */
  /*                               FIND ONE LESSON                                */
  /* -------------------------------------------------------------------------- */
  async findOne(id: string): Promise<CourseLesson> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid lesson id');
    }

    const lesson = await this.courseLessonModel.findById(id).exec();

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  /* -------------------------------------------------------------------------- */
  /*                               UPDATE LESSON                                  */
  /* -------------------------------------------------------------------------- */
  async update(
    id: string,
    updateDto: UpdateCourseLessonDto,
    userId: string,
  ): Promise<CourseLesson> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid lesson id');
    }

    const lesson = await this.courseLessonModel.findById(id).exec();

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Vérifier la propriété du cours
    const module = await this.courseModuleModel
      .findById(lesson.moduleId)
      .exec();

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

    // Valider les metadata si type ou metadata sont modifiés
    if (updateDto.type || updateDto.metadata) {
      const type = updateDto.type || lesson.type;
      const metadata = updateDto.metadata || lesson.metadata;
      this.validateMetadata(type, metadata);
    }

    Object.assign(lesson, updateDto);
    return lesson.save();
  }

  /* -------------------------------------------------------------------------- */
  /*                             REORDER LESSONS                                  */
  /* -------------------------------------------------------------------------- */
  async reorderLessons(moduleId: string, lessonIds: string[]): Promise<void> {
    if (!Types.ObjectId.isValid(moduleId)) {
      throw new BadRequestException('Invalid moduleId');
    }

    const bulkOps = lessonIds.map((lessonId, index) => ({
      updateOne: {
        filter: {
          _id: new Types.ObjectId(lessonId),
          moduleId: new Types.ObjectId(moduleId),
        },
        update: { $set: { order: index + 1 } },
      },
    }));

    if (bulkOps.length > 0) {
      await this.courseLessonModel.bulkWrite(bulkOps);
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                             VALIDATE METADATA                                */
  /* -------------------------------------------------------------------------- */
  private validateMetadata(type: LessonContentType, metadata: any) {
    if (!metadata) return;

    if (type === LessonContentType.VIDEO) {
      if (
        metadata.duration !== undefined &&
        typeof metadata.duration !== 'number'
      ) {
        throw new BadRequestException(
          'Video metadata duration must be a number',
        );
      }
    } else if (type === LessonContentType.PDF) {
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
  /*                               DELETE LESSON                                  */
  /* -------------------------------------------------------------------------- */
  async remove(id: string, userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid lesson id');
    }

    const lesson = await this.courseLessonModel.findById(id).exec();

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Vérifier la propriété du cours
    const module = await this.courseModuleModel
      .findById(lesson.moduleId)
      .exec();

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

    await lesson.deleteOne();
  }
}
