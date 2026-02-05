import { motion, Variants, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

// Fade In animations
export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Scale animations
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
};

// Stagger container
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  }
};

// Slide animations
export const slideInFromBottom: Variants = {
  hidden: { y: "100%" },
  visible: { 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
  exit: { 
    y: "100%",
    transition: { duration: 0.3, ease: "easeIn" }
  }
};

export const slideInFromRight: Variants = {
  hidden: { x: "100%" },
  visible: { 
    x: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  },
  exit: { 
    x: "100%",
    transition: { duration: 0.3, ease: "easeIn" }
  }
};

// Blur animations
export const blurIn: Variants = {
  hidden: { opacity: 0, filter: "blur(10px)" },
  visible: { 
    opacity: 1, 
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// Hover animations
export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.2 }
};

export const hoverLift = {
  y: -4,
  transition: { duration: 0.2 }
};

export const tapScale = {
  scale: 0.98
};

// Motion wrapper components
interface MotionDivProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
}

export const FadeIn = React.forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeIn}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
FadeIn.displayName = "FadeIn";

export const FadeInUp = React.forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
FadeInUp.displayName = "FadeInUp";

export const ScaleIn = React.forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={scaleIn}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
ScaleIn.displayName = "ScaleIn";

interface StaggerContainerProps extends MotionDivProps {
  fast?: boolean;
}

export const StaggerContainer = React.forwardRef<HTMLDivElement, StaggerContainerProps>(
  ({ children, className, fast = false, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fast ? staggerContainerFast : staggerContainer}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
StaggerContainer.displayName = "StaggerContainer";

export const StaggerItem = React.forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
StaggerItem.displayName = "StaggerItem";

// Interactive card with hover effects
interface MotionCardProps extends MotionDivProps {
  hoverEffect?: "lift" | "scale" | "glow" | "none";
}

export const MotionCard = React.forwardRef<HTMLDivElement, MotionCardProps>(
  ({ children, className, hoverEffect = "lift", ...props }, ref) => {
    const hoverProps = {
      lift: { whileHover: hoverLift, whileTap: tapScale },
      scale: { whileHover: hoverScale, whileTap: tapScale },
      glow: { whileHover: { boxShadow: "0 0 30px hsl(var(--primary) / 0.3)" } },
      none: {}
    };

    return (
      <motion.div
        ref={ref}
        className={cn("transition-shadow", className)}
        {...hoverProps[hoverEffect]}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
MotionCard.displayName = "MotionCard";

// Animated counter
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({ 
  value, 
  duration = 2, 
  className,
  prefix = "",
  suffix = ""
}: AnimatedCounterProps) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {prefix}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {value.toLocaleString()}
        </motion.span>
        {suffix}
      </motion.span>
    </motion.span>
  );
}

// Floating animation wrapper
export const FloatingElement = React.forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      animate={{ 
        y: [0, -10, 0],
      }}
      transition={{ 
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
FloatingElement.displayName = "FloatingElement";

// Pulse glow animation
export const PulseGlow = React.forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      animate={{ 
        boxShadow: [
          "0 0 20px hsl(var(--primary) / 0.3)",
          "0 0 40px hsl(var(--primary) / 0.5)",
          "0 0 20px hsl(var(--primary) / 0.3)"
        ]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
PulseGlow.displayName = "PulseGlow";

// Text reveal animation
interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export function TextReveal({ text, className, delay = 0 }: TextRevealProps) {
  const words = text.split(" ");
  
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                delay: delay + i * 0.05,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1]
              }
            }
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Gradient text with animation
export function AnimatedGradientText({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.span
      className={cn(
        "bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto]",
        className
      )}
      animate={{
        backgroundPosition: ["0% center", "200% center"]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      {children}
    </motion.span>
  );
}

// Page transition wrapper
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
