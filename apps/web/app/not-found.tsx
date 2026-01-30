"use client";

import { AlertCircle, Home, Search } from "lucide-react";
import Link from "next/link";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-[#1a1a1a]">
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center p-4 my-8 text-center">
        <div className="max-w-md w-full animate-fadeIn">
          {/* Illustration/Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-red-700 mx-auto">
              <AlertCircle size={48} />
            </div>
          </div>
          
          {/* 404 Text */}
          <h1 className="text-8xl font-black text-gray-200 mb-4 tracking-tighter">404</h1>
          <h2 className="text-3xl font-bold mb-4 text-[#1a1a1a]">Page Not Found</h2>
          
          <p className="text-gray-500 mb-8 text-lg">
            Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-red-700 text-white text-sm font-medium rounded hover:bg-red-800 transition-colors shadow-lg shadow-red-700/20"
            >
              <Home size={18} />
              Back to Home
            </Link>
            <Link 
              href="/courses"
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-sm font-medium border border-gray-200 text-[#1a1a1a] rounded hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <Search size={18} />
              Browse Courses
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
