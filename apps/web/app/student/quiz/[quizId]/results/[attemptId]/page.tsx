"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
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
      const token = localStorage.getItem("auth_token");

      if (!token) {
        router.push("/login");
        return;
      }

      const data = await getResults(resolvedParams.attemptId, token);
      setResults(data);
      setLoading(false);
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

  return <ResultClient results={results} quizId={resolvedParams.quizId} />;
}
