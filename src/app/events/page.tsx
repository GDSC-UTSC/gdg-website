import EventCard from "@/components/events/EventCard";
import PageTitle from "@/components/ui/PageTitle";
import { Event } from "../types/events";

export default async function EventsPage() {
  let events: Event[] = [];

  try {
    const allEvents = await Event.readAll({ server: true, public: true });
    // Sort events by date (newest first)
    events = allEvents.sort((a, b) => {
      const dateA = a.eventDate?.toDate?.() || new Date(0);
      const dateB = b.eventDate?.toDate?.() || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error("Error loading events:", error);
  }

  return (
    <section className="py-20 min-h-screen gradient-bg">
      <div className="container mx-auto px-4 pb-10 flex flex-col items-center justify-center gap-10">
        <PageTitle
          title="Events"
          description="Join our community events, workshops, and tech talks."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}

          {events.length === 0 && (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-semibold text-white mb-2">
                No Events Yet
              </h3>
              <p className="text-gray-400 mb-6">
                Check back soon for upcoming events!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
