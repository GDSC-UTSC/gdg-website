"use client";

import { Event } from "@/app/types/events";
import { CompactProfileCard } from "@/components/account/CompactProfileCard";
import RegistrationForm from "@/components/events/RegistrationForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { user } = useAuth();
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
      case "completed":
        return "bg-gray-600";
      case "cancelled":
        return "bg-red-600";
      case "closed":
        return "bg-orange-600";
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
            <h1 className="text-2xl font-bold text-white mb-4">
              Event Not Found
            </h1>
            <p className="text-gray-400 mb-6">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push("/events")}>
              Back to Events
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isRegistrationAvailable = event.status === "upcoming";

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

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-start mb-6"
          >
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
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
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
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
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

            {/* Organizers */}
            {event.organizers && event.organizers.length > 0 && (
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Users size={20} />
                  Organizers
                </h3>
                <div className="space-y-2">
                  {event.organizers.map((organizer, idx) => (
                    <CompactProfileCard key={idx} userId={organizer.userId} />
                  ))}
                </div>
              </div>
            )}

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
          </motion.div>
        </div>

        <RegistrationForm event={event} />
      </div>
    </div>
  );
}
