"use client";

import { Position } from "@/app/types/positions";
import AdminPositionCard from "@/components/admin/positions/AdminPositionCard";
import PageTitle from "@/components/ui/PageTitle";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPositionsPage() {
  const router = useRouter();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        // For admin, we want to see all positions (not just active ones)
        const allPositions = await Position.readAll();
        setPositions(allPositions);
      } catch (error) {
        console.error("Error fetching positions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <PageTitle
            title="Manage Positions"
            description="Manage all positions and their applications from the admin panel."
          />
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading positions...</p>
            <p className="text-muted-foreground">Please make sure you are on a supported browser (not linkedin or instagram browser)</p>
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
            onClick={() => router.push('/admin/positions/new')}
            className="px-6 py-2"
          >
            Create New Position
          </Button>
        </div>

        <PageTitle
          title="Manage Positions"
          description="Manage all positions and their applications from the admin panel."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {positions.map((position) => (
            <AdminPositionCard
              key={position.id}
              position={position}
            />
          ))}
        </div>

        {positions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No positions available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
