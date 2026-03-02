"use client";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import QuizClient from "./QuizClient";

interface QuizData {
  quizId: string;
  title: string;
  passingScore: number;
  totalQuestions: number;
  questions: any[];
}

export default function QuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const resolvedParams = use(params);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await apiClient.get<QuizData>(
          `/quiz-attempts/quiz/${resolvedParams.quizId}/start`
        );
        setQuiz(data);
      } catch (err: any) {
        console.error("Error fetching quiz:", err);
        setError(err.message || "Failed to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [resolvedParams.quizId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {error === "Quiz not found" ? "Quiz Not Found" : "Access Denied"}
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">{error || "Unable to load this quiz."}</p>
          <button 
            onClick={() => router.back()}
            className="mt-6 px-6 py-2 bg-red-700 text-white rounded hover:bg-red-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50 flex flex-col">
        <QuizClient quiz={quiz} quizId={resolvedParams.quizId} />
      </main>
      <Footer />
    </div>
  );
}
