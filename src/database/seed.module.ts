import 'dotenv/config';
import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  CourseModule,
  CourseModuleSchema,
} from '../modules/course-modules/schemas/course-module.schema';
import { CourseModuleSeeder } from './seeders/course-moudule.seeder';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI!),
    MongooseModule.forFeature([
      { name: CourseModule.name, schema: CourseModuleSchema },
    ]),
  ],
  providers: [CourseModuleSeeder],
})
export class SeedModule implements OnModuleInit {
  constructor(private readonly courseModuleSeeder: CourseModuleSeeder) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'production') return;

    console.log('Seeding CourseModules...');
    const moduleIds = await this.courseModuleSeeder.seed();

    console.log('Seed terminé');
  }
}
