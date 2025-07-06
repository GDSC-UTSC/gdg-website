import { Position } from "@/app/types/positions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PositionEditForm from "./PositionEditForm";

interface PositionCardProps {
  position: Position;
  onApply?: (position: Position) => void;
  onEdit?: (position: Position) => void;
  showEdit?: boolean;
}

export default function PositionCard({
  position,
  onApply,
  onEdit,
  showEdit = false,
}: PositionCardProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(position);

  const handleApply = () => {
    router.push(`/positions/${position.id}`);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedPosition: Position) => {
    setCurrentPosition(updatedPosition);
    setIsEditing(false);
    onEdit?.(updatedPosition);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="h-full">
      <Card className="p-6 hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">{currentPosition.name}</h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              currentPosition.isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : currentPosition.isDraft
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
            }`}
          >
            {currentPosition.status}
          </span>
        </div>

        <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">
          {currentPosition.description || "No description available."}
        </p>

        <div className="flex flex-wrap gap-2 mb-4 min-h-[2rem]">
          {currentPosition.tags.length > 0 ? (
            currentPosition.tags.map((tag, index) => (
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
            Created: {currentPosition.createdAt.toDate().toLocaleDateString()}
          </span>
          <span>
            Updated: {currentPosition.updatedAt.toDate().toLocaleDateString()}
          </span>
        </div>

        <div className="space-y-2 mt-auto">
          <Button
            className="w-full"
            disabled={!currentPosition.isActive}
            variant={currentPosition.isActive ? "default" : "secondary"}
            onClick={handleApply}
          >
            {currentPosition.isActive ? "Apply Now" : "Not Available"}
          </Button>

          <Button
            className="w-full"
            variant="outline"
            onClick={handleEdit}
            disabled={isEditing}
          >
            {isEditing ? "Editing..." : "Edit Position"}
          </Button>
        </div>
      </Card>

      <PositionEditForm
        position={currentPosition}
        onCancel={handleCancel}
        onSave={handleSave}
        open={isEditing}
        onOpenChange={setIsEditing}
      />
    </div>
  );
}
