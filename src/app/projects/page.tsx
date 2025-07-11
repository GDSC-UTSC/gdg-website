"use client";
import ProjectCard from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/PageTitle";
import { useAuth } from "@/contexts/AuthContext";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Project } from "../types/projects";
import Link from "next/link";

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

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const allProjects = await Project.readAll();
        setProjects(allProjects);
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  if (loading) {
    return (
      <section className="py-20 min-h-screen gradient-bg">
        <div className="container mx-auto px-4 pb-10 flex flex-col items-center justify-center gap-10">
          <PageTitle
            title="Projects"
            description="Explore our latest projects and contributions to the tech community."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg p-6 animate-pulse h-80"
              >
                <div className="h-32 bg-gray-700 rounded mb-4"></div>
                <div className="h-6 bg-gray-700 rounded mb-4"></div>
                <div className="h-20 bg-gray-700 rounded mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-700 rounded"></div>
                  <div className="h-6 w-20 bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 min-h-screen gradient-bg">
      <div className="container mx-auto px-4 pb-10 flex flex-col items-center justify-center gap-10">
        <PageTitle
          title="Projects"
          description="Explore our latest projects and contributions to the tech community."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              languageColors={languageColors}
            />
          ))}
          
          {projects.length === 0 && !loading && (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
              <p className="text-gray-400 mb-6">Be the first to share a project with the community!</p>
              {user && (
                <Link href="/projects/new">
                  <Button>
                    <Plus size={16} className="mr-2" />
                    Create First Project
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Add New Project Button */}
        {user && projects.length > 0 && (
          <Link href="/projects/new">
            <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
              <Plus size={20} className="mr-2" />
              Add New Project
            </Button>
          </Link>
        )}
        
        {!user && (
          <div className="text-center">
            <p className="text-gray-400 mb-4">Sign in to create and manage projects</p>
            <Link href="/account/login">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}