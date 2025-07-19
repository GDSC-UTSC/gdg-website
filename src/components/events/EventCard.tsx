"use client";
import { EventType, Event } from "@/app/types/events";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { ExternalLink, Camera, MapPin, Calendar, Clock, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface EventCardProps {
  event: EventType;
  index: number;
}

interface CapacityInfo {
  registered: number;
  waitlisted: number;
  available: number;
}

const EventCard = ({ event, index }: EventCardProps) => {
  const firstImage = event.imageUrls?.[0];
  const [capacityInfo, setCapacityInfo] = useState<CapacityInfo | null>(null);
  
  // Load capacity info for events with limits
  useEffect(() => {
    if (event.maxCapacity) {
      loadCapacityInfo();
    }
  }, [event.id, event.maxCapacity]);
  
  const loadCapacityInfo = async () => {
    try {
      // Create Event instance to access methods
      const eventInstance = new Event(event);
      const registered = await eventInstance.getRegisteredCount();
      const waitlisted = await eventInstance.getWaitlistCount();
      const available = await eventInstance.getAvailableSpots();
      
      setCapacityInfo({ registered, waitlisted, available });
    } catch (error) {
      console.error('Error loading capacity info:', error);
    }
  };
  
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
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const isRegistrationAvailable = event.status === "upcoming" && 
    (event.registrationDeadline ? new Date(event.registrationDeadline.toString()) > new Date() : new Date(event.eventDate.toString()) > new Date());
  
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
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>
        </div>
        
        <CardHeader className="flex-shrink-0 pb-3">
          <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
          <CardDescription className="line-clamp-2 text-sm">{event.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col justify-between space-y-3">
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
            
            {/* Capacity Info */}
            {event.maxCapacity && capacityInfo && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <div className="flex gap-2 text-xs">
                  <span className="text-green-500">{capacityInfo.registered} registered</span>
                  {capacityInfo.waitlisted > 0 && (
                    <span className="text-yellow-500">{capacityInfo.waitlisted} waitlisted</span>
                  )}
                  {capacityInfo.available > 0 ? (
                    <span className="text-blue-500">{capacityInfo.available} available</span>
                  ) : (
                    <span className="text-red-500">Full</span>
                  )}
                </div>
              </div>
            )}
            
          </div>

          {/* Tags */}
          <div className="h-8 flex flex-col justify-start">
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
              <div className="text-xs text-muted-foreground">No tags</div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 mt-auto">
            <Link href={`/events/${event.id}`} className="flex-1">
              <Button variant="outline" className="w-full text-sm h-9">
                View Details
              </Button>
            </Link>
            
            {/* Registration Button */}
            {isRegistrationAvailable && (
              <Link href={`/events/${event.id}`}>
                <Button size="sm" className="h-9 px-3">
                  Register
                </Button>
              </Link>
            )}
            
            {/* External Link */}
            {event.link && (
              <Button size="sm" variant="outline" asChild className="h-9 w-9 p-0">
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View Event Link"
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

export default EventCard;