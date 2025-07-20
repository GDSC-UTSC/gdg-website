import { ProjectType } from "@/app/types/projects";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Camera } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
  project: ProjectType;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const firstImage = project.imageUrls?.[0];

  return (
    <Link href={`/projects/${project.id}`}>
      <div className="bg-card/20 backdrop-blur-sm border-border hover:bg-card/80 transition-all duration-300 w-full">
        <Card className="aspect-square flex flex-col">
          {/* Project Image */}
          <div className="relative w-full h-56 overflow-hidden rounded-t-lg flex-shrink-0">
            {firstImage ? (
              <Image
                src={firstImage}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Camera className="w-8 h-8 text-muted-foreground opacity-50" />
              </div>
            )}
          </div>

          <CardHeader className="flex-shrink-0 pb-3">
            <CardTitle className="text-lg line-clamp-1">
              {project.title}
            </CardTitle>
            <CardDescription className="line-clamp-2 text-sm">
              {project.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col justify-between space-y-3">
            {/* Technologies */}
            <div className="h-12 flex flex-col justify-start">
              {project.languages && project.languages.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {project.languages.slice(0, 4).map((language, langIndex) => {
                    const cleanLanguage = language.trim();
                    const colorClass = "bg-gray-500";

                    return (
                      <span
                        key={langIndex}
                        className={`text-xs px-2 py-1 rounded-full text-white ${colorClass} whitespace-nowrap`}
                      >
                        {cleanLanguage}
                      </span>
                    );
                  })}
                  {project.languages.length > 4 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-600 text-white">
                      +{project.languages.length - 4}
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  No technologies listed
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Link>
  );
};

export default ProjectCard;
