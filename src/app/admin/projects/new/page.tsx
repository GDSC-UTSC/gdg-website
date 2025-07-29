"use client";

import { Project, ProjectType } from "@/app/types/projects";
import UserSearch from "@/components/admin/UserSearch";
import { TextInput, TextareaInput } from "@/components/positions/questions";
import { Button } from "@/components/ui/button";
import TagsInput from "@/components/ui/tags-input";
import { Timestamp } from "firebase/firestore";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type FormData = {
  title: string;
  description: string;
  languages: string[];
  link: string;
  contributors: string[];
  imageUrls: string[];
};

export default function AdminNewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    languages: [],
    link: "",
    contributors: [],
    imageUrls: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const projectData: ProjectType = {
        id: "",
        title: formData.title,
        description: formData.description,
        languages: formData.languages,
        contributors: formData.contributors,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        imageUrls: formData.imageUrls,
        link: formData.link,
      };
      console.log(projectData);
      const project = new Project(projectData);
      await project.create();
      toast.success("Project created successfully!");
      router.push("/admin/projects");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Create New Project</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Add a new project to showcase your team's work and attract contributors.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            <TextInput
              id="title"
              label="Project Title"
              value={formData.title}
              onChange={(value) => setFormData((prev) => ({ ...prev, title: value }))}
              placeholder="e.g., GDG Website"
              required
            />

            <TextareaInput
              id="description"
              label="Description"
              value={formData.description}
              onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
              placeholder="Describe the project, its goals, and what contributors can expect..."
              required
              rows={8}
            />

            <TextInput
              id="link"
              label="Project Link"
              value={formData.link}
              onChange={(value) => setFormData((prev) => ({ ...prev, link: value }))}
              placeholder="e.g., GitHub repository or live demo URL"
            />

            <TagsInput
              id="languages"
              label="Programming Languages"
              value={formData.languages}
              onChange={(languages) => setFormData((prev) => ({ ...prev, languages }))}
              placeholder="Type a language and press Enter..."
            />

            <div className="space-y-4">
              <label className="text-sm font-medium">Project Contributors</label>
              <div className="space-y-3">
                {formData.contributors.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Selected contributors:</div>
                    <div className="flex flex-wrap gap-2">
                      {formData.contributors.map((contributor) => (
                        <div
                          key={contributor}
                          className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm"
                        >
                          <span>{contributor || "Unknown User"}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                contributors: prev.contributors.filter((u) => u !== contributor),
                              }));
                            }}
                            className="hover:text-destructive transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <UserSearch
                  placeholder="Search for contributors..."
                  onUserSelect={(user) => {
                    console.log(user);
                    if (!formData.contributors.find((contrib) => contrib === user.id)) {
                      setFormData((prev) => ({
                        ...prev,
                        contributors: [...prev.contributors, user.id],
                      }));
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-8 justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/projects")}
                disabled={isSubmitting}
                className="px-8 py-3 text-base"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="px-8 py-3 text-base">
                {isSubmitting ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
