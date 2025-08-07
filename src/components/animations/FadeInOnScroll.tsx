"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import type React from "react";

interface FadeInOnScrollProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  y?: number;
  threshold?: number;
  once?: boolean;
}

export default function FadeInOnScroll({ 
  children, 
  delay = 0, 
  duration = 0.6, 
  className = "",
  y = 30,
  threshold = 0.1,
  once = true
}: FadeInOnScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    threshold,
    once 
  });

  const variants: Variants = {
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
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
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