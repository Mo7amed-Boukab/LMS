import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header gradient area */}
        <div className="relative h-36 bg-gradient-to-b from-red-600 via-red-400 to-white flex items-center justify-center">
          <div className="absolute inset-0 opacity-20" aria-hidden="true" />
          <div className="z-10">
            <div className="w-20 h-20 rounded-lg bg-red-700 shadow-lg p-4 flex items-center justify-center border-4 border-white">
              {/* graduation cap icon */}
              <span className="material-symbols-outlined text-white text-[40px]">school</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 pt-10">
          {children}
        </div>
      </div>
    </div>
  );
}
