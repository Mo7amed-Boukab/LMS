import { Quiz } from "../types/Quiz";

export const quizApi = {
  getAll: async (): Promise<Quiz[]> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizzes`, {
      next: { revalidate: 0 },
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Erreur lors de la récupération des quizzes');
    return res.json();
  },
}