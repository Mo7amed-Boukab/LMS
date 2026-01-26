"use client";

import { useState } from "react";
import { Question } from "@/lib/types/quiz";
import { Edit2, Trash2, CheckCircle } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  onEdit,
  onDelete,
}) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete();
    setDeleting(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-gray-500">
              Question {index + 1}
            </span>
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded font-medium">
              {question.type}
            </span>
          </div>
          <p className="text-lg font-medium text-gray-900">{question.text}</p>
        </div>

        <div className="flex gap-2 ml-4">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
            title="Modifier"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50"
            disabled={deleting}
            title="Supprimer"
          >
            {deleting ? (
              <div className="w-[18px] h-[18px] border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 size={18} />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {question.options.map((option, optIndex) => (
          <div
            key={option._id}
            className={`p-3 rounded flex items-center gap-2 transition ${
              option.isCorrect
                ? "bg-green-50 border border-green-200"
                : "bg-gray-50 border border-gray-100"
            }`}
          >
            <span className="text-sm font-medium text-gray-500 min-w-[24px]">
              {String.fromCharCode(65 + optIndex)}.
            </span>
            <span className="flex-1 text-gray-900">{option.text}</span>
            {option.isCorrect && (
              <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
