import { Module } from '@nestjs/common';
import { QuizService } from './services/quiz.service';
import { QuizController } from './controllers/quiz.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizSchema } from './schema/quiz.schema';
import { QuizQuestionsService } from './services/quiz-questions.service';
import { QuizQuestionsController } from './controllers/quiz-questions.controller';
import {
  Module as CourseModuleEntity,
  CourseModuleSchema,
} from 'src/course-modules/schemas/course-module.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Quiz', schema: QuizSchema },
      { name: CourseModuleEntity.name, schema: CourseModuleSchema },
    ]),
  ],
  controllers: [QuizController, QuizQuestionsController],
  providers: [QuizService, QuizQuestionsService],
})
export class QuizModule {}
