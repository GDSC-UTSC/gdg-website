"use client";
import EventCard from "@/components/events/EventCard";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/PageTitle";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { Event } from "../types/events";
import Link from "next/link";

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const allEvents = await Event.readAll();
        // Sort events by date (newest first)
        const sortedEvents = allEvents.sort((a, b) => {
          const dateA = a.eventDate?.toDate?.() || new Date(0);
          const dateB = b.eventDate?.toDate?.() || new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
        setEvents(sortedEvents);
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const eventDate = event.eventDate?.toDate?.() || new Date(0);
    const now = new Date();
    
    switch (filter) {
      case "upcoming":
        return eventDate > now || event.status === "upcoming";
      case "past":
        return eventDate < now || event.status === "completed";
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <section className="py-20 min-h-screen gradient-bg">
        <div className="container mx-auto px-4 pb-10 flex flex-col items-center justify-center gap-10">
          <PageTitle
            title="Events"
            description="Join our community events, workshops, and tech talks."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg p-6 animate-pulse h-80"
              >
                <div className="h-32 bg-gray-700 rounded mb-4"></div>
                <div className="h-6 bg-gray-700 rounded mb-4"></div>
                <div className="h-20 bg-gray-700 rounded mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-700 rounded"></div>
                  <div className="h-6 w-20 bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 min-h-screen gradient-bg">
      <div className="container mx-auto px-4 pb-10 flex flex-col items-center justify-center gap-10">
        <PageTitle
          title="Events"
          description="Join our community events, workshops, and tech talks."
        />
        
        {/* Filter Buttons */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            All Events
          </Button>
          <Button
            variant={filter === "upcoming" ? "default" : "outline"}
            onClick={() => setFilter("upcoming")}
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Upcoming
          </Button>
          <Button
            variant={filter === "past" ? "default" : "outline"}
            onClick={() => setFilter("past")}
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Past Events
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filteredEvents.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              index={index}
            />
          ))}
          
          {filteredEvents.length === 0 && !loading && (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-semibold text-white mb-2">
                {filter === "upcoming" && "No Upcoming Events"}
                {filter === "past" && "No Past Events"}
                {filter === "all" && "No Events Yet"}
              </h3>
              <p className="text-gray-400 mb-6">
                {filter === "upcoming" && "Check back soon for new events!"}
                {filter === "past" && "No events have been held yet."}
                {filter === "all" && "Be the first to create an event for the community!"}
              </p>
              {user && filter !== "past" && (
                <Link href="/events/new">
                  <Button>
                    <Plus size={16} className="mr-2" />
                    {events.length === 0 ? "Create First Event" : "Create New Event"}
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Add New Event Button */}
        {user && filteredEvents.length > 0 && (
          <Link href="/events/new">
            <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
              <Plus size={20} className="mr-2" />
              Add New Event
            </Button>
          </Link>
        )}
        
        {!user && (
          <div className="text-center">
            <p className="text-gray-400 mb-4">Sign in to create and manage events</p>
            <Link href="/account/login">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}