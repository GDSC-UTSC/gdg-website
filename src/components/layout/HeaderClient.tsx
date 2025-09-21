"use client";

import { useEffect, useState } from "react";

interface HeaderClientProps {
  children: React.ReactNode;
}

const HeaderClient = ({ children }: HeaderClientProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Toggle scrolled state for subtle style changes (no opacity changes)
      setIsScrolled(currentScrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fully opaque background so content underneath is not visible
  const backgroundClass = mounted && isScrolled ? "bg-black border-white/40" : "bg-black border-white/20";

  return (
    <header className="fixed top-3 sm:top-6 left-1/2 transform -translate-x-1/2 z-[9999] transition-all duration-300 w-full max-w-6xl px-3 sm:px-6">
      <div className={`${backgroundClass} rounded-2xl border overflow-hidden transition-all duration-300`}>
        {children}
      </div>
    </header>
  );
};

export default HeaderClient;
