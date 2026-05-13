import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  animate?: boolean;
  delay?: number;
  id?: string;
}

/** Glassmorphic card component with optional glow and entrance animation */
export function GlassCard({
  children,
  className = '',
  glowColor,
  animate = true,
  delay = 0,
  id,
}: GlassCardProps) {
  const glowStyle = glowColor
    ? { boxShadow: `0 0 20px ${glowColor}, 0 0 60px ${glowColor}` }
    : {};

  if (!animate) {
    return (
      <div
        id={id}
        className={`glass glass-hover ${className}`}
        style={glowStyle}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      id={id}
      className={`glass glass-hover ${className}`}
      style={glowStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      }}
    >
      {children}
    </motion.div>
  );
}
