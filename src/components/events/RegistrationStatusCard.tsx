"use client";

import { Event } from "@/app/types/events";
import { Card } from "@/components/ui/card";
import { Calendar, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface RegistrationStatusCardProps {
  event: Event;
}

export default function RegistrationStatusCard({
  event,
}: RegistrationStatusCardProps) {
  const [registeredCount, setRegisteredCount] = useState<number>(0);
  const [waitlistCount, setWaitlistCount] = useState<number>(0);
  const [availableSpots, setAvailableSpots] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrationCount();
  }, [event.id]);

  const fetchRegistrationCount = async () => {
    try {
      setLoading(true);
      const registered = await event.getRegisteredCount();
      const waitlisted = await event.getWaitlistCount();
      const available = await event.getAvailableSpots();

      setRegisteredCount(registered);
      setWaitlistCount(waitlisted);
      setAvailableSpots(available);
    } catch (error) {
      console.error("Error fetching registration counts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    return (
      timestamp?.toDate?.()?.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }) || "TBD"
    );
  };

  return (
    <Card className="bg-[#1a1a1a] border border-gray-800 p-6">
      <h3 className="text-xl font-bold text-white mb-4">Registration</h3>

      <div className="space-y-4">
        {/* Registration Status */}
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Status:</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              event.isRegistrationOpen
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {event.isRegistrationOpen ? "Open" : "Closed"}
          </span>
        </div>


        {/* Registered Count */}
        <div className="flex items-center justify-between">
          <span className="text-gray-400 flex items-center gap-2">
            <Users size={16} />
            Registered:
          </span>
          <span className="text-green-400 font-medium">
            {loading ? "..." : registeredCount}
          </span>
        </div>

        {/* Waitlist Count */}
        {waitlistCount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400 flex items-center gap-2">
              <Users size={16} />
              Waitlisted:
            </span>
            <span className="text-yellow-400 font-medium">
              {loading ? "..." : waitlistCount}
            </span>
          </div>
        )}

        {/* Available Spots */}
        {event.hasCapacityLimit && availableSpots > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400 flex items-center gap-2">
              <Users size={16} />
              Available:
            </span>
            <span className="text-blue-400 font-medium">
              {loading ? "..." : availableSpots}
            </span>
          </div>
        )}



        {/* Registration Deadline */}
        {event.registrationDeadline && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400 flex items-center gap-2">
              <Calendar size={16} />
              Deadline:
            </span>
            <span className="text-white font-medium text-sm">
              {formatDate(event.registrationDeadline)}
            </span>
          </div>
        )}

        {/* Registration Info */}
        <div className="pt-3 border-t border-gray-700">
          {event.isRegistrationOpen ? (
            <div className="text-green-400">
              {event.hasCapacityLimit && availableSpots === 0 ? (
                <>
                  <p className="font-medium text-sm">Event Full - Join Waitlist</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {event.waitlistEnabled ? "You can join the waitlist" : "Waitlist not available"}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium text-sm">Registration Available</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {event.hasCapacityLimit ? `${availableSpots} spots remaining` : "Unlimited capacity"}
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="text-red-400">
              <p className="font-medium text-sm">Registration Closed</p>
              <p className="text-xs text-gray-400 mt-1">
                {event.registrationDeadline
                  ? "Registration deadline has passed"
                  : "This event is no longer accepting registrations"}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
