"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GithubIcon } from "lucide-react"
import Link from "next/link"
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

const ProjectsSection = () => {
  const projects = [
    {
      title: "Project 1",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      languages: ["JavaScript", "HTML", "CSS"],
      link: "https://www.google.com",
      color: "bg-google-red"
    },
    {
      title: "Project 2",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      languages: ["Python", "SQL", "React"],
      link: "https://www.google.com",
      color: "bg-google-blue"
    },
    {
      title: "Project 3",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      languages: ["Java", "Spring", "Kotlin"],
      link: "https://www.google.com",
      color: "bg-google-green"
    },
    {
      title: "Project 4",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      languages: ["Python", "SQL", "React"],
      link: "https://www.google.com",
      color: "bg-purple-500"
    },
    {
      title: "Project 5",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      languages: ["Javascript", "SQL", "React"],
      link: "https://www.google.com",
      color: "bg-google-yellow"
    },

  ]
  return (
    <section id="projects" className="py-20 min-h-screen gradient-bg">
      <Header />
      <div className="container mx-auto px-4 pb-10 flex flex-col items-center justify-center gap-10">
      <motion.h1
            className="text-5xl md:text-7xl font-bold mb-7 bg-gradient-to-bl from-foreground via-primary to-foreground bg-clip-text text-transparent text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Projects
            <div className="text-lg text-gray-400 text-center">
              Explore our latest projects and contributions to the tech community.
            </div>
          </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
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
                <CardContent className="flex flex-col gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full w-fit text-white ${project.color}`}>{project.languages.join(", ")}</span>
                </CardContent>
                <Button variant="outline" className="w-full mt-4">
                  <Link href={project.link} className="flex items-center gap-2">
                    <GithubIcon className="w-4 h-4" />
                    View Project
                  </Link>
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </section>
  )
}

export default ProjectsSection;
