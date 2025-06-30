"use client";
import ProjectCard from "@/components/projects/ProjectCard";
import PageTitle from "@/components/ui/PageTitle";
import { Project } from "../types/projects/project";

const ProjectsSection = () => {
  const projects: Project[] = [
    {
      title: "Project 1",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      languages: ["JavaScript", "HTML", "CSS"],
      link: "https://www.google.com",
      color: "bg-google-red",
    },
    {
      title: "Project 2",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      languages: ["Python", "SQL", "React"],
      link: "https://www.google.com",
      color: "bg-google-blue",
    },
    {
      title: "Project 3",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      languages: ["Java", "Spring", "Kotlin"],
      link: "https://www.google.com",
      color: "bg-google-green",
    },
    {
      title: "Project 4",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      languages: ["Python", "SQL", "React"],
      link: "https://www.google.com",
      color: "bg-purple-500",
    },
    {
      title: "Project 5",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      languages: ["JavaScript", "SQL", "React"],
      link: "https://www.google.com",
      color: "bg-google-yellow",
    },
  ];

  const languageColors = {
    JavaScript: "bg-google-red",
    HTML: "bg-google-blue",
    CSS: "bg-google-green",
    TypeScript: "bg-google-red",
    Python: "bg-google-blue",
    Java: "bg-google-green",
    SQL: "bg-google-yellow",
    React: "bg-purple-500",
    "Next.js": "bg-purple-500",
    "Tailwind CSS": "bg-purple-500",
    "Node.js": "bg-purple-500",
    Express: "bg-purple-500",
    MongoDB: "bg-purple-500",
    PostgreSQL: "bg-red-500",
    Kotlin: "bg-green-700",
    Spring: "bg-green-900",
  };
  return (
    <section id="projects" className="py-20 min-h-screen gradient-bg">
      <div className="container mx-auto px-4 pb-10 flex flex-col items-center justify-center gap-10">
        <PageTitle 
          title="Projects"
          description="Explore our latest projects and contributions to the tech community."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              project={project}
              index={index}
              languageColors={languageColors}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
