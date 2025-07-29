import { Project } from "@/app/types/projects";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface AdminProjectCardProps {
  project: Project;
}

export default function AdminProjectCard({ project }: AdminProjectCardProps) {
  const router = useRouter();

  const handleView = () => {
    router.push(`/projects/${project.id}`);
  };

  const handleEdit = () => {
    router.push(`/admin/projects/${project.id}/edit`);
  };

  return (
    <div className="h-full">
      <Card className="p-6 hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">{project.title}</h3>
          {project.link && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Live
            </span>
          )}
        </div>

        <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">
          {project.description || "No description available."}
        </p>

        <div className="flex flex-wrap gap-2 mb-4 min-h-[2rem]">
          {project.languages && project.languages.length > 0 ? (
            project.languages.map((language, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
              >
                {language}
              </span>
            ))
          ) : (
            <span className="text-muted-foreground text-sm">No languages</span>
          )}
        </div>

        <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
          <span>
            Contributors: {project.contributors?.length || 0}
          </span>
          <span>
            Updated: {project.updatedAt?.toDate().toLocaleDateString()}
          </span>
        </div>

        <div className="space-y-2 mt-auto">
          <Button
            className="w-full"
            variant="outline"
            onClick={handleView}
          >
            View Project
          </Button>

          <Button
            className="w-full"
            onClick={handleEdit}
          >
            Edit Project
          </Button>
        </div>
      </Card>
    </div>
  );
}
