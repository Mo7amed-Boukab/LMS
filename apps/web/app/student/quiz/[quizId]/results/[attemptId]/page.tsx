"use client";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import ResultClient from "./ResultClient";

interface ResultsData {
  attemptId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  [key: string]: any;
}

async function getResults(attemptId: string, token: string) {
  try {
    const res = await fetch(
      `http://localhost:4000/quiz-attempts/${attemptId}/results`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export default function ResultsPage({
  params,
}: {
  params: Promise<{ quizId: string; attemptId: string }>;
}) {
  const resolvedParams = use(params);
  const [results, setResults] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/quiz-attempts/${resolvedParams.attemptId}/results`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        if (!res.ok) {
           if (res.status === 401) {
             router.push('/login');
             return;
           }
           setResults(null);
        } else {
           const data = await res.json();
           setResults(data);
        }
      } catch (err) {
        console.error("Failed to fetch results:", err);
        setResults(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [resolvedParams.attemptId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Failed to load results</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50 flex flex-col">
        <ResultClient results={results} quizId={resolvedParams.quizId} />
      </main>
      <Footer />
    </div>
  );
}
