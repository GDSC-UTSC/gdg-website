"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import AnimatedStarfield from "@buildwithai/components/AnimatedStarfield";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Animated Starfield */}
      <div className="absolute inset-0 -z-15">
        <AnimatedStarfield />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 pt-24 pb-32">
        {/* GDG Logo */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -50, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
        >
          <Image
            src="/logo.webp"
            alt="GDG Logo"
            width={120}
            height={120}
            className="drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
          />
        </motion.div>

        {/* Organization name */}
        <motion.p
          className="text-white/90 font-medium tracking-wider text-base sm:text-lg mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Google Developer Group - UTSC
        </motion.p>

        {/* Main title */}
        <motion.h1
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight mb-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        >
          <motion.span
            className="block text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.5)]"
            style={{ textShadow: '0 0 80px rgba(255,255,255,0.4), 0 0 120px rgba(255,255,255,0.2)' }}
            animate={{
              textShadow: [
                '0 0 80px rgba(255,255,255,0.4), 0 0 120px rgba(255,255,255,0.2)',
                '0 0 100px rgba(255,255,255,0.6), 0 0 150px rgba(255,255,255,0.3)',
                '0 0 80px rgba(255,255,255,0.4), 0 0 120px rgba(255,255,255,0.2)',
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            BUILD WITH AI
          </motion.span>
        </motion.h1>

        {/* Year with outline effect */}
        <motion.div
          className="text-7xl sm:text-8xl md:text-9xl font-black tracking-wider mb-16"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
        >
          <motion.span
            className="text-transparent"
            style={{
              WebkitTextStroke: '2px rgba(255,255,255,0.8)',
              textShadow: '0 0 30px rgba(255,255,255,0.3)'
            }}
            animate={{
              textShadow: [
                '0 0 30px rgba(255,255,255,0.3)',
                '0 0 50px rgba(255,255,255,0.5)',
                '0 0 30px rgba(255,255,255,0.3)',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            2025
          </motion.span>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255,255,255,0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/agenda"
              className="inline-flex items-center justify-center rounded-full bg-white text-black px-8 py-4 font-semibold text-lg transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              View Agenda
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
            className="rounded-full"
          >
            <Link
              href="/workshops"
              className="inline-flex items-center justify-center rounded-full border-2 border-white/70 px-8 py-4 text-white font-semibold text-lg transition-all"
            >
              Workshops
            </Link>
          </motion.div>
        </motion.div>

        {/* Event details */}
        <motion.p
          className="text-white/60 text-sm sm:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          May 10, 2025 • UTSC Science Building • Toronto, ON
        </motion.p>
      </div>

      {/* Planet at bottom */}
      <motion.div
        className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 0.8, y: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotateZ: [0, 1, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            src="/planet.webp"
            alt=""
            fill
            className="object-contain"
            priority
          />
        </motion.div>
      </motion.div>

      {/* Gradient fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent -z-5" />
    </section>
  );
}
