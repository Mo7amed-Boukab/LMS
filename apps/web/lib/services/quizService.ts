import { apiClient } from "../api-client";
import { tokenStorage } from "../token-storage";
import { CreateQuizDto, Quiz } from "../types/quiz";

const getHeaders = () => {
  const token = tokenStorage.get();
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const quizApi = {
  getAll: async (): Promise<Quiz[]> => {
    return apiClient.get<Quiz[]>("/quizzes", {
      headers: getHeaders(),
    });
  },

  getById: async (id: string): Promise<Quiz> => {
    return apiClient.get<Quiz>(`/quizzes/${id}`, {
      headers: getHeaders(),
    });
  },

  create: async (data: CreateQuizDto): Promise<Quiz> => {
    return apiClient.post<Quiz>("/quizzes", data, {
      headers: getHeaders(),
    });
  },

  update: async (id: string, data: Partial<CreateQuizDto>): Promise<Quiz> => {
    return apiClient.request<Quiz>(`/quizzes/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.request<void>(`/quizzes/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
  },

  publish: async (id: string): Promise<{ message: string; quizId: string }> => {
    return apiClient.request<{ message: string; quizId: string }>(
      `/quizzes/${id}/publish`,
      {
        method: "PATCH",
        headers: getHeaders(),
      }
    );
  },

  // Question Management
  addQuestion: async (quizId: string, data: any): Promise<any> => {
    return apiClient.post<any>(`/quizzes/${quizId}/questions`, data, {
      headers: getHeaders(),
    });
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
        headers: getHeaders(),
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
        headers: getHeaders(),
      }
    );
  },
};
