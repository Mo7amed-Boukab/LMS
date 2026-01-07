import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CourseModulesModule } from './modules/course-modules/course-modules.module';

@Module({
  imports: [DatabaseModule, CourseModulesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
