import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CourseModule, CourseModuleDocument } from './schemas/course-module.schema';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';

@Injectable()
export class CourseModulesService {
  constructor(
    @InjectModel(CourseModule.name)
    private readonly courseModuleModel: Model<CourseModuleDocument>,
  ) { }

  async create(createDto: CreateCourseModuleDto): Promise<CourseModule> {
    const createdModule = new this.courseModuleModel({
      ...createDto,
      courseId: new Types.ObjectId(createDto.courseId)
    });
    return createdModule.save();
  }

  async findAllByCourse(courseId: string): Promise<CourseModule[]> {
    if (!Types.ObjectId.isValid(courseId)) {
      throw new BadRequestException('Invalid courseId');
    }

    return this.courseModuleModel
      .find({ courseId: new Types.ObjectId(courseId), isActive: true })
      .sort({ order: 1 })
      .lean()
      .exec();
  }

  async getModulesByCourse(courseId: string): Promise<CourseModule[]> {
    return this.findAllByCourse(courseId);
  }

  async findOne(id: string): Promise<CourseModule> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ID format`);
    }
    const module = await this.courseModuleModel.findById(id).exec();
    if (!module) {
      throw new NotFoundException(`Module #${id} not found`);
    }
    return module;
  }

  async update(id: string, updateDto: UpdateCourseModuleDto): Promise<CourseModule> {
    const updatedModule = await this.courseModuleModel.findByIdAndUpdate(
      id,
      updateDto,
      { new: true }
    ).exec();
    if (!updatedModule) {
      throw new NotFoundException(`Module #${id} not found`);
    }
    return updatedModule;
  }

  async remove(id: string): Promise<void> {
    const result = await this.courseModuleModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Module #${id} not found`);
    }
  }
}
