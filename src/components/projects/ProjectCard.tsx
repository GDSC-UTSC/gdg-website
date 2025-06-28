"use client";
import { Project } from "@/app/types/project";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { GithubIcon } from "lucide-react";
import Link from "next/link";

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
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-row gap-2 justify-between">
          <div className="flex flex-row gap-2">
            {project.languages.map((language, index) => (
              <span
                key={index}
                className={`text-xs px-2 py-1 rounded-full w-fit text-white ${
                  languageColors[language] || "bg-gray-500"
                }`}
              >
                {language}
              </span>
            ))}
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
