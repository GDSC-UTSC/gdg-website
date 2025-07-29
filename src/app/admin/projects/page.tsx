"use client";

import { Project } from "@/app/types/projects";
import AdminProjectCard from "@/components/admin/projects/AdminProjectCard";
import PageTitle from "@/components/ui/PageTitle";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // For admin, we want to see all projects
        const allProjects = await Project.readAll();
        setProjects(allProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <PageTitle
            title="Manage Projects"
            description="Manage all projects and their contributors from the admin panel."
          />
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-end mb-6">
          <Button 
            onClick={() => router.push('/admin/projects/new')}
            className="px-6 py-2"
          >
            Create New Project
          </Button>
        </div>
        
        <PageTitle
          title="Manage Projects"
          description="Manage all projects and their contributors from the admin panel."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <AdminProjectCard
              key={project.id}
              project={project}
            />
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No projects available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}