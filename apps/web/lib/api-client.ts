const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

let refreshTokenPromise: Promise<Response> | null = null;

export const apiClient = {
  async request<T>(endpoint: string, options?: RequestInit, isRetry = false): Promise<T> {
    let response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      credentials: "include", // Ensure cookies are sent
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (response.status === 401 && !isRetry && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh') && !endpoint.includes('/auth/register')) {
      try {
        if (!refreshTokenPromise) {
          refreshTokenPromise = fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include'
          }).finally(() => {
            refreshTokenPromise = null;
          });
        }
        
        const refreshRes = await refreshTokenPromise;

        if (refreshRes.ok) {
          // Retry original request
          return this.request<T>(endpoint, options, true);
        } else {
          // If refresh fails, clear session and redirect to login
          if (typeof window !== 'undefined') {
             document.cookie = '_auth_role=; path=/; Max-Age=0';
             window.location.href = '/login';
          }
        }
      } catch (error) {
        console.error("Auto-refresh failed", error);
        if (typeof window !== 'undefined') {
             document.cookie = '_auth_role=; path=/; Max-Age=0';
             window.location.href = '/login';
        }
      }
    }

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
