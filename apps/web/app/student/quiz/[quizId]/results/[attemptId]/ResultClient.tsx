"use client";

import { useRouter } from "next/navigation";
import ResultHeaer from "@/components/quiz/student/ResultHeaer";
import ResultDetails from "@/components/quiz/student/ResultDetails";
import ResultsActions from "@/components/quiz/student/ResultsActions";

interface ResultsClientProps {
  results: any;
  quizId: string;
}

export default function ResultsClient({ results, quizId }: ResultsClientProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <ResultHeaer
          passed={results.passed}
          title={results.quizTitle}
          score={results.score}
          correctAnswers={results.correctAnswers}
          totalQuestions={results.totalQuestions}
        />

        <ResultDetails details={results.details} />

        <ResultsActions
          passed={results.passed}
          quizId={quizId}
          onBackToDashboard={() => router.push("/")}
          onTryAgain={() => router.push(`/student/quiz/${quizId}`)}
        />
      </div>
    </div>
  );
}
