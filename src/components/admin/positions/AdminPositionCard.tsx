import { Position } from "@/app/types/positions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface AdminPositionCardProps {
  position: Position;
}

export default function AdminPositionCard({ position }: AdminPositionCardProps) {
  const router = useRouter();

  const handleView = () => {
    router.push(`/admin/positions/${position.id}`);
  };

  const handleEdit = () => {
    router.push(`/admin/positions/${position.id}/edit`);
  };

  return (
    <div className="h-full">
      <Card className="p-6 hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">{position.name}</h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              position.isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : position.isDraft
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
            }`}
          >
            {position.status}
          </span>
        </div>

        <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">
          {position.description || "No description available."}
        </p>

        <div className="flex flex-wrap gap-2 mb-4 min-h-[2rem]">
          {position.tags.length > 0 ? (
            position.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-muted-foreground text-sm">No tags</span>
          )}
        </div>

        <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
          <span>
            Created: {position.createdAt.toDate().toLocaleDateString()}
          </span>
          <span>
            Updated: {position.updatedAt.toDate().toLocaleDateString()}
          </span>
        </div>

        <div className="space-y-2 mt-auto">
          <Button
            className="w-full"
            variant="outline"
            onClick={handleView}
          >
            View Position
          </Button>

          <Button
            className="w-full"
            onClick={handleEdit}
          >
            Edit Position
          </Button>
        </div>
      </Card>
    </div>
  );
}