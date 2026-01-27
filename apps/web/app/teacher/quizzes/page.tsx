import React from "react";
import Link from "next/link";
import { Plus } from 'lucide-react';
import QuizTable from "@/components/quiz/QuizTable";
import { quizApi } from "@/lib/services/quizService";
import { Quiz } from "@/lib/types/quiz";


const QuizzesPage: React.FC = async () => {
  let quizzes: Quiz[] = [];
  let error = null;
    try {
    quizzes = await quizApi.getAll();
  } catch (err: any) {
    error = err.message;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestion des Quizzes</h1>
        <Link
          href="./quizzes/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          Créer un Quiz
        </Link>
      </div>

      {error ? (
        <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-600">Erreur: {error}</p>
        </div>
      ) : (
        <QuizTable initialQuizzes={quizzes} />
      )}
    </div>
  );
};

export default QuizzesPage;
