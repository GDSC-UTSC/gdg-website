import ProjectCard from "@/components/projects/ProjectCard";
import { StaggerContainer, FadeInOnScroll } from "@/components/animations";
import PageTitle from "@/components/ui/PageTitle";
import { Project } from "@/app/types/projects";

export default async function ProjectsPageContent() {
  let projects: Project[] = [];

  try {
    projects = await Project.readAll({ server: true, public: true });
  } catch (error) {
    console.error("Error loading projects:", error);
  }

  return (
    <>
      <PageTitle
        title="Projects"
        description="Explore our latest projects and contributions to the tech community."
      />

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {projects.map((project, index) => (
          <FadeInOnScroll key={project.id} delay={index * 0.1} once={false}>
            <ProjectCard project={project} />
          </FadeInOnScroll>
        ))}

        {projects.length === 0 && (
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
            <p className="text-gray-400 mb-6">Be the first to share a project with the community!</p>
          </div>
        )}
      </StaggerContainer>
    </>
  );
}