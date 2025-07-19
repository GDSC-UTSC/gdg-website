"use client";

import { Event } from "@/app/types/events";
import AdminEventCard from "@/components/admin/events/AdminEventCard";
import PageTitle from "@/components/ui/PageTitle";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // For admin, we want to see all events (not just upcoming ones)
        const allEvents = await Event.readAll();
        setEvents(allEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <PageTitle
            title="Manage Events"
            description="Manage all events and their registrations from the admin panel."
          />
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-end mb-6">
          <Button 
            onClick={() => router.push('/admin/events/new')}
            className="px-6 py-2"
          >
            Create New Event
          </Button>
        </div>
        
        <PageTitle
          title="Manage Events"
          description="Manage all events and their registrations from the admin panel."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <AdminEventCard
              key={event.id}
              event={event}
            />
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No events available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}