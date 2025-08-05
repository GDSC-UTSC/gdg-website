import TeamPageContent from "@/components/pages/TeamPageContent";
import { CardSkeleton } from "@/components/ui/loading-skeleton";
import { Suspense } from "react";

export default function TeamPage() {
  return (
    <section className="py-20 min-h-screen gradient-bg">
      <div className="container mx-auto px-4 pb-10 flex flex-col items-center justify-center gap-10">
        <Suspense fallback={<TeamPageSkeleton />}>
          <TeamPageContent />
        </Suspense>
      </div>
    </section>
  );
}

function TeamPageSkeleton() {
  return (
    <>
      <div className="text-center mb-16">
        <div className="h-12 w-96 mx-auto rounded bg-gray-700 animate-pulse mb-4"></div>
        <div className="h-6 w-3/4 mx-auto rounded bg-gray-700 animate-pulse"></div>
      </div>
      <div className="grid gap-12 max-w-6xl mx-auto">
        <div className="space-y-8">
          <div className="h-8 w-48 mx-auto rounded bg-gray-700 animate-pulse"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
