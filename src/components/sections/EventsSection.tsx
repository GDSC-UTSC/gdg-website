"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Calendar, Circle } from "lucide-react";

const EventsSection = () => {
  const upcomingEvents = [
    {
      title: "Android Development Workshop",
      date: "January 25, 2024",
      time: "6:00 PM - 8:00 PM",
      location: "IC-200",
      description:
        "Learn to build your first Android app using Kotlin and modern development practices.",
      type: "Workshop",
      color: "bg-google-green",
    },
    {
      title: "Google Cloud Study Jam",
      date: "February 2, 2024",
      time: "1:00 PM - 4:00 PM",
      location: "SW-319",
      description:
        "Hands-on experience with Google Cloud Platform and preparation for GCP certifications.",
      type: "Study Session",
      color: "bg-google-blue",
    },
    {
      title: "Tech Talk: AI & Machine Learning",
      date: "February 15, 2024",
      time: "7:00 PM - 8:30 PM",
      location: "Virtual",
      description:
        "Industry experts share insights on the latest trends in AI and ML technologies.",
      type: "Tech Talk",
      color: "bg-google-red",
    },
  ];

  const pastEvents = [
    "Hackathon 2023: 48-hour coding marathon",
    "Firebase Workshop Series",
    "Google I/O Extended Toronto",
    "Flutter Development Bootcamp",
    "DevFest Toronto 2023",
  ];

  return (
    <section id="events" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Upcoming Events
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join us for workshops, tech talks, hackathons, and networking events
            designed to expand your skills and connect you with the developer
            community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="bg-card/50 backdrop-blur-xs  hover:bg-card/80 transition-all duration-300 h-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full text-white ${event.color}`}
                    >
                      {event.type}
                    </span>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {event.date} • {event.time}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      📍 {event.location}
                    </p>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {event.description}
                  </p>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-secondary/30 rounded-2xl p-8 md:p-12"
        >
          <h3 className="text-3xl font-bold mb-8 text-center">Past Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center space-x-3 p-4 bg-card/30 rounded-lg"
              >
                <Circle className="h-2 w-2 text-primary fill-current" />
                <span className="text-muted-foreground">{event}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsSection;
