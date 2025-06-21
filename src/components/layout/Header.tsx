"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b "
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src="/gdg-logo.png"
              alt="GDG @ UTSC"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold">GDG @ UTSC</h1>
              <p className="text-xs text-muted-foreground">
                Google Developer Group
              </p>
            </div>
          </motion.div>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("about")}
              className="text-foreground hover:text-primary transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("events")}
              className="text-foreground hover:text-primary transition-colors"
            >
              Events
            </button>
            <button
              onClick={() => scrollToSection("recruitment")}
              className="text-foreground hover:text-primary transition-colors"
            >
              Join Us
            </button>
            <Button
              onClick={() => scrollToSection("recruitment")}
              className="bg-primary hover:bg-primary/90"
            >
              Get Started
            </Button>
          </nav>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
