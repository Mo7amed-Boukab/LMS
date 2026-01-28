import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { quizApi } from '@/lib/services/quizService';
import QuestionList from '@/components/quiz/QuestionList';
import { questionApi } from '@/lib/services/questionService';
import QuizHeader from '@/components/quiz/QuizHeader';
import { Question } from '@/lib/types/quiz';

export default async function QuizDetailPage({ 
  params 
}: { 
  params: { quizId: string } 
}) {
  const {quizId} = await params;
  let quiz = null;
  let questions: Question[] = [];
  let error = null;

  try {
    [quiz, questions] = await Promise.all([
      quizApi.getById(quizId),
      questionApi.getAll(quizId),
    ]);
  } catch (err: any) {
    if (err.message.includes('non trouvé')) {
      notFound();
    }
    error = err.message;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-600">Erreur: {error}</p>
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link
        href="/teacher/quizzes"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 inline-flex"
      >
        <ArrowLeft size={20} />
        Retour aux quizzes
      </Link>

      <QuizHeader quiz={quiz} questionsCount={questions.length} />
      
      <div className="mt-6">
        <QuestionList 
          quizId={quizId} 
          initialQuestions={questions}
          quizStatus={quiz.status}
        />
      </div>
    </div>
  );
}