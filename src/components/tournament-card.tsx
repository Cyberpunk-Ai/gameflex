import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Trophy, Gamepad2, ArrowRight, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TournamentCardProps {
  tournament: {
    id: string;
    title: string;
    game: string;
    format: string;
    status: string;
    entry_fee: number;
    prize_pool: number;
    max_participants: number;
    current_participants: number;
    start_date: string;
    image_url?: string;
  };
  compact?: boolean;
}

const gameIcons: Record<string, string> = {
  fifa: '⚽',
  cod: '🎯',
  pubg: '🔫',
  fortnite: '🏗️',
  apex: '🦊',
  valorant: '🎮',
  other: '🎮',
};

const gameColors: Record<string, string> = {
  fifa: 'from-green-500/20 via-green-900/10 to-transparent border-green-500/30 hover:border-green-500/50',
  cod: 'from-orange-500/20 via-orange-900/10 to-transparent border-orange-500/30 hover:border-orange-500/50',
  pubg: 'from-yellow-500/20 via-yellow-900/10 to-transparent border-yellow-500/30 hover:border-yellow-500/50',
  fortnite: 'from-purple-500/20 via-purple-900/10 to-transparent border-purple-500/30 hover:border-purple-500/50',
  apex: 'from-red-500/20 via-red-900/10 to-transparent border-red-500/30 hover:border-red-500/50',
  valorant: 'from-pink-500/20 via-pink-900/10 to-transparent border-pink-500/30 hover:border-pink-500/50',
  other: 'from-blue-500/20 via-blue-900/10 to-transparent border-blue-500/30 hover:border-blue-500/50',
};

const statusConfig: Record<string, { variant: "destructive" | "default" | "secondary" | "outline"; label: string; glow?: boolean }> = {
  live: { variant: 'destructive', label: 'LIVE', glow: true },
  upcoming: { variant: 'secondary', label: 'Upcoming' },
  registration_open: { variant: 'default', label: 'Open', glow: true },
  registration_closed: { variant: 'secondary', label: 'Closed' },
  completed: { variant: 'outline', label: 'Completed' },
  cancelled: { variant: 'outline', label: 'Cancelled' },
};

export const TournamentCard = forwardRef<HTMLDivElement, TournamentCardProps>(
  function TournamentCard({ tournament, compact = false }, ref) {
  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en-KE', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const spotsLeft = tournament.max_participants - (tournament.current_participants ?? 0);
  const isFull = spotsLeft <= 0;
  const fillPercent = ((tournament.current_participants ?? 0) / tournament.max_participants) * 100;
  const status = statusConfig[tournament.status] || statusConfig.other;

  if (compact) {
    return (
      <Link
        to={`/tournaments/${tournament.id}`}
        className={cn(
          "block p-4 rounded-xl border bg-gradient-to-br transition-all hover:shadow-lg backdrop-blur-sm group",
          gameColors[tournament.game] || gameColors.other
        )}
      >
        <div className="flex items-center gap-3">
          <motion.span 
            className="text-2xl"
            whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
          >
            {gameIcons[tournament.game] || gameIcons.other}
          </motion.span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate group-hover:text-primary transition-colors">{tournament.title}</h3>
            <p className="text-sm text-muted-foreground">
              KES {Number(tournament.prize_pool).toLocaleString()} Prize
            </p>
          </div>
          <Badge variant={status.variant}>
            {tournament.status === 'live' && (
              <span className="w-2 h-2 rounded-full bg-current animate-pulse mr-1.5" />
            )}
            {status.label}
          </Badge>
        </div>
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        "group relative rounded-2xl border bg-gradient-to-br overflow-hidden transition-all duration-300",
        "hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1",
        "backdrop-blur-sm",
        gameColors[tournament.game] || gameColors.other
      )}
    >
      {/* Glow effect for live/open tournaments */}
      {status.glow && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
        </div>
      )}

      {/* Tournament Image */}
      {tournament.image_url && (
        <div className="h-36 overflow-hidden relative">
          <img 
            src={tournament.image_url} 
            alt={tournament.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
        </div>
      )}

      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <motion.div
          animate={tournament.status === 'live' ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Badge 
            variant={status.variant} 
            className={cn(
              "font-display backdrop-blur-xl",
              tournament.status === 'live' && "shadow-lg shadow-destructive/30"
            )}
          >
            {tournament.status === 'live' && (
              <span className="w-2 h-2 rounded-full bg-current animate-pulse mr-1.5" />
            )}
            {status.label}
          </Badge>
        </motion.div>
      </div>

      {/* Game Icon Background */}
      {!tournament.image_url && (
        <div className="absolute -top-10 -right-10 text-[140px] opacity-[0.07] pointer-events-none select-none transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
          {gameIcons[tournament.game] || gameIcons.other}
        </div>
      )}

      <div className="p-6 relative">
        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <motion.div 
            className="h-14 w-14 rounded-xl bg-background/60 backdrop-blur-sm border border-border/50 flex items-center justify-center text-3xl shadow-lg"
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.4 }}
          >
            {gameIcons[tournament.game] || gameIcons.other}
          </motion.div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-bold truncate group-hover:text-primary transition-colors">
              {tournament.title}
            </h3>
            <p className="text-sm text-muted-foreground capitalize">
              {tournament.game} • {(tournament.format || '').replace('_', ' ')}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="flex items-center gap-2.5 text-sm p-2.5 rounded-lg bg-background/40 backdrop-blur-sm">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Trophy className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Prize</div>
              <div className="font-semibold">KES {Number(tournament.prize_pool).toLocaleString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-sm p-2.5 rounded-lg bg-background/40 backdrop-blur-sm">
            <div className="p-1.5 rounded-md bg-secondary">
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Players</div>
              <div className="font-semibold">{tournament.current_participants ?? 0}/{tournament.max_participants}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-sm p-2.5 rounded-lg bg-background/40 backdrop-blur-sm">
            <div className="p-1.5 rounded-md bg-secondary">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Starts</div>
              <div className="font-semibold">{formatDate(tournament.start_date)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-sm p-2.5 rounded-lg bg-background/40 backdrop-blur-sm">
            <div className="p-1.5 rounded-md bg-secondary">
              <Gamepad2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Entry</div>
              <div className="font-semibold">KES {Number(tournament.entry_fee).toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-5">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-muted-foreground">Slots filling up</span>
            <span className={cn("font-semibold", isFull ? "text-destructive" : "text-primary")}>
              {isFull ? 'Tournament Full' : `${spotsLeft} spots left`}
            </span>
          </div>
          <div className="h-2.5 bg-background/60 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              className={cn(
                "h-full rounded-full relative overflow-hidden",
                isFull ? "bg-destructive" : "bg-gradient-to-r from-primary to-primary/80"
              )}
              initial={{ width: 0 }}
              whileInView={{ width: `${fillPercent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </motion.div>
          </div>
        </div>

        {/* Action */}
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            variant={tournament.status === 'registration_open' ? 'default' : 'outline'}
            className={cn(
              "w-full group/btn",
              tournament.status === 'registration_open' && "shadow-lg shadow-primary/20"
            )}
            asChild
            disabled={tournament.status === 'completed' || tournament.status === 'cancelled'}
          >
            <Link to={`/tournaments/${tournament.id}`} className="flex items-center justify-center gap-2">
              {tournament.status === 'registration_open' && <Sparkles className="h-4 w-4" />}
              {tournament.status === 'live' ? 'Watch Live' :
               tournament.status === 'registration_open' ? 'Register Now' :
               tournament.status === 'completed' ? 'View Results' :
               'View Details'}
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
});
