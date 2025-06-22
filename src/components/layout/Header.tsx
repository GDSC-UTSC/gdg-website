"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Header = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
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

      // Update active section based on scroll position
      const sections = ["hero", "about", "events", "recruitment"];
      const scrollPosition = currentScrollY + 100; // Offset for header height

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // close hamburger menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // prevent body scroll when hamburger menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    // close hamburger menu after navigation
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (sectionId: string) => activeSection === sectionId;

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/60 backdrop-blur-lg shadow-md " : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: isHeaderVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="relative flex items-center justify-between">
            {/* logo section - with text */}
            <motion.div className="flex items-center space-x-2 sm:space-x-3" whileHover={{ scale: 1.05 }}>
              <Image src="/gdg-logo.png" alt="GDG @ UTSC" width={60} height={60} className="h-12 w-auto sm:h-14" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold">GDG @ UTSC</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Google Developer Group</p>
              </div>
            </motion.div>

            {/* Centered desktop navigation */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <nav className="flex items-center space-x-1 lg:space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => scrollToSection("about")}
                  className={`transition-colors text-sm lg:text-base px-3 lg:px-4 ${
                    isActive("about")
                      ? "text-primary bg-primary/10 hover:bg-primary/20"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  About
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => scrollToSection("events")}
                  className={`transition-colors text-sm lg:text-base px-3 lg:px-4 ${
                    isActive("events")
                      ? "text-primary bg-primary/10 hover:bg-primary/20"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  Events
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/projects")}
                  className="transition-colors text-sm lg:text-base px-3 lg:px-4 text-foreground hover:text-primary"
                >
                  Projects
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/positions")}
                  className="transition-colors text-sm lg:text-base px-3 lg:px-4 text-foreground hover:text-primary"
                >
                  Positions
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => scrollToSection("recruitment")}
                  className={`transition-colors text-sm lg:text-base px-3 lg:px-4 ${
                    isActive("recruitment")
                      ? "text-primary bg-primary/10 hover:bg-primary/20"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  Join Us
                </Button>
              </nav>
            </div>

            {/* Right-aligned CTA & Mobile Menu Button */}
            <div className="flex items-center">
              <div className="hidden md:flex">
                <Button
                  onClick={() => scrollToSection("recruitment")}
                  className="bg-primary hover:bg-primary/90 text-sm lg:text-base px-4 lg:px-6"
                >
                  Get Started
                </Button>
              </div>
              <div className="md:hidden">
                <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* mobile menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
            />

            {/* mobile menu */}
            <motion.div
              className="fixed top-0 right-0 h-full w-64 sm:w-80 bg-background border-l z-50 md:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="flex flex-col h-full">
                {/* mobile menu header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center space-x-2">
                    <Image src="/gdg-logo.png" alt="GDG @ UTSC" width={32} height={32} className="h-8 w-auto" />
                    <div>
                      <h2 className="font-bold text-sm">GDG @ UTSC</h2>
                      <p className="text-xs text-muted-foreground">Google Developer Group</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Mobile Menu Navigation */}
                <nav className="flex flex-col flex-1 p-4 space-y-2">
                  <Button
                    variant="ghost"
                    onClick={() => scrollToSection("about")}
                    className={`justify-center p-3 h-auto transition-colors ${
                      isActive("about")
                        ? "text-primary bg-primary/10 hover:bg-primary/20"
                        : "text-foreground hover:text-primary hover:bg-muted"
                    }`}
                  >
                    About
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => scrollToSection("events")}
                    className={`justify-center p-3 h-auto transition-colors ${
                      isActive("events")
                        ? "text-primary bg-primary/10 hover:bg-primary/20"
                        : "text-foreground hover:text-primary hover:bg-muted"
                    }`}
                  >
                    Events
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => router.push("/projects")}
                    className="justify-center p-3 h-auto transition-colors text-foreground hover:text-primary hover:bg-muted"
                  >
                    Projects
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => router.push("/positions")}
                    className="justify-center p-3 h-auto transition-colors text-foreground hover:text-primary hover:bg-muted"
                  >
                    Positions
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => scrollToSection("recruitment")}
                    className={`justify-center p-3 h-auto transition-colors ${
                      isActive("recruitment")
                        ? "text-primary bg-primary/10 hover:bg-primary/20"
                        : "text-foreground hover:text-primary hover:bg-muted"
                    }`}
                  >
                    Join Us
                  </Button>

                  {/* Mobile CTA Button */}
                  <div className="pt-4 mt-4 border-t">
                    <Button
                      onClick={() => scrollToSection("recruitment")}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      Get Started
                    </Button>
                  </div>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
