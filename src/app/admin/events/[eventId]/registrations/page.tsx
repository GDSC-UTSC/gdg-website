"use client";

import { Event } from "@/app/types/events";
import { Registration } from "@/app/types/events/registrations";
import { UserData } from "@/app/types/userdata";
import RegistrationCard from "@/components/admin/events/registrations/RegistrationCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Clock, Search, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";

interface AdminRegistrationsPageProps {
  params: Promise<{ eventId: string }>;
}

type RegistrationWithUser = {
  registration: Registration;
  user: UserData | null;
};

type SortOption = "name" | "email" | "date" | "status";
type StatusFilter = "all" | "registered" | "accepted" | "rejected" | "waitlisted" | "cancelled";

export default function AdminRegistrationsPage({ params }: AdminRegistrationsPageProps) {
  const router = useRouter();
  const { eventId } = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch event details
        const fetchedEvent = await Event.read(eventId);
        setEvent(fetchedEvent);

        if (!fetchedEvent) {
          return;
        }

        // Fetch all registrations for this event
        const fetchedRegistrations = await Registration.readAll(eventId);

        // For each registration, fetch the corresponding user data
        const registrationsWithUsers = await Promise.all(
          fetchedRegistrations.map(async (registration) => {
            try {
              const user = await UserData.read(registration.id);
              return {
                registration,
                user,
              };
            } catch (error) {
              console.error(`Error fetching user ${registration.id}:`, error);
              return {
                registration,
                user: null,
              };
            }
          })
        );

        setRegistrations(registrationsWithUsers);
      } catch (error) {
        console.error("Error fetching registrations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  // Filter and sort registrations
  const filteredAndSortedRegistrations = useMemo(() => {
    let filtered = registrations.filter((item) => {
      // Status filter
      if (statusFilter !== "all" && item.registration.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesEmail = item.registration.email.toLowerCase().includes(searchLower);
        const matchesName = item.registration.name.toLowerCase().includes(searchLower);
        const matchesUserName = item.user?.publicName?.toLowerCase().includes(searchLower);

        if (!matchesEmail && !matchesName && !matchesUserName) {
          return false;
        }
      }

      return true;
    });

    // Sort registrations
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.registration.name.localeCompare(b.registration.name);
          break;
        case "email":
          comparison = a.registration.email.localeCompare(b.registration.email);
          break;
        case "date":
          comparison = a.registration.createdAt?.toDate().getTime() - b.registration.createdAt?.toDate().getTime();
          break;
        case "status":
          comparison = a.registration.status.localeCompare(b.registration.status);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [registrations, searchTerm, statusFilter, sortBy, sortOrder]);

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading registrations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push("/admin/events")}>Back to Admin Events</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push(`/events/${eventId}`)} className="mb-4">
            ← Back to Event Details
          </Button>
        </div>

        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4"
          >
            Registrations for {event.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-6 text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{registrations.length} total registrations</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{filteredAndSortedRegistrations.length} filtered</span>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="md:w-48">
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="registered">Registered</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="waitlisted">Waitlisted</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div className="md:w-48">
                <Select
                  value={`${sortBy}-${sortOrder}`}
                  onValueChange={(value) => {
                    const [field, order] = value.split("-");
                    setSortBy(field as SortOption);
                    setSortOrder(order as "asc" | "desc");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest First</SelectItem>
                    <SelectItem value="date-asc">Oldest First</SelectItem>
                    <SelectItem value="name-asc">Name A-Z</SelectItem>
                    <SelectItem value="name-desc">Name Z-A</SelectItem>
                    <SelectItem value="email-asc">Email A-Z</SelectItem>
                    <SelectItem value="email-desc">Email Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Check-in Button */}
              <Button
                onClick={() => router.push(`/admin/events/${eventId}/registrations/checkin`)}
                className="md:w-auto"
              >
                Check-in Users
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Registrations List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {filteredAndSortedRegistrations.length === 0 ? (
            <Card className="p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">No Registrations Found</h3>
              <p className="text-muted-foreground">
                {registrations.length === 0
                  ? "No registrations have been submitted for this event yet."
                  : "No registrations match your current filters."}
              </p>
            </Card>
          ) : (
            filteredAndSortedRegistrations.map(({ registration, user }, index) => (
              <RegistrationCard
                key={registration.id}
                registration={registration}
                user={user}
                event={event!}
                index={index}
              />
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
