import { CreateQuestionDto, Question, UpdateQuestionDto } from "../types/quiz";

export const questionApi = {
  getAll: async (quizId: string): Promise<Question[]> => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/quizzes/${quizId}/questions`,
      {
        next: { revalidate: 0 },
        cache: "no-store",
      }
    );
    if (!res.ok)
      throw new Error("Erreur lors de la récupération des questions");
    return res.json();
  },

  getById: async (quizId: string, questionId: string): Promise<Question> => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/quizzes/${quizId}/questions/${questionId}`,
      {
        next: { revalidate: 0 },
        cache: "no-store",
      }
    );
    if (!res.ok) throw new Error("Question non trouvée");
    return res.json();
  },

  create: async (
    quizId: string,
    data: CreateQuestionDto
  ): Promise<{ message: string; question: Question }> => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/quizzes/${quizId}/questions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Erreur lors de la création");
    }
    return res.json();
  },

  update: async (
    quizId: string,
    questionId: string,
    data: UpdateQuestionDto
  ): Promise<{ message: string; question: Question }> => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/quizzes/${quizId}/questions/${questionId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    if (!res.ok) {
      throw new Error("Erreur lors de la mise à jour du question");
    }
    return res.json();
  },

  delete: async (
    quizId: string,
    questionId: string
  ): Promise<{ message: string }> => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/quizzes/${quizId}/questions/${questionId}`,
      {
        method: "DELETE",
      }
    );
    if (!res.ok) throw new Error("Erreur lors de la suppression");
    return res.json();
  },
};
