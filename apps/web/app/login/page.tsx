'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '../components/auth/AuthLayout';
import InputField from '../components/auth/InputField';
import SocialButton from '../components/auth/SocialButton';
import { authService } from '@/lib/auth-service';
import { tokenStorage } from '@/lib/token-storage';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
      const response = await authService.login(data);
      tokenStorage.set(response.access_token);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    // TODO: Implement social login
  };

  return (
    <AuthLayout>
      <h1 className="text-center text-2xl font-extrabold text-gray-800">Welcome Back</h1>
      <p className="text-center text-sm text-gray-500 mt-2">
        Enter your credentials to access the ED Academy portal.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}
        <InputField
          {...register('email')}
          id="email"
          label="Email Address"
          icon="mail"
          type="email"
          placeholder="name@edacademy.com"
          error={errors.email?.message}
          required
        />

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
              Password
            </label>
            <Link href="/forgot-password" className="text-sm text-red-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <InputField
            {...register('password')}
            id="password"
            icon="lock"
            type="password"
            placeholder="••••••••"
            showPasswordToggle
            error={errors.password?.message}
            required
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl shadow-xl transform-gpu transition hover:translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
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
          <SocialButton provider="google" onClick={() => handleSocialLogin('google')} />
          <SocialButton provider="microsoft" onClick={() => handleSocialLogin('microsoft')} />
        </div>

        <p className="mt-5 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold text-gray-800 hover:underline">
            Sign up now
          </Link>
        </p>
      </div>

      <div className="mt-6 pt-6 text-center text-xs text-gray-400 border-t">
        <div className="flex items-center justify-center gap-6">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Help Center</a>
        </div>
      </div>
    </AuthLayout>
  );
}
