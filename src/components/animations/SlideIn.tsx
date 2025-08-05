"use client";

import { motion, type Variants } from "framer-motion";
import type React from "react";

interface SlideInProps {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  distance?: number;
}

export default function SlideIn({ 
  children, 
  direction = "left",
  delay = 0, 
  duration = 0.6, 
  className = "",
  distance = 50
}: SlideInProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case "left":
        return { x: -distance, y: 0 };
      case "right":
        return { x: distance, y: 0 };
      case "up":
        return { x: 0, y: -distance };
      case "down":
        return { x: 0, y: distance };
      default:
        return { x: -distance, y: 0 };
    }
  };

  const variants: Variants = {
    hidden: { 
      opacity: 0, 
      ...getInitialPosition()
    },
    visible: { 
      opacity: 1, 
      x: 0,
      y: 0
    }
  };

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
    >
      {children}
    </motion.div>
  );
}