"use client";
import { Project } from "@/app/types/projects";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  Calendar,
  Code2,
  Edit,
  ExternalLink,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CompactProfileCard } from '@/components/account/CompactProfileCard';



const languageColors = {
  JavaScript: "bg-yellow-500",
  HTML: "bg-orange-600",
  CSS: "bg-blue-500",
  TypeScript: "bg-blue-600",
  Python: "bg-green-600",
  Java: "bg-red-600",
  SQL: "bg-indigo-600",
  React: "bg-cyan-500",
  "Next.js": "bg-black",
  "Tailwind CSS": "bg-teal-500",
  "Node.js": "bg-green-700",
  Express: "bg-gray-700",
  MongoDB: "bg-green-500",
  PostgreSQL: "bg-blue-700",
  Kotlin: "bg-purple-600",
  Spring: "bg-green-800",
  Vue: "bg-emerald-500",
  Angular: "bg-red-500",
  PHP: "bg-violet-600",
  Ruby: "bg-red-700",
  Go: "bg-sky-500",
  Rust: "bg-orange-700",
  Swift: "bg-orange-500",
  Flutter: "bg-blue-400",
  Docker: "bg-blue-600",
  Kubernetes: "bg-blue-800",
  AWS: "bg-orange-400",
  Firebase: "bg-yellow-600",
  GraphQL: "bg-pink-600",
  Redis: "bg-red-400",
};

export default function ProjectDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error("Error loading project:", error);
        router.push("/projects");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, router]);

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-white">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Project Not Found
          </h1>
          <Link href="/projects">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/projects">
            <Button variant="outline" className="mb-6">
              <ArrowLeft size={16} className="mr-2" />
              Back to Projects
            </Button>
          </Link>

          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-5xl font-bold text-white mb-4">
                {project.title}
              </h1>
              <div className="flex items-center gap-6 text-gray-400">
                <div className="flex items-center gap-2">
                  <Code2 size={16} />
                  <span>Project</span>
                </div>
                {project.createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>
                      {new Date(
                        project.createdAt.toDate()
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              {user && (
                <Link href={`/projects/edit?id=${project.id}`}>
                  <Button variant="outline">
                    <Edit size={16} className="mr-2" />
                    Edit
                  </Button>
                </Link>
              )}
              {project.link && (
                <Button asChild>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink size={16} />
                    View Project
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Images */}
            {project.imageUrls && project.imageUrls.length > 0 && (
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.imageUrls.map((imageUrl, idx) => (
                    <div key={idx} className="relative">
                      <Image
                        src={imageUrl}
                        alt={`${project.title} - Image ${idx + 1}`}
                        width={400}
                        height={250}
                        className="w-full h-64 object-cover rounded-lg border border-gray-700"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                About This Project
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                {project.description}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Technologies */}
            {project.languages && project.languages.length > 0 && (
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.languages.map((lang, idx) => {
                    const cleanLanguage = lang.trim();
                    const languageKey = Object.keys(languageColors).find(
                      (key) => key.toLowerCase() === cleanLanguage.toLowerCase()
                    );
                    const colorClass = languageKey
                      ? languageColors[
                          languageKey as keyof typeof languageColors
                        ]
                      : "bg-gray-600";

                    return (
                      <span
                        key={idx}
                        className={`px-3 py-2 rounded-full text-white text-sm font-medium transition-transform hover:scale-105 ${colorClass}`}
                      >
                        {cleanLanguage}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Contributors */}
            {project.contributors && project.contributors.length > 0 && (
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Users size={20} />
                  Contributors
                </h3>
                <div className="space-y-2">
                  {project.contributors.map((contributor, idx) => (
                    <CompactProfileCard key={idx} userId={contributor.userId} />
                  ))}
                </div>
              </div>
            )}

            {/* Project Info */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Project Info
              </h3>
              <div className="space-y-3 text-sm">
                {project.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Created:</span>
                    <span className="text-gray-300">
                      {new Date(
                        project.createdAt.toDate()
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {project.updatedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Updated:</span>
                    <span className="text-gray-300">
                      {new Date(
                        project.updatedAt.toDate()
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {project.languages && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Technologies:</span>
                    <span className="text-gray-300">
                      {project.languages.length}
                    </span>
                  </div>
                )}
                {project.contributors && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Contributors:</span>
                    <span className="text-gray-300">
                      {project.contributors.length}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
