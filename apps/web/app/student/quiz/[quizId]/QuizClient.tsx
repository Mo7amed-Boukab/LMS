"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QuizHeader from "@/components/quiz/student/QuizHeader";
import QuizQuestion from "@/components/quiz/student/QuizQuestion";
import QuizActions from "@/components/quiz/student/QuizActions";
import QuizNavigator from "@/components/quiz/student/QuizNavigator";

interface QuizClientProps {
  quiz: any;
  quizId: string;
}

export default function QuizClient({ quiz, quizId }: QuizClientProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`quiz-${quizId}-answers`);
    if (saved) setAnswers(JSON.parse(saved));
  }, [quizId]);

  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem(`quiz-${quizId}-answers`, JSON.stringify(answers));
    }
  }, [answers, quizId]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== quiz.questions.length) {
      alert("Please answer all questions!");
      return;
    }

    if (!confirm("Submit quiz? You cannot change answers after.")) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        alert("Session expired. Please login again.");
        return;
      }

      const formattedAnswers = Object.entries(answers).map(
        ([questionId, selectedOptionId]) => ({ questionId, selectedOptionId })
      );

      const res = await fetch(
        `http://localhost:4000/quiz-attempts/quiz/${quizId}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ answers: formattedAnswers }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert("Error submitting quiz: " + (result.message || "Unknown error"));
        setIsSubmitting(false);
        return;
      }

      localStorage.removeItem(`quiz-${quizId}-answers`);
      router.push(`/student/quiz/${quizId}/results/${result.attemptId}`);
    } catch (error) {
      alert("Error submitting quiz");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <QuizHeader
          title={quiz.title}
          passingScore={quiz.passingScore}
          currentQuestion={currentIndex + 1}
          totalQuestions={quiz.questions.length}
          answeredCount={Object.keys(answers).length}
        />

        <QuizQuestion
          question={quiz.questions[currentIndex]}
          selectedOption={answers[quiz.questions[currentIndex]._id]}
          onSelectOption={handleSelectOption}
        />

        <QuizActions
          currentIndex={currentIndex}
          totalQuestions={quiz.questions.length}
          answeredCount={Object.keys(answers).length}
          isSubmitting={isSubmitting}
          onPrevious={() => setCurrentIndex((prev) => prev - 1)}
          onNext={() => setCurrentIndex((prev) => prev + 1)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
