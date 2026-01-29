// app/student/quiz/[quizId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
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
  const router = useRouter();

  useEffect(() => {
    const fetchQuiz = async () => {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:4000/quiz-attempts/quiz/${resolvedParams.quizId}/start`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          setQuiz(null);
        } else {
          const data = await res.json();
          setQuiz(data);
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setQuiz(null);
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

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Quiz Not Found
          </h2>
          <p className="text-gray-600">Unable to load this quiz.</p>
        </div>
      </div>
    );
  }

  return <QuizClient quiz={quiz} quizId={resolvedParams.quizId} />;
}
