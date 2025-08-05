"use client";

import { Project } from "@/app/types/projects";
import { Button } from "@/components/ui/button";
import { ContentSection } from "@/components/ui/ContentSection";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, ExternalLink, Code2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const fetchedProject = await Project.read(id);
        setProject(fetchedProject);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const formatDate = (timestamp: any) => {
    return (
      timestamp?.toDate?.()?.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }) || "TBD"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center py-12">
            <p className="text-gray-400">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen gradient-bg py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-white mb-4">Project Not Found</h1>
            <p className="text-gray-400 mb-6">The project you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => router.push("/projects")}>Back to Projects</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <Link href="/projects">
            <Button variant="outline" className="mb-6">
              <ArrowLeft size={16} className="mr-2" />
              Back to Projects
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-start mb-6"
          >
            <div>
              <h1 className="text-5xl font-bold text-white mb-4">{project.title}</h1>
              <div className="flex items-center gap-6 text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{formatDate(project.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Code2 size={16} />
                  <span>Project</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-white text-sm font-medium bg-blue-600">
                Active
              </span>
            </div>

            <div className="flex gap-3">
              {project.link && (
                <Button asChild>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink size={16} />
                    View Project
                  </a>
                </Button>
              )}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ContentSection
            config={{
              images: {
                urls: project.imageUrls || [],
                altTextPrefix: project.title
              },
              about: {
                title: "About This Project",
                description: project.description
              }
            }}
            delay={0.1}
            className="lg:col-span-2"
          />

          <ContentSection
            config={{
              details: {
                title: "Project Details",
                items: [
                  { label: "Created", value: formatDate(project.createdAt) },
                  { label: "Last Updated", value: formatDate(project.updatedAt) },
                  { label: "Contributors", value: String(project.contributors?.length || 0) },
                  { label: "Technologies", value: String(project.languages?.length || 0) }
                ]
              },
              tags: project.languages && project.languages.length > 0 ? {
                title: "Technologies",
                items: project.languages
              } : undefined,
              profiles: project.contributors && project.contributors.length > 0 ? {
                title: "Project Contributors",
                userIds: project.contributors
              } : undefined
            }}
            delay={0.2}
          />
        </div>
      </div>
    </div>
  );
}
