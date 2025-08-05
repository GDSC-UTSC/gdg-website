"use client";

import { motion, type Variants } from "framer-motion";
import type React from "react";

interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  initialScale?: number;
  hover?: boolean;
}

export default function ScaleIn({ 
  children, 
  delay = 0, 
  duration = 0.4, 
  className = "",
  initialScale = 0.8,
  hover = false
}: ScaleInProps) {
  const variants: Variants = {
    hidden: { 
      opacity: 0, 
      scale: initialScale 
    },
    visible: { 
      opacity: 1, 
      scale: 1 
    }
  };

  const hoverVariants = hover ? {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 }
  } : {};

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{
        duration,
        delay,
        ease: "easeOut"
      }}
      {...hoverVariants}
    >
      {children}
    </motion.div>
  );
}