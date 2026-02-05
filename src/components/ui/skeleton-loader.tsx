import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-muted/50",
        className
      )}
    />
  );
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn("rounded-xl border border-border/50 bg-card p-4 space-y-4", className)}>
      <Skeleton className="h-40 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}

export function SkeletonTournamentCard({ className }: SkeletonProps) {
  return (
    <div className={cn("rounded-xl border border-border/50 bg-card overflow-hidden", className)}>
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-6 w-4/5" />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonLeaderboardRow({ className }: SkeletonProps) {
  return (
    <div className={cn("flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50", className)}>
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="text-right space-y-2">
        <Skeleton className="h-5 w-20 ml-auto" />
        <Skeleton className="h-3 w-16 ml-auto" />
      </div>
    </div>
  );
}

export function SkeletonProfile({ className }: SkeletonProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 rounded-xl bg-card border border-border/50 space-y-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonMessage({ className }: SkeletonProps) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <Skeleton className="h-8 w-8 rounded-full shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-16 w-3/4 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonStats({ className }: SkeletonProps) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-6 rounded-xl bg-card border border-border/50 text-center space-y-2">
          <Skeleton className="h-10 w-10 rounded-lg mx-auto" />
          <Skeleton className="h-8 w-20 mx-auto" />
          <Skeleton className="h-3 w-16 mx-auto" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, className }: SkeletonProps & { rows?: number }) {
  return (
    <div className={cn("rounded-xl border border-border/50 overflow-hidden", className)}>
      <div className="bg-muted/30 p-4 border-b border-border/50">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28 ml-auto" />
        </div>
      </div>
      <div className="divide-y divide-border/50">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Loading spinner with pulse
export function LoadingSpinner({ className, size = "md" }: SkeletonProps & { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3"
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-primary/20 border-t-primary",
        sizes[size],
        className
      )}
    />
  );
}

// Full page loading state
export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" className="mx-auto" />
        <p className="text-muted-foreground animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
