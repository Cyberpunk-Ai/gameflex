import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParticleProps {
  className?: string;
  quantity?: number;
}

export function FloatingParticles({ className, quantity = 20 }: ParticleProps) {
  const particles = Array.from({ length: quantity }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/20"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

interface GradientOrbProps {
  className?: string;
  color?: "primary" | "accent" | "secondary";
  size?: "sm" | "md" | "lg" | "xl";
  position?: { top?: string; left?: string; right?: string; bottom?: string };
}

export function GradientOrb({ 
  className,
  color = "primary",
  size = "md",
  position = {}
}: GradientOrbProps) {
  const colors = {
    primary: "from-primary/30 to-primary/5",
    accent: "from-accent/30 to-accent/5",
    secondary: "from-secondary/50 to-secondary/10"
  };

  const sizes = {
    sm: "w-32 h-32",
    md: "w-64 h-64",
    lg: "w-96 h-96",
    xl: "w-[500px] h-[500px]"
  };

  return (
    <motion.div
      className={cn(
        "absolute rounded-full bg-gradient-radial blur-3xl pointer-events-none",
        colors[color],
        sizes[size],
        className
      )}
      style={position}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.5, 0.7, 0.5],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

interface GridBackgroundProps {
  className?: string;
}

export function GridBackground({ className }: GridBackgroundProps) {
  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}>
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
    </div>
  );
}

interface AnimatedBorderProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedBorder({ children, className }: AnimatedBorderProps) {
  return (
    <div className={cn("relative p-[1px] rounded-xl overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary"
        animate={{
          backgroundPosition: ["0% center", "200% center"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundSize: "200% 100%",
        }}
      />
      <div className="relative bg-card rounded-[11px] h-full">
        {children}
      </div>
    </div>
  );
}

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div 
      className={cn(
        "relative backdrop-blur-xl bg-card/80 border border-border/50 rounded-xl overflow-hidden",
        "before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none",
        className
      )}
    >
      {children}
    </div>
  );
}

interface SpotlightProps {
  className?: string;
}

export function Spotlight({ className }: SpotlightProps) {
  return (
    <motion.div
      className={cn(
        "absolute pointer-events-none",
        className
      )}
      animate={{
        background: [
          "radial-gradient(600px circle at 0% 0%, hsl(var(--primary) / 0.1), transparent 40%)",
          "radial-gradient(600px circle at 100% 0%, hsl(var(--primary) / 0.1), transparent 40%)",
          "radial-gradient(600px circle at 100% 100%, hsl(var(--primary) / 0.1), transparent 40%)",
          "radial-gradient(600px circle at 0% 100%, hsl(var(--primary) / 0.1), transparent 40%)",
          "radial-gradient(600px circle at 0% 0%, hsl(var(--primary) / 0.1), transparent 40%)",
        ],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        inset: 0,
      }}
    />
  );
}

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function ShimmerButton({ children, className, ...props }: ShimmerButtonProps) {
  return (
    <button
      className={cn(
        "relative overflow-hidden rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// Noise texture overlay
export function NoiseTexture({ className }: { className?: string }) {
  return (
    <div 
      className={cn("absolute inset-0 pointer-events-none opacity-[0.015]", className)}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}
