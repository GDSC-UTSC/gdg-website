import { Position } from "@/app/types/positions";
import PageTitle from "@/components/ui/PageTitle";

export default async function PositionsPage() {
  let positions: Position[] = [];

  try {
    positions = await Position.readAllActive({ server: true });
  } catch (error) {
    console.error("Error fetching positions:", error);
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <PageTitle
          title="Open Positions"
          description="Join our team and help us build amazing projects. We're always looking for talented individuals to contribute to our community."
        />

        {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        )} */}
      </div>
    </div>
  );
}
