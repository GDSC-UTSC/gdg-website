"use client";

import { Project } from "@/app/types/projects";
import { UserData } from "@/app/types/userdata";
import ProjectCard from "@/components/projects/ProjectCard";
import PageTitle from "@/components/ui/PageTitle";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AccountProjectsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/account/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const loadUserProjects = async () => {
      if (!user) return;

      try {
        setIsLoadingProjects(true);
        
        // Load user data to get associations
        const userData = await UserData.read(user.uid);
        if (userData) {
          setUserData(userData);
          
          // Get user's project collaborations from associations
          const collaborationIds = userData.associations?.collaborations || [];
          
          if (collaborationIds.length > 0) {
            // Load all projects and filter by user's collaborations
            const allProjects = await Project.readAll();
            const userProjects = allProjects.filter(project => 
              collaborationIds.includes(project.id)
            );
            setProjects(userProjects);
          }
        }
      } catch (error) {
        console.error("Error loading user projects:", error);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    if (user) {
      loadUserProjects();
    }
  }, [user]);

  if (loading || isLoadingProjects) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <motion.div
      className="min-h-screen py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <PageTitle
          title="My Projects"
          description="Projects you're collaborating on within the GDG community."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't collaborated on any projects yet. Check out the projects page to find interesting projects to contribute to!
            </p>
            <motion.button
              onClick={() => router.push("/projects")}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Projects
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}