import { apiClient } from "./api-client";

export enum Role {
  Apprenant = "apprenant",
  Formateur = "formateur",
  Admin = "admin",
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  access_token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/auth/login", credentials);
  },

  async register(data: RegisterData): Promise<User> {
    return apiClient.post<User>("/auth/register", data);
  },

  async getProfile(): Promise<User> {
    return apiClient.get<User>("/auth/profile");
  },

  async logout(): Promise<void> {
    return apiClient.post("/auth/logout");
  },
};
