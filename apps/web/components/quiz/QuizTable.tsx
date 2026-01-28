"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Eye, CheckCircle } from "lucide-react";
import { Quiz, QuizStatus } from "@/lib/types/quiz";
import { quizApi } from "@/lib/services/quizService";

interface QuizTableProps {
  initialQuizzes: Quiz[];
}

export default function QuizTable({ initialQuizzes }: QuizTableProps) {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes);

  const handleDelete = async (id: string) => {
    try {
      await quizApi.delete(id);
      setQuizzes((prev) => prev.filter((q) => q._id !== id));
    } catch (error) {
      console.log("erreur lors de la suppression du quiz");
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await quizApi.publish(id);
      setQuizzes(
        quizzes.map((q) =>
          q._id === id ? { ...q, status: QuizStatus.PUBLISHED } : q
        )
      );
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (quizzes.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 mb-4">Aucun quiz créé</p>
        <button
          onClick={() => router.push("teacher/quizzes/create")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Créer votre premier quiz
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Titre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Module
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Passing score
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Questions
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {quizzes.map((quiz) => (
            <tr key={quiz._id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {quiz.title}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {quiz.moduleId.title}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{quiz.status}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {quiz.passingScore}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {quiz.questions?.length || 0} question(s)
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => router.push(`/teacher/quizzes/${quiz._id}`)}
                    className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition cursor-pointer"
                    title="Voir/Éditer"
                  >
                    <Eye size={18} />
                  </button>

                  {quiz.status === QuizStatus.DRAFT && (
                    <button
                      onClick={() => handlePublish(quiz._id)}
                      className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title={
                        !quiz.questions || quiz.questions.length < 4
                          ? "Au moins 4 questions requises"
                          : "Publier"
                      }
                      disabled={!quiz.questions || quiz.questions.length < 4}
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(quiz._id)}
                    className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition disabled:opacity-50 cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
