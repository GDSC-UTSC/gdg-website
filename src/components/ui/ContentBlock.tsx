import { motion } from "framer-motion";
import type React from "react";

interface ContentBlockProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ContentBlock({ title, children, className = "", delay = 0.2 }: ContentBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 ${className}`}
    >
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <div className="space-y-3">
        {children}
      </div>
    </motion.div>
  );
}