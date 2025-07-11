"use client";
import { Project, ProjectType, Contributor } from "@/app/types/projects";
import {
  TextInput,
  TextareaInput,
} from "@/components/positions/questions";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import TagsInput from "@/components/ui/tags-input";
import { useAuth } from "@/contexts/AuthContext";
import { Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

type FormData = {
  title: string;
  description: string;
  languages: string[];
  contributors: Contributor[];
  link: string;
};

export default function NewProjectPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    languages: [],
    contributors: [],
    link: "",
  });

  const addContributor = (contributorName: string) => {
    const trimmedName = contributorName.trim();
    if (trimmedName && !formData.contributors.some(c => c.name === trimmedName)) {
      const newContributor: Contributor = {
        name: trimmedName,
        initial: trimmedName.charAt(0).toUpperCase(),
      };
      setFormData(prev => ({
        ...prev,
        contributors: [...prev.contributors, newContributor]
      }));
    }
  };

  const removeContributor = (contributorName: string) => {
    setFormData(prev => ({
      ...prev,
      contributors: prev.contributors.filter(c => c.name !== contributorName)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.title || !formData.description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const projectData: ProjectType = {
        id: "",
        title: formData.title,
        description: formData.description,
        languages: formData.languages,
        contributors: formData.contributors,
        link: formData.link,
        imageUrls: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const project = new Project(projectData);
      const newId = await project.create();

      if (selectedFiles.length > 0) {
        await project.uploadImage(selectedFiles[0]);
      }

      toast.success("Project created successfully!");
      router.push(`/projects/${newId}`);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">You must be logged in to create a project.</p>
          <Link href="/account/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Create New Project</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Share your latest work and collaborate with the community.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            <TextInput
              id="title"
              label="Project Title"
              value={formData.title}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, title: value }))
              }
              placeholder="e.g., Personal Portfolio Website"
              required
            />

            <TextareaInput
              id="description"
              label="Description"
              value={formData.description}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, description: value }))
              }
              placeholder="Describe your project, its features, and what makes it special..."
              required
              rows={8}
            />

            <TextInput
              id="link"
              label="Project Link"
              value={formData.link}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, link: value }))
              }
              placeholder="https://your-project-link.com"
            />

            <TagsInput
              id="languages"
              label="Technologies/Languages"
              value={formData.languages}
              onChange={(languages) => setFormData((prev) => ({ ...prev, languages }))}
              placeholder="Type a technology and press Enter..."
            />

            <TagsInput
              id="contributors"
              label="Contributors"
              value={formData.contributors.map(c => c.name)}
              onChange={(names) => {
                const contributors = names.map(name => ({
                  name,
                  initial: name.charAt(0).toUpperCase(),
                }));
                setFormData((prev) => ({ ...prev, contributors }));
              }}
              placeholder="Type a contributor name and press Enter..."
            />

            {/* Image Upload */}
            <div className="space-y-3">
              <label className="text-lg font-medium">Project Images</label>
              <FileUpload
                files={selectedFiles}
                setFiles={setSelectedFiles}
                accept="image/*"
                maxSize={5}
                showPreview={true}
                multiple={false}
              />
            </div>

            <div className="flex gap-4 pt-8 justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="px-8 py-3 text-base"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.title || !formData.description}
                className="px-8 py-3 text-base"
              >
                {isSubmitting ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
