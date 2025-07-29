"use client";

import { Project, Contributor } from "@/app/types/projects";
import { UserData } from "@/app/types/userdata";
import UserSearch from "@/components/admin/UserSearch";
import { TextInput, TextareaInput } from "@/components/positions/questions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TagsInput from "@/components/ui/tags-input";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X } from "lucide-react";

interface AdminEditProjectPageProps {
  params: Promise<{ projectId: string }>;
}

export default function AdminEditProjectPage({ params }: AdminEditProjectPageProps) {
  const router = useRouter();
  const { projectId } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    languages: [] as string[],
    link: "",
    contributors: [] as UserData[],
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const fetchedProject = await Project.read(projectId);
        if (fetchedProject) {
          setProject(fetchedProject);
          
          // Load contributor user data
          const contributorPromises = fetchedProject.contributors?.map(contributor => 
            UserData.read(contributor.userId)
          ) || [];
          const contributors = await Promise.all(contributorPromises);
          const validContributors = contributors.filter(contrib => contrib !== null) as UserData[];
          
          setFormData({
            title: fetchedProject.title,
            description: fetchedProject.description,
            languages: fetchedProject.languages || [],
            link: fetchedProject.link || "",
            contributors: validContributors,
          });
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!project) {
        toast.error("Project not found");
        setIsSubmitting(false);
        return;
      }

      const updatedProject = new Project({
        ...project,
        title: formData.title.trim(),
        description: formData.description.trim(),
        languages: formData.languages,
        link: formData.link,
        contributors: formData.contributors.map(user => ({ userId: user.id } as Contributor)),
      });

      await updatedProject.update();
      toast.success("Project updated successfully");
      router.push("/admin/projects");
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push("/admin/projects")}>
              Back to Admin Projects
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
          <h1 className="text-4xl font-bold mb-4">Edit Project</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Update the project details and contributors.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <TextInput
                id="title"
                label="Project Title"
                value={formData.title}
                onChange={(value) => handleInputChange("title", value)}
                placeholder="Enter project title"
                required
              />

              <TextareaInput
                id="description"
                label="Description"
                value={formData.description}
                onChange={(value) => handleInputChange("description", value)}
                placeholder="Enter project description"
                required
                rows={8}
              />

              <TextInput
                id="link"
                label="Project Link"
                value={formData.link}
                onChange={(value) => handleInputChange("link", value)}
                placeholder="Enter project link (optional)"
              />

              <TagsInput
                id="languages"
                label="Programming Languages"
                value={formData.languages}
                onChange={(languages: string[]) => handleInputChange("languages", languages)}
                placeholder="Type a language and press Enter..."
              />

              <div className="space-y-4">
                <label className="text-sm font-medium">Project Contributors</label>
                <div className="space-y-3">
                  {formData.contributors.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        Selected contributors:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.contributors.map((contributor) => (
                          <div
                            key={contributor.id}
                            className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm"
                          >
                            <span>{contributor.publicName || "Unknown User"}</span>
                            <button
                              type="button"
                              onClick={() => {
                                handleInputChange(
                                  "contributors",
                                  formData.contributors.filter((u) => u.id !== contributor.id)
                                );
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
                      if (!formData.contributors.find((contrib) => contrib.id === user.id)) {
                        handleInputChange("contributors", [...formData.contributors, user]);
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
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 text-base"
                >
                  {isSubmitting ? "Updating..." : "Update Project"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}