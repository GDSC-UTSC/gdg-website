import { Event } from "@/app/types/events";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import Link from "next/link";

const EventsSection = async () => {
  const events = await Event.readAll({ server: true, public: true });

  const upcomingEvents = events.filter((event) => event.status === "upcoming");
  const pastEvents = events.filter((event) => event.status === "completed");

  return (
    <section id="events" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Upcoming Events</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join us for workshops, tech talks, hackathons, and networking events designed to expand your skills and
            connect you with the developer community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {upcomingEvents.map((event, index) => (
            <Link key={index} href={`/events/${event.id}`}>
              <Card className="bg-card/50 backdrop-blur-xs hover:bg-card/80 transition-all duration-300 h-full cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full text-white ${event.status}`}>{event.status}</span>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {event.eventDate?.toDate().toLocaleDateString()} • {event.startTime} - {event.endTime}
                    </p>
                    <p className="text-sm text-muted-foreground">📍 {event.location}</p>
                  </div>
                  <p className="text-muted-foreground mb-4">{event.description}</p>
                  <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="bg-secondary/30 rounded-2xl p-8 md:p-12">
          <h3 className="text-3xl font-bold mb-8 text-center">Past Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event, index) => (
              <Link key={index} href={`/events/${event.id}`}>
                <Card className="bg-card/50 backdrop-blur-xs hover:bg-card/80 transition-all duration-300 h-full cursor-pointer opacity-75">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs px-2 py-1 rounded-full text-white bg-muted">{event.status}</span>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {event.eventDate?.toDate().toLocaleDateString()} • {event.startTime} - {event.endTime}
                      </p>
                      <p className="text-sm text-muted-foreground">📍 {event.location}</p>
                    </div>
                    <p className="text-muted-foreground mb-4">{event.description}</p>
                    <Button
                      className="w-full bg-gradient-to-r from-muted to-muted/80 text-muted-foreground shadow-md cursor-not-allowed opacity-60"
                      disabled
                    >
                      Event Completed
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
