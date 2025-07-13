"use client";

import { Application } from "@/app/types/applications";
import { UserData } from "@/app/types/userdata";
import { Position } from "@/app/types/positions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useEffect, useState, use, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Users, Clock } from "lucide-react";
import ApplicationCard from "@/components/admin/positions/applications/ApplicationCard";

interface AdminApplicationsPageProps {
  params: Promise<{ positionId: string }>;
}

type ApplicationWithUser = {
  application: Application;
  user: UserData | null;
};

type SortOption = "name" | "email" | "date" | "status";
type StatusFilter = "all" | "pending" | "accepted" | "rejected";

export default function AdminApplicationsPage({ params }: AdminApplicationsPageProps) {
  const router = useRouter();
  const { positionId } = use(params);
  const [position, setPosition] = useState<Position | null>(null);
  const [applications, setApplications] = useState<ApplicationWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch position details
        const fetchedPosition = await Position.read(positionId);
        setPosition(fetchedPosition);

        if (!fetchedPosition) {
          return;
        }

        // Fetch all applications for this position
        const fetchedApplications = await Application.readAll(positionId);

        // For each application, fetch the corresponding user data
        const applicationsWithUsers = await Promise.all(
          fetchedApplications.map(async (application) => {
            try {
              const user = await UserData.read(application.id);
              return {
                application,
                user,
              };
            } catch (error) {
              console.error(`Error fetching user ${application.id}:`, error);
              return {
                application,
                user: null,
              };
            }
          })
        );

        setApplications(applicationsWithUsers);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [positionId]);

  // Filter and sort applications
  const filteredAndSortedApplications = useMemo(() => {
    let filtered = applications.filter((item) => {
      // Status filter
      if (statusFilter !== "all" && item.application.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesEmail = item.application.email.toLowerCase().includes(searchLower);
        const matchesName = item.application.name.toLowerCase().includes(searchLower);
        const matchesUserName = item.user?.publicName?.toLowerCase().includes(searchLower);

        if (!matchesEmail && !matchesName && !matchesUserName) {
          return false;
        }
      }

      return true;
    });

    // Sort applications
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.application.name.localeCompare(b.application.name);
          break;
        case "email":
          comparison = a.application.email.localeCompare(b.application.email);
          break;
        case "date":
          comparison = a.application.createdAt.toDate().getTime() - b.application.createdAt.toDate().getTime();
          break;
        case "status":
          comparison = a.application.status.localeCompare(b.application.status);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [applications, searchTerm, statusFilter, sortBy, sortOrder]);


  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!position) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Position Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The position you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push("/admin/positions")}>
              Back to Admin Positions
            </Button>
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
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/positions/${positionId}`)}
            className="mb-4"
          >
            ← Back to Position Details
          </Button>
        </div>

        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4"
          >
            Applications for {position.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-6 text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{applications.length} total applications</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{filteredAndSortedApplications.length} filtered</span>
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div className="md:w-48">
                <Select
                  value={`${sortBy}-${sortOrder}`}
                  onValueChange={(value) => {
                    const [field, order] = value.split('-');
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
            </div>
          </Card>
        </motion.div>

        {/* Applications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {filteredAndSortedApplications.length === 0 ? (
            <Card className="p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">No Applications Found</h3>
              <p className="text-muted-foreground">
                {applications.length === 0
                  ? "No applications have been submitted for this position yet."
                  : "No applications match your current filters."
                }
              </p>
            </Card>
          ) : (
            filteredAndSortedApplications.map(({ application, user }, index) => (
              <ApplicationCard
                key={application.id}
                application={application}
                user={user}
                position={position!}
                index={index}
              />
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
