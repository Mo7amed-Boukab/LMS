// components/quiz/QuizActions.tsx
'use client';

import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

interface QuizActionsProps {
  currentIndex: number;
  totalQuestions: number;
  answeredCount: number;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export default function QuizActions({
  currentIndex,
  totalQuestions,
  answeredCount,
  isSubmitting,
  onPrevious,
  onNext,
  onSubmit,
}: QuizActionsProps) {
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const allAnswered = answeredCount === totalQuestions;

  return (
    <div className="flex justify-between items-center">
      <button
        onClick={onPrevious}
        disabled={currentIndex === 0}
        className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Previous
      </button>

      {isLastQuestion ? (
        <button
          onClick={onSubmit}
          disabled={isSubmitting || !allAnswered}
          className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Submit Quiz
            </>
          )}
        </button>
      ) : (
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Next
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}