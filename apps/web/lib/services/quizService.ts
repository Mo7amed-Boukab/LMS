import { apiClient } from "../api-client";
import { CreateQuizDto, Quiz } from "../types/quiz";

export const quizApi = {
  getAll: async (): Promise<Quiz[]> => {
    return apiClient.get<Quiz[]>("/quizzes");
  },

  getById: async (id: string): Promise<Quiz> => {
    return apiClient.get<Quiz>(`/quizzes/${id}`);
  },

  create: async (data: CreateQuizDto): Promise<Quiz> => {
    return apiClient.post<Quiz>("/quizzes", data);
  },

  update: async (id: string, data: Partial<CreateQuizDto>): Promise<Quiz> => {
    return apiClient.request<Quiz>(`/quizzes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.request<void>(`/quizzes/${id}`, {
      method: "DELETE",
    });
  },

  publish: async (id: string): Promise<{ message: string; quizId: string }> => {
    return apiClient.request<{ message: string; quizId: string }>(
      `/quizzes/${id}/publish`,
      {
        method: "PATCH",
      }
    );
  },

  // Question Management
  addQuestion: async (quizId: string, data: any): Promise<any> => {
    return apiClient.post<any>(`/quizzes/${quizId}/questions`, data);
  },

  updateQuestion: async (
    quizId: string,
    questionId: string,
    data: any
  ): Promise<any> => {
    return apiClient.request<any>(
      `/quizzes/${quizId}/questions/${questionId}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },

  deleteQuestion: async (
    quizId: string,
    questionId: string
  ): Promise<void> => {
    return apiClient.request<void>(
      `/quizzes/${quizId}/questions/${questionId}`,
      {
        method: "DELETE",
      }
    );
  },
};
