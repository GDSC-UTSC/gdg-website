"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show/hide header based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide header
        setIsHeaderVisible(false);
      } else {
        // Scrolling up - show header
        setIsHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/60 backdrop-blur-lg shadow-md "
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: isHeaderVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* logo section - centered on mobile, left on desktop */}
            <div className="flex justify-center md:justify-start">
              <Link href="/" className="block">
                <motion.div
                  className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <Image
                    src="/gdg-logo.png"
                    alt="GDG @ UTSC"
                    width={60}
                    height={60}
                    className="h-12 w-auto sm:h-14"
                  />
                  <div>
                    <h1 className="text-lg sm:text-xl font-bold">GDG @ UTSC</h1>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      Google Developer Group
                    </p>
                  </div>
                </motion.div>
              </Link>
            </div>

            {/* Navigation - centered on mobile and desktop */}
            <div className="flex justify-center">
              <nav className="flex items-center space-x-1 lg:space-x-2 flex-wrap justify-center gap-y-2">
                <Link href="/about">
                  <Button
                    variant="ghost"
                    className="transition-colors text-sm lg:text-base px-3 lg:px-4 text-foreground hover:text-primary"
                  >
                    About
                  </Button>
                </Link>
                <Link href="/events">
                  <Button
                    variant="ghost"
                    className="transition-colors text-sm lg:text-base px-3 lg:px-4 text-foreground hover:text-primary"
                  >
                    Events
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button
                    variant="ghost"
                    className="transition-colors text-sm lg:text-base px-3 lg:px-4 text-foreground hover:text-primary"
                  >
                    Projects
                  </Button>
                </Link>
                <Link href="/team">
                  <Button
                    variant="ghost"
                    className="transition-colors text-sm lg:text-base px-3 lg:px-4 text-foreground hover:text-primary"
                  >
                    Team
                  </Button>
                </Link>
                <Link href="/positions">
                  <Button
                    variant="ghost"
                    className="transition-colors text-sm lg:text-base px-3 lg:px-4 text-foreground hover:text-primary"
                  >
                    Positions
                  </Button>
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
};

export default Header;
