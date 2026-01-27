import QuizForm from '@/components/quiz/QuizForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CreateQuizPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link
        href="/teacher/quizzes"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 inline-flex"
      >
        <ArrowLeft size={20} />
        Retour
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Créer un nouveau quiz</h1>
        <QuizForm />
      </div>
    </div>
  );
}