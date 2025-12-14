import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Users, Trophy, Clock, Gamepad2, ArrowLeft, Shield, Info, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaymentModal } from '@/components/payment-modal';
import { mockTournaments, mockMatches } from '@/lib/mock-data';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';

const statusLabels: Record<string, string> = { live: 'LIVE', upcoming: 'Upcoming', registration_open: 'Registration Open', registration_closed: 'Registration Closed', completed: 'Completed', cancelled: 'Cancelled' };

export default function TournamentDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showPayment, setShowPayment] = useState(false);

  const tournament = mockTournaments.find(t => t.id === id);
  if (!tournament) return <div className="container mx-auto px-4 py-20 text-center"><h1 className="font-display text-2xl">Tournament not found</h1><Link to="/tournaments" className="text-primary hover:underline mt-4 inline-block">Back to tournaments</Link></div>;

  const matches = mockMatches.filter(m => m.tournamentId === id);
  const formatDate = (date: Date) => new Intl.DateTimeFormat('en-KE', { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date));

  const handleRegister = () => {
    if (!isAuthenticated) { toast({ title: 'Login Required', description: 'Please login to register for tournaments', variant: 'destructive' }); return; }
    setShowPayment(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/tournaments" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"><ArrowLeft className="h-4 w-4" />Back to Tournaments</Link>

      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <Badge variant={tournament.status === 'live' ? 'live' : tournament.status === 'registration_open' ? 'registration' : 'upcoming'} className="mb-4">{statusLabels[tournament.status]}</Badge>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">{tournament.title}</h1>
            <p className="text-muted-foreground mb-4">{tournament.description}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />{formatDate(tournament.startDate)}</span>
              <span className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" />{tournament.currentParticipants}/{tournament.maxParticipants} players</span>
              <span className="flex items-center gap-2"><Gamepad2 className="h-4 w-4 text-primary" />{tournament.game.toUpperCase()}</span>
            </div>
          </div>
          <div className="text-center md:text-right">
            <div className="font-display text-4xl font-bold text-primary mb-1">KES {tournament.prizePool.toLocaleString()}</div>
            <div className="text-muted-foreground mb-4">Prize Pool</div>
            {tournament.status === 'registration_open' && <Button size="lg" variant="gaming" onClick={handleRegister}>Register • KES {tournament.entryFee}</Button>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="brackets">Brackets</TabsTrigger><TabsTrigger value="participants">Participants</TabsTrigger><TabsTrigger value="rules">Rules</TabsTrigger></TabsList>

        <TabsContent value="overview">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="rounded-xl bg-card border border-border/50 p-6">
                <h3 className="font-display font-bold mb-4">Tournament Info</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Format:</span> <span className="font-medium capitalize">{tournament.format.replace('_', ' ')}</span></div>
                  <div><span className="text-muted-foreground">Entry Fee:</span> <span className="font-medium">KES {tournament.entryFee}</span></div>
                  <div><span className="text-muted-foreground">Game:</span> <span className="font-medium uppercase">{tournament.game}</span></div>
                  <div><span className="text-muted-foreground">Registration Deadline:</span> <span className="font-medium">{formatDate(tournament.registrationDeadline)}</span></div>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-card border border-border/50 p-6">
              <h3 className="font-display font-bold mb-4">Prize Distribution</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-yellow-500">🥇 1st Place</span><span className="font-bold">KES {Math.round(tournament.prizePool * 0.5).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">🥈 2nd Place</span><span className="font-bold">KES {Math.round(tournament.prizePool * 0.3).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-orange-500">🥉 3rd Place</span><span className="font-bold">KES {Math.round(tournament.prizePool * 0.2).toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="brackets">
          <div className="rounded-xl bg-card border border-border/50 p-6">
            <h3 className="font-display font-bold mb-6">Tournament Bracket</h3>
            {matches.length > 0 ? (
              <div className="space-y-4">
                {matches.map(match => (
                  <div key={match.id} className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                    <div className="flex items-center justify-between">
                      <div>Round {match.round} • Match {match.matchNumber}</div>
                      <Badge variant={match.status === 'live' ? 'live' : match.status === 'completed' ? 'completed' : 'upcoming'}>{match.status}</Badge>
                    </div>
                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex-1 p-2 rounded bg-background">Player {match.player1Id || 'TBD'} {match.player1Score !== undefined && <span className="float-right font-bold">{match.player1Score}</span>}</div>
                      <span className="text-muted-foreground">vs</span>
                      <div className="flex-1 p-2 rounded bg-background">Player {match.player2Id || 'TBD'} {match.player2Score !== undefined && <span className="float-right font-bold">{match.player2Score}</span>}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-muted-foreground text-center py-8">Brackets will be generated when the tournament starts</p>}
          </div>
        </TabsContent>

        <TabsContent value="participants">
          <div className="rounded-xl bg-card border border-border/50 p-6">
            <h3 className="font-display font-bold mb-4">{tournament.currentParticipants} Registered Players</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array.from({ length: tournament.currentParticipants }, (_, i) => (
                <div key={i} className="p-3 rounded-lg bg-secondary/50 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center"><User className="h-4 w-4 text-primary" /></div>
                  <span className="text-sm truncate">Player{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rules">
          <div className="rounded-xl bg-card border border-border/50 p-6">
            <h3 className="font-display font-bold mb-4">Tournament Rules</h3>
            <pre className="whitespace-pre-wrap text-sm text-muted-foreground">{tournament.rules}</pre>
          </div>
        </TabsContent>
      </Tabs>

      <PaymentModal tournament={tournament} isOpen={showPayment} onClose={() => setShowPayment(false)} onSuccess={() => toast({ title: 'Registration submitted!', description: 'Awaiting payment verification' })} />
    </div>
  );
}
