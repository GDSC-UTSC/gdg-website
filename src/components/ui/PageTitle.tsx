import { motion } from "framer-motion";

interface PageTitleProps {
  title: string;
  description: string;
  className?: string;
}

export default function PageTitle({
  title,
  description,
  className = "",
}: PageTitleProps) {
  return (
    <motion.div
      className={`text-center mb-12 ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-bl from-foreground via-primary to-foreground bg-clip-text text-transparent">
        {title}
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
        {description}
      </p>
    </motion.div>
  );
}
