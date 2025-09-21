"use client";

import { useEffect, useState } from "react";

interface HeaderClientProps {
  children: React.ReactNode;
}

const HeaderClient = ({ children }: HeaderClientProps) => {
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Fade the header as user scrolls (minimum opacity of 0.7)
      const opacity = Math.max(0.7, 1 - currentScrollY / 1000);
      setScrollOpacity(opacity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't render dynamic styles until mounted to prevent hydration mismatch
  const dynamicStyle = mounted ? { opacity: scrollOpacity } : { opacity: 1 };

  return (
    <header
      className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-300 w-full max-w-6xl px-6"
      style={dynamicStyle}
    >
      <div className="bg-transparent backdrop-blur-sm rounded-2xl border border-white/20">
        {children}
      </div>
    </header>
  );
};

export default HeaderClient;
