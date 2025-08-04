import { Event } from "@/app/types/events";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface AdminEventCardProps {
  event: Event;
}

export default function AdminEventCard({ event }: AdminEventCardProps) {
  const router = useRouter();

  const handleView = () => {
    router.push(`/admin/events/${event.id}`);
  };

  const handleEdit = () => {
    router.push(`/admin/events/${event.id}/edit`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "ongoing":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "closed":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="h-full">
      <Card className="p-6 hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">{event.title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
            {event.status}
          </span>
        </div>

        <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">
          {event.description || "No description available."}
        </p>

        <div className="flex flex-wrap gap-2 mb-4 min-h-[2rem]">
          {event.tags && event.tags.length > 0 ? (
            event.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                {tag}
              </span>
            ))
          ) : (
            <span className="text-muted-foreground text-sm">No tags</span>
          )}
        </div>

        <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
          <span>Created: {event.createdAt?.toDate().toLocaleDateString()}</span>
          <span>Updated: {event.updatedAt?.toDate().toLocaleDateString()}</span>
        </div>

        <div className="space-y-2 mt-auto">
          <Button className="w-full" variant="outline" onClick={handleView}>
            View Event
          </Button>

          <Button className="w-full" onClick={handleEdit}>
            Edit Event
          </Button>
        </div>
      </Card>
    </div>
  );
}
