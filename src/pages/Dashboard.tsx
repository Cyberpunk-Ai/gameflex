import { Link } from 'react-router-dom';
import { Wallet, Trophy, TrendingUp, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function Dashboard() {
  const { user, profile, isAuthenticated } = useAuth();
  
  const { data: registrations = [] } = useQuery({
    queryKey: ['user-registrations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('registrations')
        .select('*, tournaments(*)')
        .eq('user_id', user.id);
      return data ?? [];
    },
    enabled: !!user,
  });

  const { data: rewards = [] } = useQuery({
    queryKey: ['user-rewards', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase.from('rewards').select('*').eq('user_id', user.id);
      return data ?? [];
    },
    enabled: !!user,
  });

  const { data: stats } = useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('leaderboard_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Please login</h1>
        <Link to="/auth" className="text-primary hover:underline">Login</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {profile?.username ?? 'User'}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl bg-card border border-border/50 p-6">
          <Wallet className="h-8 w-8 text-primary mb-3" />
          <div className="font-display text-2xl font-bold">KES {(profile?.wallet_balance ?? 0).toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Wallet Balance</div>
        </div>
        <div className="rounded-xl bg-card border border-border/50 p-6">
          <Trophy className="h-8 w-8 text-yellow-500 mb-3" />
          <div className="font-display text-2xl font-bold">{stats?.tournaments_played ?? 0}</div>
          <div className="text-sm text-muted-foreground">Tournaments</div>
        </div>
        <div className="rounded-xl bg-card border border-border/50 p-6">
          <TrendingUp className="h-8 w-8 text-green-500 mb-3" />
          <div className="font-display text-2xl font-bold">{stats?.wins ?? 0}</div>
          <div className="text-sm text-muted-foreground">Wins</div>
        </div>
        <div className="rounded-xl bg-card border border-border/50 p-6">
          <Gamepad2 className="h-8 w-8 text-accent mb-3" />
          <div className="font-display text-2xl font-bold">{stats?.points ?? 0}</div>
          <div className="text-sm text-muted-foreground">Points</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Active Tournaments */}
        <div className="rounded-xl bg-card border border-border/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-lg">My Tournaments</h2>
            <Button variant="ghost" size="sm" asChild><Link to="/tournaments">View All</Link></Button>
          </div>
          {registrations.length > 0 ? (
            <div className="space-y-4">
              {registrations.map((r: any) => r.tournaments && (
                <Link key={r.id} to={`/tournaments/${r.tournaments.id}`} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                  <div>
                    <div className="font-semibold">{r.tournaments.title}</div>
                    <div className="text-sm text-muted-foreground">{r.tournaments.game?.toUpperCase()}</div>
                  </div>
                  <Badge variant={r.tournaments.status === 'live' ? 'destructive' : 'secondary'}>{r.tournaments.status?.replace('_', ' ')}</Badge>
                </Link>
              ))}
            </div>
          ) : <p className="text-muted-foreground text-center py-8">No tournaments yet. <Link to="/tournaments" className="text-primary">Join one!</Link></p>}
        </div>

        {/* Rewards */}
        <div className="rounded-xl bg-card border border-border/50 p-6">
          <h2 className="font-display font-bold text-lg mb-6">Rewards</h2>
          {rewards.length > 0 ? (
            <div className="space-y-4">
              {rewards.map((r: any) => (
                <div key={r.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div>
                    <div className="font-semibold">{r.description}</div>
                    <Badge variant={r.status === 'claimed' ? 'default' : 'secondary'}>{r.status}</Badge>
                  </div>
                  <div className="font-display font-bold text-primary">KES {Number(r.amount).toLocaleString()}</div>
                </div>
              ))}
            </div>
          ) : <p className="text-muted-foreground text-center py-8">No rewards yet</p>}
        </div>
      </div>
    </div>
  );
}
