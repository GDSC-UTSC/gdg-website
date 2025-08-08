import { EventType } from "@/app/types/events";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScaleIn } from "@/components/animations";
import { Camera, MapPin, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface EventCardProps {
  event: EventType;
}

const EventCard = ({ event }: EventCardProps) => {
  const firstImage = event.imageUrls?.[0];
  
  const formatDate = (timestamp: any) => {
    return timestamp?.toDate?.()?.toLocaleDateString() || "TBD";
  };

  const formatTime = (time: string) => {
    if (!time) return "";
    // Assuming time is in HH:MM format
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };
  
  return (
    <ScaleIn hover className="w-full">
      <Link href={`/events/${event.id}`}>
        <div className="bg-card/20 backdrop-blur-sm border-border hover:bg-card/80 transition-all duration-300 w-full h-full">
          <Card className="h-[420px] flex flex-col">
          {/* Event Image */}
          <div className="relative w-full h-48 overflow-hidden rounded-t-lg flex-shrink-0">
            {firstImage ? (
              <Image
                src={firstImage}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Camera className="w-8 h-8 text-muted-foreground opacity-50" />
              </div>
            )}
            
            {/* Status Badge */}
            <div className="absolute top-3 right-3">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            </div>
          </div>
          
          <CardHeader className="flex-shrink-0 pb-3">
            <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
            <CardDescription className="line-clamp-2 text-sm">{event.description}</CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col justify-between pb-6">
            {/* Event Details */}
            <div className="space-y-2 text-sm">
              {/* Date and Time */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(event.eventDate)}</span>
                {event.startTime && (
                  <>
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{formatTime(event.startTime)}</span>
                    {event.endTime && <span>- {formatTime(event.endTime)}</span>}
                  </>
                )}
              </div>
              
              {/* Location */}
              {event.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="min-h-[32px] flex flex-col justify-center mt-3">
              {event.tags && event.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {event.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                  {event.tags.length > 3 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      +{event.tags.length - 3}
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground text-center">No tags</div>
              )}
            </div>
          </CardContent>
          </Card>
        </div>
      </Link>
    </ScaleIn>
  );
};

export default EventCard;