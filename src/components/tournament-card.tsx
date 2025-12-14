import { Link } from 'react-router-dom';
import { Calendar, Users, Trophy, Clock, Gamepad2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tournament, TournamentStatus } from '@/types';
import { cn } from '@/lib/utils';

interface TournamentCardProps {
  tournament: Tournament;
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
  fifa: 'from-green-500/20 to-green-900/20 border-green-500/30',
  cod: 'from-orange-500/20 to-orange-900/20 border-orange-500/30',
  pubg: 'from-yellow-500/20 to-yellow-900/20 border-yellow-500/30',
  fortnite: 'from-purple-500/20 to-purple-900/20 border-purple-500/30',
  apex: 'from-red-500/20 to-red-900/20 border-red-500/30',
  valorant: 'from-pink-500/20 to-pink-900/20 border-pink-500/30',
  other: 'from-blue-500/20 to-blue-900/20 border-blue-500/30',
};

const statusBadgeVariant: Record<TournamentStatus, "live" | "upcoming" | "completed" | "pending" | "registration"> = {
  live: 'live',
  upcoming: 'upcoming',
  registration_open: 'registration',
  registration_closed: 'pending',
  completed: 'completed',
  cancelled: 'pending',
};

const statusLabels: Record<TournamentStatus, string> = {
  live: 'LIVE',
  upcoming: 'Upcoming',
  registration_open: 'Registration Open',
  registration_closed: 'Registration Closed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function TournamentCard({ tournament, compact = false }: TournamentCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-KE', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const spotsLeft = tournament.maxParticipants - tournament.currentParticipants;
  const isFull = spotsLeft <= 0;

  if (compact) {
    return (
      <Link
        to={`/tournaments/${tournament.id}`}
        className={cn(
          "block p-4 rounded-xl border bg-gradient-to-br transition-all hover:scale-[1.02] hover:shadow-lg",
          gameColors[tournament.game]
        )}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{gameIcons[tournament.game]}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{tournament.title}</h3>
            <p className="text-sm text-muted-foreground">
              KES {tournament.prizePool.toLocaleString()} Prize
            </p>
          </div>
          <Badge variant={statusBadgeVariant[tournament.status]}>
            {statusLabels[tournament.status]}
          </Badge>
        </div>
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "group relative rounded-2xl border bg-gradient-to-br overflow-hidden transition-all hover:shadow-xl hover:shadow-primary/10",
        gameColors[tournament.game]
      )}
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <Badge variant={statusBadgeVariant[tournament.status]} className="font-display">
          {tournament.status === 'live' && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-1.5" />
          )}
          {statusLabels[tournament.status]}
        </Badge>
      </div>

      {/* Game Icon Background */}
      <div className="absolute -top-10 -right-10 text-[120px] opacity-10 pointer-events-none">
        {gameIcons[tournament.game]}
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="h-14 w-14 rounded-xl bg-background/50 flex items-center justify-center text-3xl">
            {gameIcons[tournament.game]}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-bold truncate">{tournament.title}</h3>
            <p className="text-sm text-muted-foreground capitalize">{tournament.game} • {tournament.format.replace('_', ' ')}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="font-semibold">KES {tournament.prizePool.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{tournament.currentParticipants}/{tournament.maxParticipants}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(tournament.startDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Gamepad2 className="h-4 w-4 text-muted-foreground" />
            <span>KES {tournament.entryFee}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Participants</span>
            <span className={cn("font-medium", isFull ? "text-destructive" : "text-primary")}>
              {isFull ? 'Full' : `${spotsLeft} spots left`}
            </span>
          </div>
          <div className="h-2 bg-background/50 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                isFull ? "bg-destructive" : "bg-primary"
              )}
              style={{ width: `${(tournament.currentParticipants / tournament.maxParticipants) * 100}%` }}
            />
          </div>
        </div>

        {/* Action */}
        <Button
          variant={tournament.status === 'registration_open' ? 'neon' : 'outline'}
          className="w-full"
          asChild
          disabled={tournament.status === 'completed' || tournament.status === 'cancelled'}
        >
          <Link to={`/tournaments/${tournament.id}`}>
            {tournament.status === 'live' ? 'Watch Live' :
             tournament.status === 'registration_open' ? 'Register Now' :
             tournament.status === 'completed' ? 'View Results' :
             'View Details'}
          </Link>
        </Button>
      </div>
    </div>
  );
}
