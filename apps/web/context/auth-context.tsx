"use client";

import {
    authService,
    LoginCredentials,
    RegisterData,
    Role,
    User,
} from "@/lib/auth-service";
import { tokenStorage } from "@/lib/token-storage";
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
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = tokenStorage.get();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userProfile = await authService.getProfile();
        setUser(userProfile);
      } catch (error: any) {
        console.error("Failed to fetch profile:", error);
        tokenStorage.remove();
        if (error.message === "Unauthorized" || error.message?.includes("401")) {
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      tokenStorage.set(response.access_token);

      const userProfile = await authService.getProfile();
      setUser(userProfile);

      // Handle Redirection based on Role
      if (userProfile.role === Role.Formateur) {
        router.push("/teacher");
      } else if (userProfile.role === Role.Apprenant) {
        router.push("/");
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

  const logout = () => {
    tokenStorage.remove();
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
