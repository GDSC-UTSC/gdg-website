"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const RecruitmentSection = () => {
  const positions = [
    {
      title: "Core Team Member",
      description:
        "Help organize events, manage community outreach, and shape the future of GDG @ UTSC.",
      requirements: [
        "Passionate about technology",
        "Strong communication skills",
        "Leadership potential",
      ],
      commitment: "5-8 hours/week",
    },
    {
      title: "Technical Lead",
      description:
        "Lead workshops, mentor junior developers, and contribute to technical content creation.",
      requirements: [
        "Strong programming skills",
        "Experience with Google technologies",
        "Teaching ability",
      ],
      commitment: "8-12 hours/week",
    },
    {
      title: "Event Coordinator",
      description:
        "Plan and execute engaging events, manage logistics, and ensure memorable experiences.",
      requirements: [
        "Event planning experience",
        "Detail-oriented",
        "Creative thinking",
      ],
      commitment: "6-10 hours/week",
    },
  ];

  const benefits = [
    "Google swag and exclusive merchandise",
    "Access to Google Cloud credits and resources",
    "Networking opportunities with industry professionals",
    "Leadership and professional development",
    "Certificate of participation and recognition",
    "Priority access to Google events and programs",
  ];

  return (
    <section id="recruitment" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Our Team</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to make an impact? We&apos;re looking for passionate students
            who want to contribute to UTSC&apos;s tech community and grow their
            skills along the way.
          </p>
        </motion.div>

        <div className="text-center">
          <Link href="/positions">
            <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-6 text-lg font-semibold">
              View Available Positions
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecruitmentSection;
