import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CourseModule } from '../../course-modules/schemas/course-module.schema';

@Injectable()
export class CourseModuleSeeder {
  constructor(
    @InjectModel(CourseModule.name)
    private readonly moduleModel: Model<CourseModule>,
  ) { }

  async seed(): Promise<Types.ObjectId> {
    const existing = await this.moduleModel.findOne({
      title: 'Introduction au cours',
    });

    if (existing) {
      console.log('CourseModules déjà seedés');
      return existing.courseId;
    }

    const fakeCourseId = new Types.ObjectId();

    await this.moduleModel.insertMany([
      {
        title: 'Introduction au cours',
        courseId: fakeCourseId,
        order: 1,
        isActive: true,
      },
      {
        title: 'Chapitre 1 : Les bases',
        courseId: fakeCourseId,
        order: 2,
        isActive: true,
      },
    ]);

    console.log('CourseModules seedés');
    console.log('fakeCourseId :', fakeCourseId.toHexString());

    return fakeCourseId;
  }
}
