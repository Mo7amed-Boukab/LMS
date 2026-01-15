import { Module } from '@nestjs/common';
import { QuizService } from './services/quiz.service';
import { QuizController } from './controllers/quiz.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizSchema } from './schema/quiz.schema';
import { QuizQuestionsService } from './services/quiz-questions.service';
import { QuizQuestionsController } from './controllers/quiz-questions.controller';
import { QuizOptionsController } from './controllers/quiz-options.controller';
import { QuizOptionsService } from './services/quiz-options.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Quiz', schema: QuizSchema }])],
  controllers: [QuizController, QuizQuestionsController, QuizOptionsController],
  providers: [QuizService, QuizQuestionsService, QuizOptionsService],
})
export class QuizModule {}
