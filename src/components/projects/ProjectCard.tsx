"use client";
import { ProjectType } from "@/app/types/projects";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { ExternalLink, Camera } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProjectCardProps {
  project: ProjectType;
  index: number;
  languageColors?: Record<string, string>;
}

const ProjectCard = ({ project, index, languageColors }: ProjectCardProps) => {
  const firstImage = project.imageUrls?.[0];
  
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 * index }}
      className="bg-card/20 backdrop-blur-sm border-border hover:bg-card/80 transition-all duration-300 w-full"
    >
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
          <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
          <CardDescription className="line-clamp-2 text-sm">{project.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col justify-between space-y-3">
          {/* Technologies */}
          <div className="h-12 flex flex-col justify-start">
            {project.languages && project.languages.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {project.languages.slice(0, 4).map((language, langIndex) => {
                  const cleanLanguage = language.trim();
                  const languageKey = Object.keys(languageColors || {}).find(key => 
                    key.toLowerCase() === cleanLanguage.toLowerCase()
                  );
                  const colorClass = languageKey ? languageColors[languageKey] : "bg-gray-500";
                  
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
              <div className="text-xs text-muted-foreground">No technologies listed</div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 mt-auto">
            <Link href={`/projects/${project.id}`} className="flex-1">
              <Button variant="outline" className="w-full text-sm h-9">
                View Details
              </Button>
            </Link>
            {project.link && (
              <Button size="sm" variant="outline" asChild className="h-9 w-9 p-0">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View Project"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;
