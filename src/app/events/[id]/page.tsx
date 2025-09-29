"use client";

import { Event } from "@/app/types/events";
import RegistrationForm from "@/components/events/RegistrationForm";
import { Button } from "@/components/ui/button";
import { ContentSection } from "@/components/ui/ContentSection";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, ExternalLink, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const fetchedEvent = await Event.read(id);
        setEvent(fetchedEvent);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const formatDate = (timestamp: any) => {
    return (
      timestamp?.toDate?.()?.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }) || "TBD"
    );
  };

  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-600";
      case "ongoing":
        return "bg-green-600";
      case "past":
        return "bg-gray-600";
      case "test":
        return "bg-yellow-600";
      case "hidden":
        return "bg-red-600";
      case "default":
        return "bg-purple-600";
      default:
        return "bg-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center py-12">
            <p className="text-gray-400">Loading event...</p>
            <p className="text-muted-foreground">
              Please make sure you are on a supported browser (not linkedin or instagram browser)
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen gradient-bg py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-white mb-4">Event Not Found</h1>
            <p className="text-gray-400 mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => router.push("/events")}>Back to Events</Button>
          </div>
        </div>
      </div>
    );
  }

  const isRegistrationAvailable = event.isUpcoming;

  return (
    <div className="min-h-screen gradient-bg py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <Link href="/events">
            <Button variant="outline" className="mb-6">
              <ArrowLeft size={16} className="mr-2" />
              Back to Events
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-start mb-6"
          >
            <div>
              <h1 className="text-5xl font-bold text-white mb-4">{event.title}</h1>
              <div className="flex items-center gap-6 text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{formatDate(event.eventDate)}</span>
                </div>
                {event.startTime && (
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{formatTime(event.startTime)}</span>
                    {event.endTime && <span>- {formatTime(event.endTime)}</span>}
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
              <span
                className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(
                  event.displayStatus
                )}`}
              >
                {event.displayStatus.charAt(0).toUpperCase() + event.displayStatus.slice(1)}
              </span>
            </div>

            <div className="flex gap-3">
              {event.link && (
                <Button asChild>
                  <a href={event.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink size={16} />
                    Event Link
                  </a>
                </Button>
              )}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ContentSection
            config={{
              images: {
                urls: event.imageUrls || [],
                altTextPrefix: event.title,
              },
              about: {
                title: "About This Event",
                description: event.description,
              },
            }}
            delay={0.1}
            className="lg:col-span-2"
          />

          <ContentSection
            config={{
              details: {
                title: "Event Details",
                items: [
                  { label: "Date", value: formatDate(event.eventDate) },
                  ...(event.startTime
                    ? [
                        {
                          label: "Time",
                          value: `${formatTime(event.startTime)}${
                            event.endTime ? ` - ${formatTime(event.endTime)}` : ""
                          }`,
                        },
                      ]
                    : []),
                  {
                    label: "Status",
                    value: event.displayStatus.charAt(0).toUpperCase() + event.displayStatus.slice(1),
                  },
                  ...(event.registrationDeadline
                    ? [
                        {
                          label: "Registration Deadline",
                          value: formatDate(event.registrationDeadline),
                        },
                      ]
                    : []),
                ],
              },
              tags:
                event.tags && event.tags.length > 0
                  ? {
                      title: "Tags",
                      items: event.tags,
                    }
                  : undefined,
              profiles:
                event.organizers && event.organizers.length > 0
                  ? {
                      title: "Event Organizers",
                      userIds: event.organizers,
                    }
                  : undefined,
            }}
            delay={0.2}
          />
        </div>

        <div className="mt-12">
          <RegistrationForm event={event} />
        </div>
      </div>
    </div>
  );
}
