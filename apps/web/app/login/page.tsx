"use client";

import { useAuth } from "@/context/auth-context";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await login(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Column - Branding/Image */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-zinc-900 text-white overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop')",
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 via-zinc-900/90 to-red-900/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 w-fit">
            <div className="bg-red-700 p-2 rounded-md">
              <GraduationCap className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">ED Academy</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <blockquote className="text-2xl font-medium leading-relaxed">
            "Education is the passport to the future, for tomorrow belongs to
            those who prepare for it today."
          </blockquote>
          <div className="mt-8 flex items-center gap-4">
            <div className="h-0.5 w-12 bg-red-700"></div>
            <p className="text-sm text-zinc-400 font-medium">Malcolm X</p>
          </div>
        </div>

        <div className="relative z-10">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
          >
            Back to Website
            <ArrowRight size={16} className="transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
              <Link href="/" className="bg-red-700 p-2 rounded-md">
                <GraduationCap className="text-white" size={24} />
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Enter your credentials to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-sm text-sm flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    {...register("email")}
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-sm text-sm focus:ring-1 focus:ring-red-500/20 focus:border-red-300 outline-none transition-all placeholder:text-gray-400"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600 font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-red-700 hover:text-red-800 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    {...register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-sm text-sm focus:ring-1 focus:ring-red-500/20 focus:border-red-300 outline-none transition-all placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-700 hover:bg-red-800 text-white py-2.5 rounded-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Facebook Button */}
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-sm hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z"
                    fill="#1877F2"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  Facebook
                </span>
              </button>

              {/* Google Button */}
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-sm hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  Google
                </span>
              </button>
            </div>

            <p className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-red-700 hover:text-red-800 hover:underline transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
