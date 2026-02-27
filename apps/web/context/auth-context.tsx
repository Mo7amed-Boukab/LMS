"use client";

import {
  authService,
  LoginCredentials,
  RegisterData,
  Role,
  User,
} from "@/lib/auth-service";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state by checking profile
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userProfile = await authService.getProfile();
        setUser(userProfile);
        // Restore the middleware cookie in case the user refreshed the page
        if (typeof window !== 'undefined') {
          const isSecure = window.location.protocol === 'https:';
          const secure = isSecure ? '; Secure' : '';
          document.cookie = `_auth_role=${userProfile.role}; path=/; SameSite=Lax${secure}; Max-Age=${7 * 24 * 60 * 60}`;
        }
      } catch (error) {
        // Silent fail on initial load if not logged in
        console.log("Not authenticated or session expired");
        setUser(null);
        // Clear the cookie if session is gone
        document.cookie = '_auth_role=; path=/; Max-Age=0';
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Sets a lightweight, non-sensitive cookie on the FRONTEND domain so the
  // Next.js middleware (proxy.ts) can detect the session without needing to
  // read the httpOnly API-domain cookies it has no access to.
  const setFrontendSessionCookie = (role: string) => {
    const isSecure = window.location.protocol === 'https:';
    const secure = isSecure ? '; Secure' : '';
    document.cookie = `_auth_role=${role}; path=/; SameSite=Lax${secure}; Max-Age=${7 * 24 * 60 * 60}`;
  };

  const clearFrontendSessionCookie = () => {
    document.cookie = '_auth_role=; path=/; Max-Age=0';
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      await authService.login(credentials);
      // After login, fetch profile to confirm state
      const userProfile = await authService.getProfile();
      setUser(userProfile);

      // Set session cookie on frontend domain for the middleware
      setFrontendSessionCookie(userProfile.role);

      // Handle Redirection based on Role
      if (userProfile.role === Role.Formateur) {
        router.push("/teacher");
      } else {
        router.push("/");
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      await authService.register(data);
      await login({
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error", err);
    }
    clearFrontendSessionCookie();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
