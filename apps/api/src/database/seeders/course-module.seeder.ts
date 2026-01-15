import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CourseModule,
  ModuleContentType,
} from '../../modules/course-modules/schemas/course-module.schema';

@Injectable()
export class CourseModuleSeeder {
  constructor(
    @InjectModel(CourseModule.name)
    private readonly moduleModel: Model<CourseModule>,
  ) {}

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
        description: 'Présentation générale du cours',
        courseId: fakeCourseId,
        order: 1,
        type: ModuleContentType.VIDEO,
        contentUrl: 'https://example.com/video-intro',
        isActive: true,
        metadata: { duration: 120 },
      },
      {
        title: 'Support PDF',
        description: 'Document PDF du module',
        courseId: fakeCourseId,
        order: 2,
        type: ModuleContentType.PDF,
        contentUrl: 'https://example.com/module.pdf',
        isActive: true,
        metadata: { pages: 45 },
      },
    ]);

    console.log('CourseModules seedés');
    console.log('fakeCourseId :', fakeCourseId.toHexString());

    return fakeCourseId;
  }
}
