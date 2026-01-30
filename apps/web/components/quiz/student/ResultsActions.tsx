'use client';

import { ArrowLeft } from 'lucide-react';

interface ResultsActionsProps {
  passed: boolean;
  quizId: string;
  onBackToDashboard: () => void;
  onTryAgain: () => void;
}

export default function ResultsActions({
  passed,
  onBackToDashboard,
  onTryAgain,
}: ResultsActionsProps) {
  return (
    <div className="flex gap-4">
      <button
        onClick={onBackToDashboard}
        className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>
      {!passed && (
        <button
          onClick={onTryAgain}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
}