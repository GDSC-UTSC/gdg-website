"use client";
import { Project } from "@/app/types/projects/project";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { GithubIcon, Camera } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProjectCardProps {
  project: Project;
  index: number;
  languageColors?: any; //
}

const ProjectCard = ({ project, index, languageColors }: ProjectCardProps) => {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 * index }}
      className="bg-card/20 backdrop-blur-sm border-border hover:bg-card/80 bg-blue transition-all duration-300 h-full"
    >
      <Card>
        {/* Project Image */}
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
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
        
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
          <CardDescription className="line-clamp-3">{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-row gap-2 justify-between">
          <div className="flex flex-row gap-2">
            {project.languages.map((language, index) => {
              // Clean up the language name and find matching color
              const cleanLanguage = language.trim();
              const languageKey = Object.keys(languageColors || {}).find(key => 
                key.toLowerCase() === cleanLanguage.toLowerCase()
              );
              const colorClass = languageKey ? languageColors[languageKey] : "bg-gray-500";
              
              return (
                <span
                  key={index}
                  className={`text-xs px-2 py-1 rounded-full w-fit text-white ${colorClass}`}
                >
                  {cleanLanguage}
                </span>
              );
            })}
          </div>
        </CardContent>
        <Button variant="outline" className="w-full mt-4">
          <Link href={project.link} className="flex items-center gap-2">
            <GithubIcon className="w-4 h-4" />
            View Project
          </Link>
        </Button>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;
