"use client";

import { Position, QuestionType } from "@/app/types/positions";
import QuestionBuilder from "@/components/positions/QuestionBuilder";
import {
  SelectInput,
  TextInput,
  TextareaInput,
} from "@/components/positions/questions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TagsInput from "@/components/ui/tags-input";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AdminEditPositionPageProps {
  params: Promise<{ positionId: string }>;
}

export default function AdminEditPositionPage({ params }: AdminEditPositionPageProps) {
  const router = useRouter();
  const { positionId } = use(params);
  const [position, setPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tags: [] as string[],
    status: "draft" as "draft" | "active" | "inactive",
    questions: [] as QuestionType[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const fetchedPosition = await Position.read(positionId);
        if (fetchedPosition) {
          setPosition(fetchedPosition);
          setFormData({
            name: fetchedPosition.name,
            description: fetchedPosition.description,
            tags: fetchedPosition.tags,
            status: fetchedPosition.status,
            questions: fetchedPosition.questions,
          });
        }
      } catch (error) {
        console.error("Error fetching position:", error);
        toast.error("Failed to load position");
      } finally {
        setLoading(false);
      }
    };

    fetchPosition();
  }, [positionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newErrors: Record<string, string> = {};

      if (!formData.name.trim()) {
        newErrors.name = "Position name is required";
      }

      if (!formData.description.trim()) {
        newErrors.description = "Position description is required";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsSubmitting(false);
        return;
      }

      if (!position) {
        toast.error("Position not found");
        setIsSubmitting(false);
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
      toast.success("Position updated successfully");
      router.push("/admin/positions");
    } catch (error) {
      console.error("Error updating position:", error);
      toast.error("Failed to update position");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading position...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!position) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Position Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The position you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push("/admin/positions")}>
              Back to Admin Positions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Edit Position</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Update the position details and application questions.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <TextInput
                id="name"
                label="Position Name"
                value={formData.name}
                onChange={(value) => handleInputChange("name", value)}
                placeholder="Enter position name"
                required
                error={errors.name}
              />

              <TextareaInput
                id="description"
                label="Description"
                value={formData.description}
                onChange={(value) => handleInputChange("description", value)}
                placeholder="Enter position description"
                required
                rows={8}
                error={errors.description}
              />

              <TagsInput
                id="tags"
                label="Skills/Tags"
                value={formData.tags}
                onChange={(tags: string[]) => handleInputChange("tags", tags)}
                placeholder="Type a skill and press Enter..."
              />

              <SelectInput
                id="status"
                label="Status"
                value={formData.status}
                onChange={(value) => handleInputChange("status", value)}
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
              />

              <QuestionBuilder
                questions={formData.questions}
                onChange={(questions) => handleInputChange("questions", questions)}
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
                  {isSubmitting ? "Updating..." : "Update Position"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}