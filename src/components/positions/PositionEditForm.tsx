import { Position, QuestionType } from "@/app/types/positions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TagsInput from "@/components/ui/tags-input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

interface PositionEditFormProps {
  position: Position;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PositionEditForm({
  position,
  open,
  onOpenChange,
}: PositionEditFormProps) {
  const [formData, setFormData] = useState({
    name: position.name,
    description: position.description,
    tags: position.tags,
    status: position.status,
    questions: position.questions,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      const newErrors: Record<string, string> = {};

      if (!formData.name.trim()) {
        newErrors.name = "Position name is required";
      }

      if (!formData.description.trim()) {
        newErrors.description = "Position description is required";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const updatedPosition = new Position({
        ...position,
        name: formData.name.trim(),
        description: formData.description.trim(),
        tags: formData.tags,
        status: formData.status,
        questions: formData.questions,
      });

      await updatedPosition.update();
    } catch (error) {
      toast.error("Failed to update position");
      return;
    }

    toast.success("Position updated successfully");

    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const addQuestion = () => {
    const newQuestion: QuestionType = {
      type: "text",
      label: "",
      required: false,
    };

    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const updateQuestion = (
    index: number,
    field: keyof QuestionType,
    value: any
  ) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setFormData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Position</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Position Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter position name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter position description"
              rows={4}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <TagsInput
              id="tags"
              label="Tags"
              value={formData.tags}
              onChange={(tags: string[]) => handleInputChange("tags", tags)}
              placeholder="Add tags..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Application Questions</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addQuestion}
              >
                Add Question
              </Button>
            </div>

            {formData.questions.map((question, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Question {index + 1}</Label>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeQuestion(index)}
                  >
                    Remove
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Question Type</Label>
                    <Select
                      value={question.type}
                      onValueChange={(value) =>
                        updateQuestion(index, "type", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="textarea">Textarea</SelectItem>
                        <SelectItem value="select">Select</SelectItem>
                        <SelectItem value="checkbox">Checkbox</SelectItem>
                        <SelectItem value="file">File</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Required</Label>
                    <Select
                      value={question.required ? "true" : "false"}
                      onValueChange={(value) =>
                        updateQuestion(index, "required", value === "true")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select requirement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">Optional</SelectItem>
                        <SelectItem value="true">Required</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Question Label</Label>
                  <Input
                    value={question.label}
                    onChange={(e) =>
                      updateQuestion(index, "label", e.target.value)
                    }
                    placeholder="Enter question label"
                  />
                </div>

                {(question.type === "select" ||
                  question.type === "checkbox") && (
                  <div className="space-y-2">
                    <Label>Options (comma-separated)</Label>
                    <Input
                      value={question.options?.join(", ") || ""}
                      onChange={(e) =>
                        updateQuestion(
                          index,
                          "options",
                          e.target.value.split(", ").filter(Boolean)
                        )
                      }
                      placeholder="Option 1, Option 2, Option 3"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
