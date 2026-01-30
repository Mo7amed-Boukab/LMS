import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course, CourseDocument } from './schemas/course.schema';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name)
    private readonly courseModel: Model<CourseDocument>,
  ) {}

  async create(
    createCourseDto: CreateCourseDto,
    instructorId: string,
  ): Promise<CourseDocument> {
    if (!Types.ObjectId.isValid(instructorId)) {
      throw new BadRequestException('Invalid instructor id');
    }

    try {
      const course = new this.courseModel({
        ...createCourseDto,
        instructorId: new Types.ObjectId(instructorId),
      });
      return await course.save();
    } catch (error: any) {
      if (error?.code === 11000) {
        throw new ConflictException('Course title already exists');
      }
      throw error;
    }
  }

  async findAll(instructorId: string): Promise<CourseDocument[]> {
    if (!Types.ObjectId.isValid(instructorId)) {
      throw new BadRequestException('Invalid instructor id');
    }

    return this.courseModel
      .find({ instructorId: new Types.ObjectId(instructorId) })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async findOne(id: string, instructorId: string): Promise<CourseDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid course id');
    }
    if (!Types.ObjectId.isValid(instructorId)) {
      throw new BadRequestException('Invalid instructor id');
    }

    const course = await this.courseModel.findById(id).exec();
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (!course.instructorId.equals(instructorId)) {
      throw new ForbiddenException('You do not own this course');
    }

    return course;
  }

  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
    instructorId: string,
  ): Promise<CourseDocument> {
    const course = await this.findOne(id, instructorId);
    Object.assign(course, updateCourseDto);
    return course.save();
  }

  async remove(id: string, instructorId: string): Promise<void> {
    const course = await this.findOne(id, instructorId);
    await course.deleteOne();
  }

  // Public methods for student/unauthenticated access
  async findAllPublic(filters?: {
    category?: string;
    level?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ courses: any[]; total: number; page: number; pages: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const skip = (page - 1) * limit;

    const query: any = {
      isPublicVisible: true,
      status: 'published',
    };

    if (filters?.category) {
      if (filters.category.includes(',')) {
        query.category = { $in: filters.category.split(',') };
      } else {
        query.category = filters.category;
      }
    }

    if (filters?.level) {
      query.level = filters.level;
    }

    if (filters?.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const [courses, total] = await Promise.all([
      this.courseModel
        .find(query)
        .populate('instructorId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.courseModel.countDocuments(query).exec(),
    ]);

    return {
      courses,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async findOnePublic(id: string): Promise<any> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid course id');
    }

    const course = await this.courseModel
      .findOne({ _id: id, isPublicVisible: true, status: 'published' })
      .populate('instructorId', 'firstName lastName email')
      .lean()
      .exec();

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }
}
