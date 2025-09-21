"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FadeInOnScroll, StaggerContainer } from "@/components/animations";
import { motion, AnimatePresence } from "framer-motion";
import { Circle, Github, Menu, ChevronDown } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const AboutSection = () => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const features = [
    {
      icon: <Github className="h-8 w-8 text-google-blue" />,
      title: "Learn by Building",
      description:
        "Hands-on workshops, hackathons, and coding sessions that push your technical boundaries.",
      image: "/images/learn-building.jpg"
    },
    {
      icon: <Circle className="h-8 w-8 text-google-green" />,
      title: "Industry Connections",
      description:
        "Network with Google engineers, industry professionals, and like-minded developers.",
      image: "/images/industry-connections.jpg"
    },
    {
      icon: <Menu className="h-8 w-8 text-google-yellow" />,
      title: "Career Growth",
      description:
        "Access to exclusive opportunities, mentorship programs, and career development resources.",
      image: "/images/career-growth.jpg"
    },
  ];

  const toggleCard = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <section id="about" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Who We Are</h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            GDG @ UTSC is more than just a tech club. We&apos;re a community of
            passionate developers, designers, and innovators who believe in the
            power of technology to change the world. Backed by Google&apos;s
            resources and expertise, we provide a platform for students to
            learn, grow, and make their mark in the tech industry.
          </p>
        </motion.div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <FadeInOnScroll key={index} delay={index * 0.1}>
              <Card className="bg-card/50 backdrop-blur-xs hover:bg-card/80 transition-all duration-300 cursor-pointer">
                <CardContent className="p-8 text-center">
                  <div
                    className="flex flex-col items-center"
                    onClick={() => toggleCard(index)}
                  >
                    <div className="mb-4 flex justify-center">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-3 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 mb-4">{feature.description}</p>
                    <ChevronDown
                      className={`h-5 w-5 text-white transition-transform duration-200 ${
                        expandedCard === index ? 'rotate-180' : ''
                      }`}
                    />
                  </div>

                  <AnimatePresence>
                    {expandedCard === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden mt-4"
                      >
                        <div className="border-t border-gray-300 pt-4">
                          <div className="relative w-full h-48 rounded-lg overflow-hidden">
                            <Image
                              src={feature.image}
                              alt={feature.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </FadeInOnScroll>
          ))}
        </StaggerContainer>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-black rounded-2xl p-8 md:p-12 text-center"
        >
          <h3 className="text-3xl font-bold mb-4 text-white">Our Mission</h3>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
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
