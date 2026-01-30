const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const apiClient = {
  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = "Request failed";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        try {
          errorMessage = await response.text();
        } catch (textError) {
          errorMessage = `Request failed with status ${response.status}`;
        }
      }

      if (response.status === 401) {
        console.warn("Unauthorized request to:", endpoint);
      }

      throw new Error(errorMessage || "Request failed");
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    return response.text() as unknown as T;
  },

  get<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  },

  post<T>(endpoint: string, data?: unknown, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
