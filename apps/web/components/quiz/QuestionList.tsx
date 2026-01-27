'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Question, QuizStatus } from '@/lib/types/quiz';
import { Plus } from 'lucide-react';
import { questionApi } from '@/lib/services/questionService';
import QuestionCard from './QuestionCard';
import QuestionForm from './QuestionForm';

interface QuestionListProps {
  quizId: string;
  initialQuestions: Question[];
  quizStatus: QuizStatus;
}

export default function QuestionList({ 
  quizId, 
  initialQuestions,
  quizStatus 
}: QuestionListProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Supprimer cette question ?')) return;
    
    try {
      await questionApi.delete(quizId, questionId);
      setQuestions(questions.filter(q => q._id !== questionId));
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleQuestionAdded = () => {
    setShowAddForm(false);
    router.refresh();
    // Recharger les questions
    questionApi.getAll(quizId).then(setQuestions);
  };

  const handleQuestionUpdated = () => {
    setEditingQuestion(null);
    router.refresh();
    // Recharger les questions
    questionApi.getAll(quizId).then(setQuestions);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">
          Questions ({questions.length})
        </h2>
        {!showAddForm && !editingQuestion && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={18} />
            Ajouter une question
          </button>
        )}
      </div>

      {questions.length < 4 && quizStatus === QuizStatus.DRAFT && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-sm">
          Au moins 4 questions sont requises pour publier ce quiz. ({questions.length}/4)
        </div>
      )}

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <QuestionForm
          quizId={quizId}
          onSuccess={handleQuestionAdded}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Formulaire d'édition */}
      {editingQuestion && (
        <QuestionForm
          quizId={quizId}
          question={editingQuestion}
          onSuccess={handleQuestionUpdated}
          onCancel={() => setEditingQuestion(null)}
        />
      )}

      {/* Liste des questions */}
      {!showAddForm && !editingQuestion && (
        <div className="space-y-4">
          {questions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">Aucune question</p>
              <p className="text-sm text-gray-400">Commencez par en ajouter une !</p>
            </div>
          ) : (
            questions.map((question, index) => (
              <QuestionCard
                key={question._id}
                question={question}
                index={index}
                onEdit={() => setEditingQuestion(question)}
                onDelete={() => handleDeleteQuestion(question._id!)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}