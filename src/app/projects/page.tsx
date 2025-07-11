"use client";
import ProjectCard from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import PageTitle from "@/components/ui/PageTitle";
import { useAuth } from "@/contexts/AuthContext";
import { Camera, Code2, Edit3, ExternalLink, Plus, Save, Trash2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ProjectDB, ProjectType } from "../types/projects";
import { Project } from "../types/projects/project";

const ProjectsSection = () => {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState<ProjectType | null>(null);
  const [dbProjects, setDbProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Sample projects data (local fallback)
  const projects: Project[] = [
    {
      title: "Project 1",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      languages: ["JavaScript", "HTML", "CSS"],
      link: "https://www.google.com",
      color: "bg-google-red",
      contributors: [
        {
          name: "Sarah Chen",
          initial: "S",
          color: "bg-blue-500"
        },
        {
          name: "Michael Rodriguez",
          initial: "M",
          color: "bg-green-500"
        },
        {
          name: "Emily Thompson",
          initial: "E",
          color: "bg-purple-500"
        }
      ],
    },
    {
      title: "Project 2",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      languages: ["Python", "SQL", "React"],
      link: "https://www.google.com",
      color: "bg-google-blue",
      contributors: [
        {
          name: "Alex Johnson",
          initial: "A",
          color: "bg-red-500"
        },
        {
          name: "Lisa Wang",
          initial: "L",
          color: "bg-yellow-500"
        }
      ],
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
    JavaScript: "bg-yellow-500",
    HTML: "bg-orange-600",
    CSS: "bg-blue-500",
    TypeScript: "bg-blue-600",
    Python: "bg-green-600",
    Java: "bg-red-600",
    SQL: "bg-indigo-600",
    React: "bg-cyan-500",
    "Next.js": "bg-black",
    "Tailwind CSS": "bg-teal-500",
    "Node.js": "bg-green-700",
    Express: "bg-gray-700",
    MongoDB: "bg-green-500",
    PostgreSQL: "bg-blue-700",
    Kotlin: "bg-purple-600",
    Spring: "bg-green-800",
    Vue: "bg-emerald-500",
    Angular: "bg-red-500",
    PHP: "bg-violet-600",
    Ruby: "bg-red-700",
    Go: "bg-sky-500",
    Rust: "bg-orange-700",
    Swift: "bg-orange-500",
    Flutter: "bg-blue-400",
    Docker: "bg-blue-600",
    Kubernetes: "bg-blue-800",
    AWS: "bg-orange-400",
    Firebase: "bg-yellow-600",
    GraphQL: "bg-pink-600",
    Redis: "bg-red-400",
  };

  const handleProjectClick = (project: ProjectType) => {
    setSelectedProject(project);
    setEditedProject({ ...project });
    setIsEditing(false);
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
    setEditedProject(null);
    setIsEditing(false);
    setSelectedFiles([]);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditedProject({ ...selectedProject! });
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!selectedFiles.length || !editedProject || !editedProject.id) {
      console.error("No file selected, no project to update, or project not saved yet");
      return;
    }

    setIsUploading(true);
    try {
      const project = new ProjectDB(editedProject);
      const imageUrl = await project.uploadImage(selectedFiles[0]);

      // Update local state
      const updatedProject = { ...editedProject, imageUrl };
      setEditedProject(updatedProject);
      setSelectedProject(updatedProject);
      setSelectedFiles([]);

      console.log("Image uploaded successfully:", imageUrl);

      // Refresh the projects list
      await loadProjects();
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle image deletion
  const handleImageDelete = async () => {
    if (!editedProject || !editedProject.id) return;

    setIsUploading(true);
    try {
      const project = new ProjectDB(editedProject);
      await project.deleteImage();

      // Update local state
      const updatedProject = { ...editedProject, imageUrl: undefined };
      setEditedProject(updatedProject);
      setSelectedProject(updatedProject);

      console.log("Image deleted successfully");

      // Refresh the projects list
      await loadProjects();
    } catch (error) {
      console.error("Error deleting image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (editedProject) {
      try {
        // Ensure user is authenticated before saving
        if (!user) {
          console.error("User must be authenticated to save projects");
          return;
        }

        const project = new ProjectDB(editedProject);

        if (editedProject.id) {
          // Update existing project
          await project.update();
          console.log("Project updated successfully");
        } else {
          // Create new project - ensure createdBy is set
          project.createdBy = user.uid;
          const newId = await project.create();
          editedProject.id = newId;
          console.log("Project created successfully");
        }

        setSelectedProject(editedProject);
        setIsEditing(false);

        // Refresh the projects list
        await loadProjects();
      } catch (error) {
        console.error("Error saving project:", error);
        // You can add toast notification here
      }
    }
  };

  // Load projects from database
  const loadProjects = async () => {
    try {
      setLoading(true);
      const projects = await ProjectDB.readAll();
      setDbProjects(projects.map(p => p.toPlainObject()));
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Add new project functionality
  const handleAddNewProject = () => {
    if (!user) {
      console.error("User must be authenticated to create projects");
      return;
    }

    const newProject: ProjectType = {
      title: "New Project",
      description: "Enter project description...",
      languages: [],
      link: "",
      color: "bg-gray-600",
      contributors: [],
      createdBy: user.uid,
      imageUrl: undefined
    };
    setSelectedProject(newProject);
    setEditedProject(newProject);
    setIsEditing(true);
  };

  const handleInputChange = (field: keyof ProjectType, value: string) => {
    if (editedProject) {
      setEditedProject({
        ...editedProject,
        [field]: value,
      });
    }
  };

  const addTechnology = () => {
    if (editedProject) {
      setEditedProject({
        ...editedProject,
        languages: [...editedProject.languages, ""],
      });
    }
  };

  const updateTechnology = (index: number, value: string) => {
    if (editedProject) {
      const newLanguages = [...editedProject.languages];
      newLanguages[index] = value;
      setEditedProject({
        ...editedProject,
        languages: newLanguages,
      });
    }
  };

  const removeTechnology = (index: number) => {
    if (editedProject) {
      const newLanguages = editedProject.languages.filter((_, i) => i !== index);
      setEditedProject({
        ...editedProject,
        languages: newLanguages,
      });
    }
  };

  const addContributor = () => {
    if (editedProject) {
      const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500'];
      const newContributor = {
        name: '',
        initial: '',
        color: colors[Math.floor(Math.random() * colors.length)]
      };

      setEditedProject({
        ...editedProject,
        contributors: [...(editedProject.contributors || []), newContributor]
      });
    }
  };

  const updateContributor = (index: number, name: string) => {
    if (editedProject && editedProject.contributors) {
      const newContributors = [...editedProject.contributors];
      newContributors[index] = {
        ...newContributors[index],
        name,
        initial: name.charAt(0).toUpperCase()
      };

      setEditedProject({
        ...editedProject,
        contributors: newContributors
      });
    }
  };

  const removeContributor = (index: number) => {
    if (editedProject && editedProject.contributors) {
      const newContributors = editedProject.contributors.filter((_, i) => i !== index);
      setEditedProject({
        ...editedProject,
        contributors: newContributors
      });
    }
  };

  const currentProject = isEditing ? editedProject : selectedProject;

  return (
    <section id="projects" className="py-20 min-h-screen gradient-bg">
      <div className="container mx-auto px-4 pb-10 flex flex-col items-center justify-center gap-10">
        <PageTitle
          title="Projects"
          description="Explore our latest projects and contributions to the tech community."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-700 rounded mb-4"></div>
                <div className="h-20 bg-gray-700 rounded mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-700 rounded"></div>
                  <div className="h-6 w-20 bg-gray-700 rounded"></div>
                </div>
              </div>
            ))
          ) : (
            /* Show database projects first, then sample projects */
            [...dbProjects, ...projects].map((project, index) => (
              <div key={project.id || index} onClick={() => handleProjectClick(project)} className='cursor-pointer'>
                <ProjectCard
                  project={project}
                  index={index}
                  languageColors={languageColors}
                />
              </div>
            ))
          )}
        </div>

        {/* Add New Project Button */}
        {user ? (
          <Button
            onClick={handleAddNewProject}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus size={20} className="mr-2" />
            Add New Project
          </Button>
        ) : (
          <div className="text-center">
            <p className="text-gray-400 mb-2">Sign in to create new projects</p>
            <Button
              disabled
              className="bg-gray-600 text-gray-400 px-6 py-3 rounded-lg cursor-not-allowed"
            >
              <Plus size={20} className="mr-2" />
              Add New Project
            </Button>
          </div>
        )}
      </div>
      {selectedProject && currentProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="relative p-6 border-b border-gray-800">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentProject.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="text-3xl font-bold text-white mb-2 bg-gray-800 border border-gray-700 rounded px-2 py-1 w-3/4"
                    />
                  ) : (
                    <h2 className="text-3xl font-bold text-white mb-2">{currentProject.title}</h2>
                  )}
                  <div className="flex items-center gap-2 text-gray-400">
                    <Code2 size={16} />
                    <span className="text-sm font-medium">Project Details</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button
                      onClick={handleEditToggle}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      <Edit3 size={16} className="mr-2" />
                      Edit
                    </Button>
                  ) : null}
                  <Button
                    onClick={handleCloseProject}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Project Image */}
            <div className="p-6 border-b border-gray-800">
              {/* Current image display */}
              {currentProject.imageUrl && (
                <div className="mb-4 flex justify-center">
                  <div className="relative w-full max-w-2xl">
                    <img
                      src={currentProject.imageUrl}
                      alt={currentProject.title}
                      className="w-full h-64 object-cover rounded-lg border border-gray-700"
                    />
                    {isEditing && (
                      <Button
                        onClick={handleImageDelete}
                        disabled={isUploading}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
                      >
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Image upload section (only in edit mode) */}
              {isEditing && (
                <div className="space-y-4">
                  <FileUpload
                    files={selectedFiles}
                    setFiles={setSelectedFiles}
                    accept="image/*"
                    maxSize={5}
                    showPreview={true}
                    multiple={false}
                  />

                  {selectedFiles.length > 0 && (
                    <Button
                      onClick={handleImageUpload}
                      disabled={isUploading || !editedProject?.id}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Upload size={16} />
                      {isUploading ? "Uploading..." : "Upload Image"}
                    </Button>
                  )}

                  {!editedProject?.id && selectedFiles.length > 0 && (
                    <p className="text-yellow-400 text-sm">
                      Please save the project first before uploading an image.
                    </p>
                  )}
                </div>
              )}

              {/* No image placeholder */}
              {!currentProject.imageUrl && !isEditing && (
                <div className="flex justify-center">
                  <div className="w-full max-w-2xl h-64 bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <Camera size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No image uploaded</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contributors */}
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-3">Contributors</h3>
              <div className="flex flex-wrap gap-3">
                {isEditing ? (
                  <div className="space-y-2">
                    {currentProject.contributors?.map((contributor, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={contributor.name}
                          onChange={(e) => updateContributor(idx, e.target.value)}
                          className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white"
                          placeholder="Enter contributor name..."
                        />
                        <Button
                          onClick={() => removeContributor(idx)}
                          className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={addContributor}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center gap-2"
                    >
                      <Plus size={14} />
                      Add Contributor
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {currentProject.contributors?.map((contributor, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${contributor.color}`}>
                          {contributor.initial}
                        </div>
                        <span className="text-gray-300 text-sm">{contributor.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">About This Project</h3>
                {isEditing ? (
                  <textarea
                    value={currentProject.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full h-32 text-gray-300 bg-gray-800 border border-gray-700 rounded px-3 py-2 resize-none"
                    placeholder="Enter project description..."
                  />
                ) : (
                  <p className="text-gray-300 leading-relaxed">{currentProject.description}</p>
                )}
              </div>

              {/* Technologies */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Technologies Used</h3>
                {isEditing ? (
                  <div className="space-y-2">
                    {currentProject.languages.map((lang, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={lang}
                          onChange={(e) => updateTechnology(idx, e.target.value)}
                          className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white"
                          placeholder="Enter technology..."
                        />
                        <Button
                          onClick={() => removeTechnology(idx)}
                          className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={addTechnology}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center gap-2"
                    >
                      <Plus size={14} />
                      Add Technology
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {currentProject.languages.map((lang, idx) => {
                      // Clean up the language name and find matching color
                      const cleanLanguage = lang.trim();
                      const languageKey = Object.keys(languageColors).find(key =>
                        key.toLowerCase() === cleanLanguage.toLowerCase()
                      );
                      const colorClass = languageKey ? languageColors[languageKey as keyof typeof languageColors] : "bg-gray-600";

                      return (
                        <span
                          key={idx}
                          className={`px-3 py-1 rounded-full text-white text-sm font-medium transition-transform hover:scale-105 ${colorClass}`}
                        >
                          {cleanLanguage}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Project Link */}
              {isEditing && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Project Link</h3>
                  <input
                    type="url"
                    value={currentProject.link}
                    onChange={(e) => handleInputChange('link', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                    placeholder="https://your-project-link.com"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-800">
                {isEditing ? (
                  <Button
                    onClick={handleSave}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Save size={16} />
                      Save Changes
                    </div>
                  </Button>
                ) : currentProject.link ? (
                  <Button
                    asChild
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg"
                  >
                    <a
                      href={currentProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <ExternalLink size={16} />
                      View Project
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectsSection;
