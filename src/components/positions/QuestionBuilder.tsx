import { useState } from "react";
import { QuestionType } from "@/app/types/positions";
import { Button } from "@/components/ui/button";
import { TextInput, TextareaInput, SelectInput, CheckboxInput } from "@/components/positions/questions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TagsInput from "@/components/ui/tags-input";

interface QuestionBuilderProps {
  questions: QuestionType[];
  onChange: (questions: QuestionType[]) => void;
}

export default function QuestionBuilder({ questions, onChange }: QuestionBuilderProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newQuestion, setNewQuestion] = useState<QuestionType>({
    type: "text",
    label: "",
    options: [],
    required: false,
  });
  const [editingQuestion, setEditingQuestion] = useState<QuestionType | null>(null);

  const addQuestion = () => {
    if (newQuestion.label.trim()) {
      onChange([...questions, { ...newQuestion }]);
      setNewQuestion({
        type: "text",
        label: "",
        options: [],
        required: false,
      });
    }
  };

  const startEditing = (index: number) => {
    if (editingIndex === index) {
      // Cancel editing
      setEditingIndex(null);
      setEditingQuestion(null);
    } else {
      // Start editing
      setEditingIndex(index);
      setEditingQuestion({ ...questions[index] });
    }
  };

  const updateQuestion = (index: number, updatedQuestion: QuestionType) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = updatedQuestion;
    onChange(updatedQuestions);
    setEditingIndex(null);
    setEditingQuestion(null);
  };

  const deleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    onChange(updatedQuestions);
  };

  const needsOptions = (type: string) => type === "select" || type === "checkbox";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Application Questions</h3>
        <span className="text-sm text-muted-foreground">{questions.length} questions</span>
      </div>

      {/* Existing Questions */}
      {questions.length > 0 && (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <Card key={index} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Question {index + 1} • {question.type.toUpperCase()}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => startEditing(index)}
                    >
                      {editingIndex === index ? "Cancel" : "Edit"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => deleteQuestion(index)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {editingIndex === index && editingQuestion ? (
                  <div className="space-y-4">
                    <SelectInput
                      id={`edit-question-type-${index}`}
                      label="Question Type"
                      value={editingQuestion.type}
                      onChange={(value) => {
                        const newType = value as QuestionType["type"];
                        setEditingQuestion({
                          ...editingQuestion,
                          type: newType,
                          options: needsOptions(newType) ? [] : undefined
                        });
                      }}
                      options={[
                        { value: "text", label: "Text Input" },
                        { value: "textarea", label: "Long Text" },
                        { value: "select", label: "Single Select" },
                        { value: "checkbox", label: "Multiple Choice" },
                        { value: "file", label: "File Upload" },
                      ]}
                    />

                    <TextareaInput
                      id={`edit-question-text-${index}`}
                      label="Question"
                      value={editingQuestion.label}
                      onChange={(value) => setEditingQuestion({ ...editingQuestion, label: value })}
                      placeholder="Enter your question here..."
                      rows={3}
                    />

                    {needsOptions(editingQuestion.type) && (
                      <TagsInput
                        id={`edit-question-options-${index}`}
                        label="Options"
                        value={editingQuestion.options || []}
                        onChange={(options) => setEditingQuestion({ ...editingQuestion, options })}
                        placeholder="Type an option and press Enter..."
                      />
                    )}

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`edit-question-required-${index}`}
                        checked={editingQuestion.required || false}
                        onChange={(e) => setEditingQuestion({ ...editingQuestion, required: e.target.checked })}
                        className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      />
                      <label htmlFor={`edit-question-required-${index}`} className="text-sm font-medium cursor-pointer">
                        Required question
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={() => updateQuestion(index, editingQuestion)}
                        disabled={!editingQuestion.label.trim()}
                      >
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => startEditing(index)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground mb-2">{question.label}</p>
                    {question.options && question.options.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Options: {question.options.join(", ")}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Question Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SelectInput
            id="question-type"
            label="Question Type"
            value={newQuestion.type}
            onChange={(value) => {
              const newType = value as QuestionType["type"];
              setNewQuestion({
                ...newQuestion,
                type: newType,
                options: needsOptions(newType) ? [] : undefined
              });
            }}
            options={[
              { value: "text", label: "Text Input" },
              { value: "textarea", label: "Long Text" },
              { value: "select", label: "Single Select" },
              { value: "checkbox", label: "Multiple Choice" },
              { value: "file", label: "File Upload" },
            ]}
          />

          <TextareaInput
            id="question-text"
            label="Question"
            value={newQuestion.label}
            onChange={(value) => setNewQuestion({ ...newQuestion, label: value })}
            placeholder="Enter your question here..."
            rows={3}
          />

          {needsOptions(newQuestion.type) && (
            <TagsInput
              id="question-options"
              label="Options"
              value={newQuestion.options || []}
              onChange={(options) => setNewQuestion({ ...newQuestion, options })}
              placeholder="Type an option and press Enter..."
            />
          )}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="question-required"
              checked={newQuestion.required}
              onChange={(e) => setNewQuestion({ ...newQuestion, required: e.target.checked })}
              className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <label htmlFor="question-required" className="text-sm font-medium cursor-pointer">
              Required question
            </label>
          </div>

          <Button type="button" onClick={addQuestion} disabled={!newQuestion.label.trim()}>
            Add Question
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
