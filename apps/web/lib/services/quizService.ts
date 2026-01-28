import { CreateQuizDto, Quiz } from "../types/quiz";

export const quizApi = {
  getAll: async (): Promise<Quiz[]> => {
    console.log(process.env.NEXT_PUBLIC_API_URL);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizzes`, {
      next: { revalidate: 0 },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Erreur lors de la récupération des quizzes");
    return res.json();
  },

  getById: async (id: string): Promise<Quiz> => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/quizzes/${id}`,
      {
        next: { revalidate: 0 },
        cache: "no-store",
      }
    );
    if (!res.ok) throw new Error("Quiz non trouvé");

    return res.json();
  },

  update: async (id: string): Promise<Quiz> => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/quizzes/${id}/questions/${id}`,
      {
        next: { revalidate: 0 },
        cache: "no-store",
      }
    );
    if (!res.ok) throw new Error("Quiz non trouvée");
    return res.json();
  },

  create: async (data: CreateQuizDto): Promise<Quiz> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizzes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Erreur lors de la création");
    }
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/quizzes/${id}`,
      {
        method: "DELETE",
      }
    );
    if (!res.ok) throw new Error("Erreur lors de la suppression");
  },

  publish: async (id: string): Promise<{ message: string; quizId: string }> => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/quizzes/${id}/publish`,
      {
        method: "PATCH",
      }
    );
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Erreur lors de la publication");
    }
    return res.json();
  },
};
