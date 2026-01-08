import { Module } from '@nestjs/common';
import { QuizService } from './services/quiz.service';
import { QuizController } from './controllers/quiz.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizSchema } from './entities/quiz.entity';
import { QuizQuestionsService} from './services/quiz-questions.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Quiz', schema: QuizSchema }])],
  controllers: [QuizController],
  providers: [QuizService, QuizQuestionsService],
})
export class QuizModule {}
