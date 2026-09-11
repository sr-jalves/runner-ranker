import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface NeonCardProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "accent" | "default";
  glow?: boolean;
}

export function NeonCard({ children, className, variant = "default", glow = false }: NeonCardProps) {
  const borderColors = {
    primary: "border-primary/30 hover:border-primary/60",
    secondary: "border-secondary/30 hover:border-secondary/60",
    accent: "border-accent/30 hover:border-accent/60",
    default: "border-white/10 hover:border-white/20",
  };

  const shadowColors = {
    primary: "shadow-[0_0_20px_-5px_rgba(204,255,0,0.15)]",
    secondary: "shadow-[0_0_20px_-5px_rgba(0,255,255,0.15)]",
    accent: "shadow-[0_0_20px_-5px_rgba(255,0,255,0.15)]",
    default: "shadow-none",
  };

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className={cn(
        "bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300",
        borderColors[variant],
        glow && shadowColors[variant],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
