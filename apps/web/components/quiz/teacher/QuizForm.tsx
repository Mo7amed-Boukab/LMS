"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateQuizDto } from "@/lib/types/quiz";
import { quizApi } from "@/lib/services/quizService";

const QuizForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateQuizDto>({
    title: "",
    moduleId: "",
    passingScore: 50,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("Le titre est requis");
      return;
    }
    if (!formData.moduleId.trim()) {
      setError("Le module est requis");
      return;
    }
    if (formData.passingScore < 0 || formData.passingScore > 100) {
      setError("Le score de passage doit être entre 0 et 100");
      return;
    }

    try {
      setLoading(true);
      const quiz = await quizApi.create(formData);
      router.push(`/teacher/quizzes`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre du quiz *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Quiz JavaScript"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Le titre du Module *
          </label>
          <input
            type="text"
            value={formData.moduleId}
            onChange={(e) =>
              setFormData({ ...formData, moduleId: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nestjs"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Score de passage (%) *
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.passingScore}
            onChange={(e) =>
              setFormData({
                ...formData,
                passingScore: parseInt(e.target.value) || 0,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
          />
          <p className="mt-1 text-sm text-gray-500">
            Le score minimum requis pour réussir le quiz (0-100)
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Le quiz sera créé avec 0 questions. Vous
            pourrez ajouter des questions après la création.
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
            disabled={loading}
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? "Création..." : "Créer le quiz"}
          </button>
        </div>
      </form>
    </>
  );
};

export default QuizForm;
