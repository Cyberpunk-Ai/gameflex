import { Link } from 'react-router-dom';
import { Wallet, Trophy, Calendar, Settings, TrendingUp, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { mockRegistrations, mockTournaments, mockRewards } from '@/lib/mock-data';

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return <div className="container mx-auto px-4 py-20 text-center"><h1>Please login</h1><Link to="/login" className="text-primary">Login</Link></div>;

  const userRegistrations = mockRegistrations.filter(r => r.userId === user.id);
  const userTournaments = userRegistrations.map(r => mockTournaments.find(t => t.id === r.tournamentId)).filter(Boolean);
  const userRewards = mockRewards.filter(r => r.userId === user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.username}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl bg-card border border-border/50 p-6">
          <Wallet className="h-8 w-8 text-primary mb-3" />
          <div className="font-display text-2xl font-bold">KES {user.walletBalance.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Wallet Balance</div>
        </div>
        <div className="rounded-xl bg-card border border-border/50 p-6">
          <Trophy className="h-8 w-8 text-yellow-500 mb-3" />
          <div className="font-display text-2xl font-bold">{userTournaments.length}</div>
          <div className="text-sm text-muted-foreground">Tournaments</div>
        </div>
        <div className="rounded-xl bg-card border border-border/50 p-6">
          <TrendingUp className="h-8 w-8 text-green-500 mb-3" />
          <div className="font-display text-2xl font-bold">12</div>
          <div className="text-sm text-muted-foreground">Wins</div>
        </div>
        <div className="rounded-xl bg-card border border-border/50 p-6">
          <Gamepad2 className="h-8 w-8 text-accent mb-3" />
          <div className="font-display text-2xl font-bold">#42</div>
          <div className="text-sm text-muted-foreground">Rank</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Active Tournaments */}
        <div className="rounded-xl bg-card border border-border/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-lg">My Tournaments</h2>
            <Button variant="ghost" size="sm" asChild><Link to="/tournaments">View All</Link></Button>
          </div>
          {userTournaments.length > 0 ? (
            <div className="space-y-4">
              {userTournaments.map(t => t && (
                <Link key={t.id} to={`/tournaments/${t.id}`} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                  <div>
                    <div className="font-semibold">{t.title}</div>
                    <div className="text-sm text-muted-foreground">{t.game.toUpperCase()}</div>
                  </div>
                  <Badge variant={t.status === 'live' ? 'live' : t.status === 'registration_open' ? 'registration' : 'upcoming'}>{t.status.replace('_', ' ')}</Badge>
                </Link>
              ))}
            </div>
          ) : <p className="text-muted-foreground text-center py-8">No tournaments yet. <Link to="/tournaments" className="text-primary">Join one!</Link></p>}
        </div>

        {/* Rewards */}
        <div className="rounded-xl bg-card border border-border/50 p-6">
          <h2 className="font-display font-bold text-lg mb-6">Rewards</h2>
          {userRewards.length > 0 ? (
            <div className="space-y-4">
              {userRewards.map(r => (
                <div key={r.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div>
                    <div className="font-semibold">{r.description}</div>
                    <Badge variant={r.status === 'claimed' ? 'completed' : 'pending'}>{r.status}</Badge>
                  </div>
                  <div className="font-display font-bold text-primary">KES {r.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          ) : <p className="text-muted-foreground text-center py-8">No rewards yet</p>}
        </div>
      </div>
    </div>
  );
}
