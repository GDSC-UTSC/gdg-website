"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Circle, Github, Menu } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: <Github className="h-8 w-8 text-google-blue" />,
      title: "Learn by Building",
      description:
        "Hands-on workshops, hackathons, and coding sessions that push your technical boundaries.",
    },
    {
      icon: <Circle className="h-8 w-8 text-google-green" />,
      title: "Industry Connections",
      description:
        "Network with Google engineers, industry professionals, and like-minded developers.",
    },
    {
      icon: <Menu className="h-8 w-8 text-google-yellow" />,
      title: "Career Growth",
      description:
        "Access to exclusive opportunities, mentorship programs, and career development resources.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Who We Are</h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            GDG @ UTSC is more than just a tech club. We&apos;re a community of
            passionate developers, designers, and innovators who believe in the
            power of technology to change the world. Backed by Google&apos;s
            resources and expertise, we provide a platform for students to
            learn, grow, and make their mark in the tech industry.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index}>
              <Card className="bg-card/50 backdrop-blur-xs  hover:bg-card/80 transition-all duration-300 h-full">
                <CardContent className="p-8 text-center">
                  <div className="mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-linear-to-r from-card to-accent rounded-2xl p-8 md:p-12 text-center"
        >
          <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            To foster a vibrant community of developers at UTSC, providing
            access to cutting-edge technologies, industry insights, and
            collaborative learning experiences that prepare students for
            successful careers in technology.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
