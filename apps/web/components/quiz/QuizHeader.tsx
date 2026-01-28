'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Quiz, QuizStatus } from '@/lib/types/quiz';
import { CheckCircle } from 'lucide-react';
import { quizApi } from '@/lib/services/quizService';

interface QuizHeaderProps {
  quiz: Quiz;
  questionsCount: number;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({ quiz, questionsCount }) => {
  const router = useRouter();
  const [publishing, setPublishing] = useState(false);

  const handlePublish = async () => {
    try {
      setPublishing(true);
      await quizApi.publish(quiz._id);
      alert('Quiz publié avec succès !');
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setPublishing(false);
    }
  };

  const canPublish = quiz.status === QuizStatus.DRAFT && questionsCount >= 4;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>
              <span className="font-medium">Module:</span> {quiz.moduleId.title}
            </span>
            <span>
              <span className="font-medium">Score requis:</span> {quiz.passingScore}%
            </span>
            <span>
              <span className="font-medium">Questions:</span> {questionsCount}
            </span>
          </div>
          <div className="mt-3">
            {quiz.status === QuizStatus.PUBLISHED ? (
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                ✓ Publié
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium">
                Brouillon
              </span>
            )}
          </div>
        </div>
        
        {quiz.status === QuizStatus.DRAFT && (
          <button
            onClick={handlePublish}
            disabled={!canPublish || publishing}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            title={!canPublish ? 'Au moins 4 questions requises' : 'Publier le quiz'}
          >
            {publishing ? (
              <>
                <div className="w-[18px] h-[18px] border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Publication...</span>
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                <span>Publier</span>
              </>
            )}
          </button>
        )}
      </div>

      {quiz.status === QuizStatus.DRAFT && questionsCount < 4 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-sm">
          <strong>Attention:</strong> Au moins 4 questions sont requises pour publier ce quiz. 
          Actuellement: {questionsCount}/4
        </div>
      )}
    </div>
  );
}

export default QuizHeader;