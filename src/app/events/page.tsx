import EventsPageContent from "@/components/pages/EventsPageContent";
import { CardSkeleton } from "@/components/ui/loading-skeleton";
import { Suspense } from "react";

export default function EventsPage() {
  return (
    <section className="py-20 min-h-screen gradient-bg">
      <div className="container mx-auto px-4 pb-10 flex flex-col items-center justify-center gap-10">
        <Suspense fallback={<EventsPageSkeleton />}>
          <EventsPageContent />
        </Suspense>
      </div>
    </section>
  );
}

function EventsPageSkeleton() {
  return (
    <>
      <div className="text-center mb-16">
        <div className="h-12 w-96 mx-auto rounded bg-gray-700 animate-pulse mb-4"></div>
        <div className="h-6 w-3/4 mx-auto rounded bg-gray-700 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}
