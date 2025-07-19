"use client";
import { Event } from "@/app/types/events";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import EventRegistrationButton from "@/components/events/EventRegistrationButton";
import RegistrationStatusCard from "@/components/events/RegistrationStatusCard";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  ExternalLink,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EventDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) {
        router.push("/events");
        return;
      }

      try {
        const eventData = await Event.read(eventId);
        if (!eventData) {
          router.push("/events");
          return;
        }
        setEvent(eventData);
      } catch (error) {
        console.error("Error loading event:", error);
        router.push("/events");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId, router]);

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
      case "completed":
        return "bg-gray-600";
      case "cancelled":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  const handleRegistrationChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-white">Loading event...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Event Not Found
          </h1>
          <Link href="/events">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen gradient-bg py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/events">
            <Button variant="outline" className="mb-6">
              <ArrowLeft size={16} className="mr-2" />
              Back to Events
            </Button>
          </Link>

          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-5xl font-bold text-white mb-4">
                {event.title}
              </h1>
              <div className="flex items-center gap-6 text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{formatDate(event.eventDate)}</span>
                </div>
                {event.startTime && (
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{formatTime(event.startTime)}</span>
                    {event.endTime && (
                      <span>- {formatTime(event.endTime)}</span>
                    )}
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
                  event.status
                )}`}
              >
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            </div>

            <div className="flex gap-3">
              {user && (
                <Link href={`/events/edit?id=${event.id}`}>
                  <Button variant="outline">
                    <Edit size={16} className="mr-2" />
                    Edit
                  </Button>
                </Link>
              )}
              
              <EventRegistrationButton 
                event={event} 
                onRegistrationChange={handleRegistrationChange}
              />

              {event.link && (
                <Button asChild>
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink size={16} />
                    Event Link
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Images */}
            {event.imageUrls && event.imageUrls.length > 0 && (
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.imageUrls.map((imageUrl, idx) => (
                    <div key={idx} className="relative">
                      <Image
                        src={imageUrl}
                        alt={`${event.title} - Image ${idx + 1}`}
                        width={400}
                        height={250}
                        className="w-full h-64 object-cover rounded-lg border border-gray-700"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                About This Event
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                {event.description}
              </p>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Details */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Event Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span className="text-gray-300">
                    {formatDate(event.eventDate)}
                  </span>
                </div>
                {event.startTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time:</span>
                    <span className="text-gray-300">
                      {formatTime(event.startTime)}
                      {event.endTime && ` - ${formatTime(event.endTime)}`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-gray-300">{event.status}</span>
                </div>
                {event.registrationDeadline && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      Registration Deadline:
                    </span>
                    <span className="text-gray-300">
                      {formatDate(event.registrationDeadline)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium transition-transform hover:scale-105"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Registration Info */}
            {event.status === "upcoming" && (
              <div key={refreshKey}>
                <RegistrationStatusCard event={event} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
