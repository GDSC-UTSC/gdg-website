import { useState } from "react";
import { QuestionType } from "@/app/types/positions";
import { Button } from "@/components/ui/button";
import { TextInput, TextareaInput, SelectInput, CheckboxInput } from "@/components/positions/questions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuestionBuilderProps {
  questions: QuestionType[];
  onChange: (questions: QuestionType[]) => void;
}

export default function QuestionBuilder({ questions, onChange }: QuestionBuilderProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newQuestion, setNewQuestion] = useState<QuestionType>({
    type: "text",
    question: "",
    options: [],
    required: false,
  });

  const addQuestion = () => {
    if (newQuestion.question.trim()) {
      onChange([...questions, { ...newQuestion }]);
      setNewQuestion({
        type: "text",
        question: "",
        options: [],
        required: false,
      });
    }
  };

  const updateQuestion = (index: number, updatedQuestion: QuestionType) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = updatedQuestion;
    onChange(updatedQuestions);
    setEditingIndex(null);
  };

  const deleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    onChange(updatedQuestions);
  };

  const handleNewQuestionOptionsChange = (optionsString: string) => {
    const options = optionsString
      .split(",")
      .map((opt) => opt.trim())
      .filter((opt) => opt.length > 0);
    setNewQuestion({ ...newQuestion, options });
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
                      onClick={() => setEditingIndex(editingIndex === index ? null : index)}
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
                <p className="text-sm text-muted-foreground mb-2">{question.question}</p>
                {question.options.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Options: {question.options.join(", ")}
                  </div>
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
            onChange={(value) => setNewQuestion({ ...newQuestion, type: value as QuestionType["type"] })}
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
            value={newQuestion.question}
            onChange={(value) => setNewQuestion({ ...newQuestion, question: value })}
            placeholder="Enter your question here..."
            required
            rows={3}
          />

          {needsOptions(newQuestion.type) && (
            <TextInput
              id="question-options"
              label="Options"
              value={newQuestion.options.join(", ")}
              onChange={handleNewQuestionOptionsChange}
              placeholder="Option 1, Option 2, Option 3"
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

          <Button type="button" onClick={addQuestion} disabled={!newQuestion.question.trim()}>
            Add Question
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}