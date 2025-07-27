"use client";

import { Event } from "@/app/types/events";
import { UserData } from "@/app/types/userdata";
import EventCard from "@/components/events/EventCard";
import PageTitle from "@/components/ui/PageTitle";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AccountEventsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/account/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const loadUserEvents = async () => {
      if (!user) return;

      try {
        setIsLoadingEvents(true);
        
        // Load user data to get associations
        const userData = await UserData.read(user.uid);
        if (userData) {
          setUserData(userData);
          
          // Get user's event registrations from associations
          const registrationIds = userData.associations?.registrations || [];
          
          if (registrationIds.length > 0) {
            // Load all events and filter by user's registrations
            const allEvents = await Event.readAll();
            const userEvents = allEvents.filter(event => 
              registrationIds.includes(event.id)
            );
            
            // Sort events by date (newest first)
            const sortedEvents = userEvents.sort((a, b) => {
              const dateA = a.eventDate?.toDate?.() || new Date(0);
              const dateB = b.eventDate?.toDate?.() || new Date(0);
              return dateB.getTime() - dateA.getTime();
            });
            
            setEvents(sortedEvents);
          }
        }
      } catch (error) {
        console.error("Error loading user events:", error);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    if (user) {
      loadUserEvents();
    }
  }, [user]);

  if (loading || isLoadingEvents) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <motion.div
      className="min-h-screen py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <PageTitle
          title="My Events"
          description="Events you've registered for within the GDG community."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <EventCard event={event} />
            </motion.div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No Events Yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't registered for any events yet. Check out our upcoming events to join the community!
            </p>
            <motion.button
              onClick={() => router.push("/events")}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Events
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}