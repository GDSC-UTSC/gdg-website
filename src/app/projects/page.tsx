import ProjectCard from "@/components/projects/ProjectCard";
import PageTitle from "@/components/ui/PageTitle";
import { Project } from "../types/projects";

export default async function ProjectsPage() {
  let projects: Project[] = [];
  
  try {
    projects = await Project.readAll({ server: true });
  } catch (error) {
    console.error("Error loading projects:", error);
  }

  return (
    <section className="py-20 min-h-screen gradient-bg">
      <div className="container mx-auto px-4 pb-10 flex flex-col items-center justify-center gap-10">
        <PageTitle
          title="Projects"
          description="Explore our latest projects and contributions to the tech community."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}

          {projects.length === 0 && (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
              <p className="text-gray-400 mb-6">Be the first to share a project with the community!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
