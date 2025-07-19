"use client";

import { Position } from "@/app/types/positions";
import PositionCard from "@/components/positions/PositionCard";
import PageTitle from "@/components/ui/PageTitle";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PositionsPage() {
  const router = useRouter();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const activePositions = await Position.readAllActive();
        setPositions(activePositions);
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
            title="Open Positions"
            description="Join our team and help us build amazing projects. We're always looking for talented individuals to contribute to our community."
          />
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading positions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <PageTitle
          title="Open Positions"
          description="Join our team and help us build amazing projects. We're always looking for talented individuals to contribute to our community."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {positions.map((position) => (
            <PositionCard key={position.id} position={position} />
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
