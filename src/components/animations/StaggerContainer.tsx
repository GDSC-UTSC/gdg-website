"use client";

import { motion, type Variants } from "framer-motion";
import type React from "react";

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
  initialDelay?: number;
}

export default function StaggerContainer({ 
  children, 
  staggerDelay = 0.1,
  className = "",
  initialDelay = 0
}: StaggerContainerProps) {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: initialDelay,
        staggerChildren: staggerDelay
      }
    }
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
}