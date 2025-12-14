import { Users, Trophy, DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { mockDashboardStats, mockPayments, mockTournaments } from '@/lib/mock-data';

export default function AdminDashboard() {
  const stats = mockDashboardStats;
  const pendingPayments = mockPayments.filter(p => p.status === 'pending').slice(0, 5);
  const liveTournaments = mockTournaments.filter(t => t.status === 'live');

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 p-6">
          <Users className="h-8 w-8 text-primary mb-2" />
          <div className="font-display text-3xl font-bold">{stats.totalUsers.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Total Users</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30 p-6">
          <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
          <div className="font-display text-3xl font-bold">{stats.activeTournaments}</div>
          <div className="text-sm text-muted-foreground">Active Tournaments</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 p-6">
          <DollarSign className="h-8 w-8 text-green-500 mb-2" />
          <div className="font-display text-3xl font-bold">KES {(stats.totalRevenue / 1000).toFixed(0)}K</div>
          <div className="text-sm text-muted-foreground">Total Revenue</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/30 p-6">
          <Clock className="h-8 w-8 text-orange-500 mb-2" />
          <div className="font-display text-3xl font-bold">{stats.pendingPayments}</div>
          <div className="text-sm text-muted-foreground">Pending Payments</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Payments */}
        <div className="rounded-xl bg-card border border-border/50 p-6">
          <h2 className="font-display font-bold mb-4">Pending Payments</h2>
          <div className="space-y-3">
            {pendingPayments.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div>
                  <div className="font-mono text-sm">{p.transactionCode}</div>
                  <div className="text-xs text-muted-foreground">KES {p.amount}</div>
                </div>
                <button className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full hover:bg-primary/80">Verify</button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Tournaments */}
        <div className="rounded-xl bg-card border border-border/50 p-6">
          <h2 className="font-display font-bold mb-4">Live Tournaments</h2>
          {liveTournaments.length > 0 ? (
            <div className="space-y-3">
              {liveTournaments.map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <div className="font-semibold">{t.title}</div>
                    <div className="text-xs text-muted-foreground">{t.currentParticipants} players</div>
                  </div>
                  <span className="flex items-center gap-1 text-red-400 text-xs"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />LIVE</span>
                </div>
              ))}
            </div>
          ) : <p className="text-muted-foreground text-center py-8">No live tournaments</p>}
        </div>
      </div>
    </div>
  );
}
