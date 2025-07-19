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
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

type FormData = {
  title: string;
  description: string;
  languages: string[];
  contributors: Contributor[];
  link: string;
  imageUrls: string[];
};

export default function EditProjectPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [project, setProject] = useState<Project | null>(null);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    languages: [],
    contributors: [],
    link: "",
    imageUrls: [],
  });

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        router.push("/projects");
        return;
      }

      try {
        const projectData = await Project.read(projectId);
        if (!projectData) {
          router.push("/projects");
          return;
        }

        setProject(projectData);
        setFormData({
          title: projectData.title,
          description: projectData.description,
          languages: projectData.languages || [],
          contributors: projectData.contributors || [],
          link: projectData.link || "",
          imageUrls: projectData.imageUrls || [],
        });
      } catch (error) {
        console.error("Error loading project:", error);
        router.push("/projects");
      } finally {
        setInitialLoading(false);
      }
    };

    loadProject();
  }, [projectId, router]);

  const handleImageDelete = async (imageUrl: string) => {
    if (!project) return;

    setIsSubmitting(true);
    try {
      await project.deleteImage(imageUrl);
      setFormData(prev => ({
        ...prev,
        imageUrls: prev.imageUrls.filter(url => url !== imageUrl)
      }));
      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !project || !formData.title || !formData.description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      project.title = formData.title;
      project.description = formData.description;
      project.languages = formData.languages;
      project.contributors = formData.contributors;
      project.link = formData.link || undefined;
      project.imageUrls = formData.imageUrls;

      await project.update();

      // Upload all selected images
      if (selectedFiles.length > 0) {
        const uploadedUrls: string[] = [];
        for (const file of selectedFiles) {
          const imageUrl = await project.uploadImage(file);
          uploadedUrls.push(imageUrl);
        }
        setFormData(prev => ({
          ...prev,
          imageUrls: [...prev.imageUrls, ...uploadedUrls]
        }));
        setSelectedFiles([]);
      }

      toast.success("Project updated successfully!");
      router.push(`/projects/${project.id}`);
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!project || !confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }

    setIsSubmitting(true);
    try {
      await project.delete();
      toast.success("Project deleted successfully!");
      router.push("/projects");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">You must be logged in to edit a project.</p>
          <Link href="/account/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <Link href="/projects">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Edit Project</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Update your project details and keep your portfolio current.
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

            {/* Current Images */}
            {formData.imageUrls && formData.imageUrls.length > 0 && (
              <div className="space-y-3">
                <label className="text-lg font-medium">Current Images</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.imageUrls.map((imageUrl, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={imageUrl}
                        alt={`Project image ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        onClick={() => handleImageDelete(imageUrl)}
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 h-8 w-8"
                        disabled={isSubmitting}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Upload */}
            <div className="space-y-3">
              <label className="text-lg font-medium">Add New Images</label>
              <FileUpload
                files={selectedFiles}
                setFiles={setSelectedFiles}
                accept="image/*"
                maxSize={5}
                showPreview={true}
                multiple={true}
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
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                variant="destructive"
                className="px-8 py-3 text-base"
              >
                {isSubmitting ? "Deleting..." : "Delete Project"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
