"use client";

import { motion, type Variants } from "framer-motion";
import type React from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  y?: number;
}

const fadeInVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0 
  }
};

export default function FadeIn({ 
  children, 
  delay = 0, 
  duration = 0.6, 
  className = "",
  y = 20
}: FadeInProps) {
  const customVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y 
    },
    visible: { 
      opacity: 1, 
      y: 0 
    }
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={customVariants}
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