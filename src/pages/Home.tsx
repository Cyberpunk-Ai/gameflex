import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Zap, Shield, ArrowRight, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TournamentCard } from '@/components/tournament-card';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const features = [
  { icon: Trophy, title: 'Win Big Prizes', description: 'Compete for cash prizes up to KES 100,000+' },
  { icon: Shield, title: 'Secure Payments', description: 'Fast M-Pesa payments with instant verification' },
  { icon: Users, title: 'Active Community', description: 'Join 1500+ gamers competing daily' },
  { icon: Zap, title: 'Live Tournaments', description: 'Real-time brackets and live match updates' },
];

const games = [
  { name: 'FIFA 24', icon: '⚽', players: 450 },
  { name: 'Call of Duty', icon: '🎯', players: 380 },
  { name: 'PUBG Mobile', icon: '🔫', players: 320 },
  { name: 'Fortnite', icon: '🏗️', players: 280 },
  { name: 'Apex Legends', icon: '🦊', players: 210 },
  { name: 'Valorant', icon: '🎮', players: 190 },
];

export default function Home() {
  const queryClient = useQueryClient();
  
  const { data: tournaments = [] } = useQuery({
    queryKey: ['home-tournaments'],
    queryFn: async () => {
      const { data } = await supabase
        .from('tournaments')
        .select('*')
        .in('status', ['live', 'registration_open', 'upcoming'])
        .order('start_date', { ascending: true })
        .limit(6);
      return data ?? [];
    }
  });

  // Real-time subscription for tournament updates
  useEffect(() => {
    const channel = supabase
      .channel('home-tournaments-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tournaments' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['home-tournaments'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: leaderboard = [] } = useQuery({
    queryKey: ['home-leaderboard'],
    queryFn: async () => {
      const { data: statsData } = await supabase
        .from('leaderboard_stats')
        .select('*')
        .order('points', { ascending: false })
        .limit(5);
      
      if (!statsData || statsData.length === 0) return [];
      
      const userIds = [...new Set(statsData.map(s => s.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, username, avatar_url, game_handle')
        .in('user_id', userIds);
      
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) ?? []);
      
      return statsData.map(s => ({
        ...s,
        profiles: profileMap.get(s.user_id)
      }));
    }
  });

  const liveTournaments = tournaments.filter((t: any) => t.status === 'live');
  const upcomingTournaments = tournaments.filter((t: any) => t.status === 'registration_open' || t.status === 'upcoming').slice(0, 3);
  const topPlayers = leaderboard.slice(0, 5);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-fade pointer-events-none" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            {liveTournaments.length > 0 && (
              <div className="inline-flex items-center gap-2 mb-8 px-3 py-1 rounded-full border border-border bg-secondary/40 text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-muted-foreground">
                  {liveTournaments.length} Tournament{liveTournaments.length > 1 ? 's' : ''} Live Now
                </span>
              </div>
            )}

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold mb-6 leading-[1.05] tracking-tight">
              Compete. Win. <span className="text-muted-foreground">Earn.</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Kenya's premier gaming tournament platform. Join thousands of gamers competing for real cash prizes with M-Pesa payments.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" asChild>
                <Link to="/tournaments">
                  Browse Tournaments
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/register">Create Account</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-px mt-16 max-w-2xl mx-auto border border-border rounded-xl overflow-hidden bg-card">
              {[
                { v: '1.5K+', l: 'Players' },
                { v: 'KES 2.4M', l: 'Paid Out' },
                { v: '48', l: 'Tournaments' },
              ].map((s) => (
                <div key={s.l} className="bg-card p-5">
                  <div className="text-2xl md:text-3xl font-semibold tracking-tight">{s.v}</div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">Popular games</h2>
          <p className="text-muted-foreground mb-8">Pick your arena</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {games.map((game) => (
              <Link
                key={game.name}
                to={`/tournaments?game=${game.name.toLowerCase().replace(' ', '')}`}
                className="surface-card surface-card-hover p-5 text-center"
              >
                <div className="text-4xl mb-3">{game.icon}</div>
                <div className="font-medium text-sm">{game.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{game.players} players</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tournaments */}
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Featured tournaments</h2>
              <p className="text-muted-foreground mt-1 text-sm">Join the action — prize pools climbing</p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/tournaments">View all <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingTournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">Why GameFlex</h2>
          <p className="text-muted-foreground mb-10">Built for serious competitors</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="surface-card p-6">
                <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center mb-4">
                  <feature.icon className="h-4 w-4 text-foreground" />
                </div>
                <h3 className="font-medium mb-1.5">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Players */}
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Top players</h2>
              <p className="text-muted-foreground mt-1 text-sm">This week's leaders</p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/leaderboard">Full leaderboard <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="surface-card divide-y divide-border overflow-hidden">
            {topPlayers.map((player: any, index: number) => (
              <div key={player.id} className="flex items-center gap-4 p-4 hover:bg-secondary/40 transition-colors">
                <div className="h-9 w-9 rounded-md flex items-center justify-center font-mono text-sm bg-secondary text-muted-foreground">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{player.profiles?.username ?? 'Unknown'}</div>
                  <div className="text-xs text-muted-foreground">{player.profiles?.game_handle ?? '-'}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-medium">{(player.points ?? 0).toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">{player.wins ?? 0}W · {player.losses ?? 0}L</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center surface-card p-10 md:p-14">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">Ready to compete?</h2>
            <p className="text-muted-foreground mb-7">Join thousands of gamers and start winning today.</p>
            <Button size="lg" asChild>
              <Link to="/register">Get started free</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
