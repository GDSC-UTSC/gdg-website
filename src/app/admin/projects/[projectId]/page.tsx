"use client";

import { Project } from "@/app/types/projects";
import { UserData } from "@/app/types/userdata";
import { ProfileCard } from "@/components/account/ProfileCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

interface AdminProjectDetailPageProps {
  params: Promise<{ projectId: string }>;
}

export default function AdminProjectDetailPage({ params }: AdminProjectDetailPageProps) {
  const router = useRouter();
  const { projectId } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const fetchedProject = await Project.read(projectId);
        setProject(fetchedProject);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleDelete = async () => {
    if (!project) return;
    
    const confirmed = window.confirm("Are you sure you want to delete this project? This action cannot be undone.");
    if (!confirmed) return;

    setDeleting(true);
    try {
      await project.delete();
      toast.success("Project deleted successfully!");
      router.push("/admin/projects");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-6xl">
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
        <div className="container mx-auto px-4 max-w-6xl">
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
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <Link href="/admin/projects">
            <Button variant="outline" className="mb-6">
              <ArrowLeft size={16} className="mr-2" />
              Back to Admin Projects
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-start mb-6"
          >
            <div>
              <h1 className="text-5xl font-bold mb-4">{project.title}</h1>
              <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                <span>Contributors: {project.contributors?.length || 0}</span>
                <span>Created: {project.createdAt?.toDate().toLocaleDateString()}</span>
                <span>Updated: {project.updatedAt?.toDate().toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              {project.link && (
                <Button asChild variant="outline">
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink size={16} />
                    View Project
                  </a>
                </Button>
              )}
              <Button onClick={() => router.push(`/admin/projects/${project.id}/edit`)} variant="outline">
                <Edit size={16} className="mr-2" />
                Edit
              </Button>
              <Button 
                onClick={handleDelete} 
                variant="destructive"
                disabled={deleting}
              >
                <Trash2 size={16} className="mr-2" />
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">About This Project</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">{project.description}</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {project.languages && project.languages.length > 0 && (
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.languages.map((language, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium transition-transform hover:scale-105"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {project.contributors && project.contributors.length > 0 && (
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Contributors</h3>
                <div className="space-y-3">
                  {project.contributors.map((contributor, idx) => (
                    <ProfileCard key={contributor.userId} userId={contributor.userId} />
                  ))}
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}