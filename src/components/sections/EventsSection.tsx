import { Event } from "@/app/types/events";
import { FadeInOnScroll, StaggerContainer } from "@/components/animations";
import EventCard from "../events/EventCard";

const EventsSection = async () => {
  const events = await Event.readAll({ server: true, public: true });

  const upcomingEvents = events.filter((event) => event.isUpcoming && event.isPublic);
  const pastEvents = events.filter((event) => event.isPast && event.isPublic);
  const publicEvents = [...upcomingEvents, ...pastEvents];
  return (
    <section id="events" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Events</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join us for workshops, tech talks, hackathons, and networking events designed to expand your skills and
            connect you with the developer community.
          </p>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {publicEvents.map((event, index) => (
            <FadeInOnScroll key={index} delay={index * 0.1}>
              <EventCard event={event} />
            </FadeInOnScroll>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default EventsSection;
