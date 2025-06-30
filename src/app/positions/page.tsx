"use client";

import { Position } from "@/app/types/positions";
import PositionCard from "@/components/positions/PositionCard";
import PageTitle from "@/components/ui/PageTitle";

const samplePositions: Position[] = [
  new Position({
    id: 1,
    name: "Frontend Developer",
    description:
      "Join our team as a Frontend Developer to build amazing user interfaces using React, Next.js, and modern web technologies. You'll work on creating responsive, accessible, and performant web applications.",
    tags: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "active",
  }),
  new Position({
    id: 2,
    name: "UI/UX Designer",
    description:
      "We're looking for a creative UI/UX Designer to help design intuitive and beautiful user experiences. You'll collaborate with developers and stakeholders to create user-centered designs.",
    tags: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "active",
  }),
  new Position({
    id: 3,
    name: "Backend Developer Intern",
    description:
      "Join us as a Backend Developer Intern to gain hands-on experience with server-side development, APIs, and database management. Perfect opportunity for students looking to grow their skills.",
    tags: ["Node.js", "Python", "Firebase", "REST APIs"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "draft",
  }),
];

export default function PositionsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <PageTitle 
          title="Open Positions"
          description="Join our team and help us build amazing projects. We're always looking for talented individuals to contribute to our community."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {samplePositions.map((position) => (
            <PositionCard
              key={position.id}
              position={position}
              onApply={(position) => {
                console.log("Apply clicked for:", position.name);
                // TODO: Implement application logic
              }}
            />
          ))}
        </div>

        {samplePositions.length === 0 && (
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
