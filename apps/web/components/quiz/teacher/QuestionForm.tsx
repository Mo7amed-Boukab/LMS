"use client";

import { useState } from "react";
import { Question, CreateQuestionDto, QuestionType } from "@/lib/types/quiz";
import { X } from "lucide-react";
import { questionApi } from "@/lib/services/questionService";

interface QuestionFormProps {
  quizId: string;
  question?: Question;
  onSuccess: () => void;
  onCancel: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  quizId,
  question,
  onSuccess,
  onCancel,
}: QuestionFormProps) => {
  const isEditing = !!question;

  const [formData, setFormData] = useState<CreateQuestionDto>({
    text: question?.text || "",
    type: question?.type || QuestionType.QCM,
    options: question?.options.map((o) => ({
      text: o.text,
      isCorrect: o.isCorrect,
    })) || [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { text: "", isCorrect: false }],
    });
  };

  const handleRemoveOption = (index: number) => {
    if (formData.options.length <= 2) {
      setError("Au moins 2 options sont requises");
      return;
    }
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== index),
    });
  };

  const handleOptionChange = (
    index: number,
    field: "text" | "isCorrect",
    value: any
  ) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (!formData.text.trim()) {
      setError("Le texte de la question est requis");
      return;
    }

    if (formData.options.length < 2) {
      setError("Au moins 2 options sont requises");
      return;
    }

    if (!formData.options.some((o) => o.isCorrect)) {
      setError("Au moins une option doit être marquée comme correcte");
      return;
    }

    if (formData.options.some((o) => !o.text.trim())) {
      setError("Toutes les options doivent avoir un texte");
      return;
    }

    try {
      setSubmitting(true);
      if (isEditing) {
        await questionApi.update(quizId, question._id!, formData);
      } else {
        await questionApi.create(quizId, formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-gray-300 rounded-lg p-6 mb-6 bg-gray-50"
    >
      <h3 className="text-lg font-semibold mb-4">
        {isEditing ? "Modifier la question" : "Nouvelle question"}
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Texte de la question */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question *
          </label>
          <textarea
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Entrez votre question ici..."
            required
            disabled={submitting}
          />
        </div>

        {/* Type de question */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de question
          </label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value as QuestionType })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={submitting}
          >
            <option value={QuestionType.QCM}>QCM (Choix multiple)</option>
            <option value={QuestionType.VRAI_FAUX}>Vrai/Faux</option>
          </select>
        </div>

        {/* Options */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Options (minimum 2) *
            </label>
            <button
              type="button"
              onClick={handleAddOption}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              disabled={submitting}
            >
              + Ajouter une option
            </button>
          </div>

          <div className="space-y-2">
            {formData.options.map((option, index) => (
              <div key={index} className="flex gap-2 items-start">
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) =>
                    handleOptionChange(index, "text", e.target.value)
                  }
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={submitting}
                />

                <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="checkbox"
                    checked={option.isCorrect}
                    onChange={(e) =>
                      handleOptionChange(index, "isCorrect", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    disabled={submitting}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Correcte
                  </span>
                </label>

                {formData.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                    disabled={submitting}
                    title="Supprimer cette option"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Cochez "Correcte" pour au moins une option. Plusieurs options
            peuvent être correctes.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          disabled={submitting}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
          disabled={submitting}
        >
          {submitting && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {submitting
            ? "Enregistrement..."
            : isEditing
              ? "Mettre à jour"
              : "Ajouter"}
        </button>
      </div>
    </form>
  );
};

export default QuestionForm;
