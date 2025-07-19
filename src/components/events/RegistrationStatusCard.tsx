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
  const [registrationCount, setRegistrationCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrationCount();
  }, [event.id]);

  const fetchRegistrationCount = async () => {
    try {
      setLoading(true);
      const count = await event.getRegistrationCount();
      setRegistrationCount(count);
    } catch (error) {
      console.error("Error fetching registration count:", error);
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

        {/* Registration Count */}
        <div className="flex items-center justify-between">
          <span className="text-gray-400 flex items-center gap-2">
            <Users size={16} />
            Registered:
          </span>
          <span className="text-white font-medium">
            {loading ? "..." : registrationCount}
          </span>
        </div>

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
              <p className="font-medium text-sm">Registration Available</p>
              <p className="text-xs text-gray-400 mt-1">
                Click the register button to sign up for this event
              </p>
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