"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight";
import { cn } from "@/lib/utils";
import Link from "next/link";
import HeaderClient from "@/components/layout/HeaderClient";

const HeroSection = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Header inside hero section */}

      {/* Grid pattern background */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none opacity-20",
          "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]"
        )}
      />

      {/* Spotlight effect */}
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="white"
      />

      <div className="container mx-auto px-4 text-center relative z-30">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 121.03 58.57"
              className="w-32 h-16 md:w-48 md:h-24 text-white"
            >
              <g>
                <path
                  fill="currentColor"
                  d="M48.47 40.52 14.51 20.91a9.63 9.63 0 0 0-4.83-1.3 9.67 9.67 0 0 0-8.38 4.84C-1.37 29.08.21 34.99 4.84 37.66L38.8 57.27a9.63 9.63 0 0 0 4.83 1.3c3.34 0 6.59-1.73 8.38-4.84 2.67-4.63 1.09-10.54-3.54-13.21ZM116.2 20.91 82.24 1.3A9.63 9.63 0 0 0 77.41 0c-3.34 0-6.59 1.73-8.38 4.84-2.67 4.62-1.09 10.54 3.54 13.21l33.96 19.61a9.63 9.63 0 0 0 4.83 1.3c3.34 0 6.59-1.73 8.38-4.84 2.67-4.63 1.08-10.54-3.54-13.21ZM105.18 39.99l-15.85-9.15-16.77 9.68c-4.63 2.67-6.21 8.58-3.54 13.21a9.656 9.656 0 0 0 13.21 3.54l27.3-15.76c-1.52-.23-3-.74-4.35-1.52ZM15.86 18.58l15.85 9.15 16.77-9.68c4.63-2.67 6.21-8.58 3.54-13.21C49.35.22 43.44-1.37 38.81 1.3l-27.3 15.76c1.52.23 3 .74 4.35 1.52Z"
                />
              </g>
            </svg>
          </motion.div>

          <motion.h1
            className="text-3xl md:text-5xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Build. Learn. Connect.
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Join UTSC&apos;s premier developer community. Where innovation meets collaboration, and where the next
            generation of tech leaders are born.
          </motion.p>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
              onClick={() => scrollToSection("recruitment")}
            >
              Join Our Community
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
