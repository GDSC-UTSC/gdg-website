"use client";

import { Project } from "@/app/types/projects";
import { ProfileCard } from "@/components/account/ProfileCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, ExternalLink, Code2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { ImageCarousel } from "../../../components/projects/ImageCarousel";

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
            <ImageCarousel images={project.imageUrls || []} title="" altTextPrefix={project.title} />

            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">About This Project</h2>
              <p className="text-gray-300 leading-relaxed text-lg">{project.description}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Project Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Created:</span>
                  <span className="text-gray-300">{formatDate(project.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Updated:</span>
                  <span className="text-gray-300">{formatDate(project.updatedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Contributors:</span>
                  <span className="text-gray-300">{project.contributors?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Technologies:</span>
                  <span className="text-gray-300">{project.languages?.length || 0}</span>
                </div>
              </div>
            </div>

            {project.languages && project.languages.length > 0 && (
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Technologies</h3>
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
              </div>
            )}

            {project.contributors && project.contributors.length > 0 && (
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Project Contributors</h3>
                <div className="space-y-3">
                  {project.contributors.map((contributorId, idx) => (
                    <ProfileCard key={contributorId} userId={contributorId} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
