"use client";

import { Position, PositionType, QuestionType } from "@/app/types/positions";
import QuestionBuilder from "@/components/positions/QuestionBuilder";
import {
  SelectInput,
  TextInput,
  TextareaInput,
} from "@/components/positions/questions";
import { Button } from "@/components/ui/button";
import TagsInput from "@/components/ui/tags-input";
import { Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type FormData = {
  name: string;
  description: string;
  tags: string[];
  status: "draft" | "active" | "inactive";
  questions: QuestionType[];
};

export default function AdminNewPositionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    tags: [],
    status: "draft",
    questions: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const positionData: PositionType = {
        id: "", // Will be set by Firebase
        name: formData.name,
        description: formData.description,
        tags: formData.tags,
        status: formData.status,
        createdAt: Timestamp.now(), // Will be overridden by serverTimestamp
        updatedAt: Timestamp.now(), // Will be overridden by serverTimestamp
        questions: formData.questions,
      };

      const position = new Position(positionData);

      await position.create();
      toast.success("Position created successfully!");
      router.push("/admin/positions");
    } catch (error) {
      console.error("Error creating position:", error);
      toast.error("Failed to create position. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Create New Position</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Add a new position to attract talented candidates to your team.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            <TextInput
              id="name"
              label="Position Name"
              value={formData.name}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, name: value }))
              }
              placeholder="e.g., Frontend Developer"
              required
            />

            <TextareaInput
              id="description"
              label="Description"
              value={formData.description}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, description: value }))
              }
              placeholder="Describe the role, responsibilities, and requirements..."
              required
              rows={8}
            />

            <TagsInput
              id="tags"
              label="Skills/Tags"
              value={formData.tags}
              onChange={(tags) => setFormData((prev) => ({ ...prev, tags }))}
              placeholder="Type a skill and press Enter..."
            />

            <SelectInput
              id="status"
              label="Status"
              value={formData.status}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  status: value as "draft" | "active" | "inactive",
                }))
              }
              options={[
                { value: "draft", label: "Draft" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
            />

            <QuestionBuilder
              questions={formData.questions}
              onChange={(questions) =>
                setFormData((prev) => ({ ...prev, questions }))
              }
            />

            <div className="flex gap-4 pt-8 justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/positions")}
                disabled={isSubmitting}
                className="px-8 py-3 text-base"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 text-base"
              >
                {isSubmitting ? "Creating..." : "Create Position"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
