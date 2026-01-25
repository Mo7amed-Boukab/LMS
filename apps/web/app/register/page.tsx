"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "../../components/AuthLayout";
import InputField from "../../components/InputField";
import SocialButton from "../../components/SocialButton";
import { authService } from "@/lib/auth-service";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = (provider: string) => {
    console.log(`Registering with ${provider}`);
    // TODO: Implement social registration
  };

  return (
    <AuthLayout>
      <h1 className="text-center text-2xl font-extrabold text-gray-800">
        Create Account
      </h1>
      <p className="text-center text-sm text-gray-500 mt-2">
        Join ED Academy and start your learning journey today.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}
        <InputField
          {...register("firstName")}
          id="firstName"
          label="First Name"
          icon="person"
          type="text"
          placeholder="John"
          error={errors.firstName?.message}
          required
        />

        <InputField
          {...register("lastName")}
          id="lastName"
          label="Last Name"
          icon="person"
          type="text"
          placeholder="Doe"
          error={errors.lastName?.message}
          required
        />

        <InputField
          {...register("email")}
          id="email"
          label="Email Address"
          icon="mail"
          type="email"
          placeholder="name@edacademy.com"
          error={errors.email?.message}
          required
        />

        <InputField
          {...register("password")}
          id="password"
          label="Password"
          icon="lock"
          type="password"
          placeholder="••••••••"
          showPasswordToggle
          error={errors.password?.message}
          required
        />

        <InputField
          {...register("confirmPassword")}
          id="confirmPassword"
          label="Confirm Password"
          icon="lock"
          type="password"
          placeholder="••••••••"
          showPasswordToggle
          error={errors.confirmPassword?.message}
          required
        />

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl shadow-xl transform-gpu transition hover:translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
            <span className="material-symbols-outlined text-[16px]">
              arrow_forward
            </span>
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex-1 h-px bg-gray-200" />
          <span className="whitespace-nowrap">OR CONTINUE WITH</span>
          <span className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <SocialButton
            provider="google"
            onClick={() => handleSocialRegister("google")}
          />
          <SocialButton
            provider="microsoft"
            onClick={() => handleSocialRegister("microsoft")}
          />
        </div>

        <p className="mt-5 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-gray-800 hover:underline"
          >
            Sign in now
          </Link>
        </p>
      </div>

      <div className="mt-6 pt-6 text-center text-xs text-gray-400 border-t">
        <div className="flex items-center justify-center gap-6">
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
          <a href="#" className="hover:underline">
            Help Center
          </a>
        </div>
      </div>
    </AuthLayout>
  );
}
