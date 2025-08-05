"use client";

import { motion } from "framer-motion";
import type React from "react";

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  showAvatar?: boolean;
}

export function LoadingSkeleton({ 
  className = "", 
  lines = 3, 
  showAvatar = false 
}: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="flex items-start space-x-4">
        {showAvatar && (
          <div className="h-12 w-12 rounded-full bg-gray-700"></div>
        )}
        <div className="flex-1 space-y-3">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={`h-4 rounded bg-gray-700 ${
                i === lines - 1 ? "w-3/4" : "w-full"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <motion.div 
      className={`animate-pulse rounded-lg border border-gray-800 bg-gray-900/50 p-6 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-4">
        <div className="h-6 w-3/4 rounded bg-gray-700"></div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-700"></div>
          <div className="h-4 w-5/6 rounded bg-gray-700"></div>
        </div>
        <div className="flex space-x-2">
          <div className="h-6 w-16 rounded bg-gray-700"></div>
          <div className="h-6 w-20 rounded bg-gray-700"></div>
        </div>
      </div>
    </motion.div>
  );
}

export function HeroSkeleton({ className = "" }: { className?: string }) {
  return (
    <motion.div 
      className={`animate-pulse space-y-8 text-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-4">
        <div className="mx-auto h-12 w-3/4 rounded bg-gray-700"></div>
        <div className="mx-auto h-12 w-1/2 rounded bg-gray-700"></div>
      </div>
      <div className="space-y-3">
        <div className="mx-auto h-4 w-5/6 rounded bg-gray-700"></div>
        <div className="mx-auto h-4 w-4/5 rounded bg-gray-700"></div>
        <div className="mx-auto h-4 w-3/4 rounded bg-gray-700"></div>
      </div>
      <div className="mx-auto h-12 w-40 rounded bg-gray-700"></div>
    </motion.div>
  );
}