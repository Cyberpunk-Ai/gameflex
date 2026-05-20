import { useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Zap, Shield, ArrowRight, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TournamentCard } from '@/components/tournament-card';
import { TiltCard } from '@/components/ui/tilt-card';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const HeroScene = lazy(() => import('@/components/three/hero-scene').then(m => ({ default: m.HeroScene })));

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
      <section className="relative py-24 lg:py-36 overflow-hidden">
        {/* 3D scene */}
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </div>
        {/* Grid + aurora overlays */}
        <div className="absolute inset-0 grid-fade pointer-events-none" />
        <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gradient-aurora opacity-30 blur-3xl animate-aurora pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 pointer-events-none">
          <div className="max-w-4xl mx-auto text-center">
            {liveTournaments.length > 0 && (
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full glass-panel pointer-events-auto">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500" />
                </span>
                <span className="text-xs font-semibold tracking-wider uppercase text-foreground/90">
                  {liveTournaments.length} Tournament{liveTournaments.length > 1 ? 's' : ''} Live Now
                </span>
              </div>
            )}

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.05] tracking-tight">
              Compete. Win.<br/>
              <span className="shimmer-text">Earn.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Kenya's premier gaming tournament platform. Join thousands of gamers competing for real cash prizes with M-Pesa payments.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto">
              <Button size="xl" variant="gaming" asChild>
                <Link to="/tournaments">
                  Browse Tournaments
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link to="/register">Create Account</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 mt-16 max-w-2xl mx-auto pointer-events-auto">
              {[
                { v: '1.5K+', l: 'Players' },
                { v: 'KES 2.4M', l: 'Paid Out' },
                { v: '48', l: 'Tournaments' },
              ].map((s) => (
                <div key={s.l} className="glass-panel p-4 md:p-5">
                  <div className="font-display text-2xl md:text-3xl font-bold text-gradient">{s.v}</div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-20 border-t border-white/5 relative">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-2">Popular <span className="text-gradient">Games</span></h2>
          <p className="text-center text-muted-foreground mb-10">Pick your arena</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {games.map((game) => (
              <TiltCard key={game.name} intensity={10} className="rounded-2xl">
                <Link
                  to={`/tournaments?game=${game.name.toLowerCase().replace(' ', '')}`}
                  className="block glass-panel iridescent-border p-5 text-center group hover:scale-[1.02] transition-transform"
                >
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform drop-shadow-[0_0_12px_hsl(244_92%_72%/0.5)]">
                    {game.icon}
                  </div>
                  <div className="font-semibold text-sm">{game.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{game.players} players</div>
                </Link>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tournaments */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent pointer-events-none" />
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Featured <span className="text-gradient">Tournaments</span></h2>
              <p className="text-muted-foreground mt-2">Join the action — prize pools climbing</p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/tournaments">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingTournaments.map((tournament) => (
              <TiltCard key={tournament.id} intensity={6} className="rounded-2xl">
                <TournamentCard tournament={tournament} />
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-3">Why <span className="text-gradient">GameFlex</span>?</h2>
          <p className="text-center text-muted-foreground mb-12">Built for serious competitors</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <TiltCard key={feature.title} intensity={8} className="rounded-2xl">
                <div className="glass-panel p-6 text-center h-full group">
                  <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <div className="absolute inset-0 rounded-2xl blur-md bg-primary/30 opacity-60 group-hover:opacity-100 transition-opacity" />
                    <feature.icon className="relative h-7 w-7 text-primary-foreground drop-shadow" />
                  </div>
                  <h3 className="font-display font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Top Players */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Top <span className="text-gradient">Players</span></h2>
              <p className="text-muted-foreground mt-2">This week's elite</p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/leaderboard">Full Leaderboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid gap-3">
            {topPlayers.map((player: any, index: number) => (
              <div key={player.id} className="flex items-center gap-4 p-4 glass-panel hover:border-primary/30 transition-colors">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-display font-bold text-lg ${
                  index === 0 ? 'bg-gradient-to-br from-yellow-400/30 to-yellow-600/20 text-yellow-300 shadow-[0_0_20px_hsl(45_100%_60%/0.4)]' :
                  index === 1 ? 'bg-gradient-to-br from-slate-300/30 to-slate-500/20 text-slate-200' :
                  index === 2 ? 'bg-gradient-to-br from-orange-400/30 to-orange-600/20 text-orange-300' :
                  'bg-secondary/50 text-muted-foreground'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{player.profiles?.username ?? 'Unknown'}</div>
                  <div className="text-sm text-muted-foreground">{player.profiles?.game_handle ?? '-'}</div>
                </div>
                <div className="text-right">
                  <div className="font-display font-bold text-gradient">{(player.points ?? 0).toLocaleString()} pts</div>
                  <div className="text-sm text-muted-foreground">{player.wins ?? 0}W - {player.losses ?? 0}L</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="relative max-w-4xl mx-auto text-center p-12 md:p-16 rounded-3xl glass-panel-strong iridescent-border overflow-hidden">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-aurora opacity-40 blur-3xl animate-aurora pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-aurora opacity-30 blur-3xl animate-aurora pointer-events-none" style={{ animationDirection: 'reverse' }} />
            <h2 className="relative font-display text-4xl md:text-5xl font-bold mb-4">
              Ready to <span className="shimmer-text">Compete</span>?
            </h2>
            <p className="relative text-muted-foreground mb-8 text-lg">Join thousands of gamers and start winning today.</p>
            <Button size="xl" variant="gaming" asChild>
              <Link to="/register">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
