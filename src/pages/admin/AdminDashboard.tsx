import { Users, Trophy, DollarSign, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [
        { count: totalUsers },
        { count: activeTournaments },
        { data: pendingPaymentsData },
        { data: revenueData }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('tournaments').select('*', { count: 'exact', head: true }).in('status', ['live', 'registration_open', 'upcoming']),
        supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('payments').select('amount').eq('status', 'verified')
      ]);
      
      const totalRevenue = revenueData?.reduce((sum, p) => sum + Number(p.amount), 0) ?? 0;
      
      return {
        totalUsers: totalUsers ?? 0,
        activeTournaments: activeTournaments ?? 0,
        pendingPayments: pendingPaymentsData?.length ?? 0,
        totalRevenue
      };
    }
  });

  const { data: pendingPayments = [] } = useQuery({
    queryKey: ['pending-payments'],
    queryFn: async () => {
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (!paymentsData || paymentsData.length === 0) return [];
      
      const userIds = [...new Set(paymentsData.map(p => p.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, username')
        .in('user_id', userIds);
      
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) ?? []);
      
      return paymentsData.map(p => ({
        ...p,
        profile: profileMap.get(p.user_id)
      }));
    }
  });

  const { data: liveTournaments = [] } = useQuery({
    queryKey: ['live-tournaments'],
    queryFn: async () => {
      const { data } = await supabase
        .from('tournaments')
        .select('*')
        .eq('status', 'live');
      return data ?? [];
    }
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 p-6">
          <Users className="h-8 w-8 text-primary mb-2" />
          <div className="font-display text-3xl font-bold">{(stats?.totalUsers ?? 0).toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Total Users</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30 p-6">
          <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
          <div className="font-display text-3xl font-bold">{stats?.activeTournaments ?? 0}</div>
          <div className="text-sm text-muted-foreground">Active Tournaments</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 p-6">
          <DollarSign className="h-8 w-8 text-green-500 mb-2" />
          <div className="font-display text-3xl font-bold">KES {((stats?.totalRevenue ?? 0) / 1000).toFixed(0)}K</div>
          <div className="text-sm text-muted-foreground">Total Revenue</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/30 p-6">
          <Clock className="h-8 w-8 text-orange-500 mb-2" />
          <div className="font-display text-3xl font-bold">{stats?.pendingPayments ?? 0}</div>
          <div className="text-sm text-muted-foreground">Pending Payments</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Payments */}
        <div className="rounded-xl bg-card border border-border/50 p-6">
          <h2 className="font-display font-bold mb-4">Pending Payments</h2>
          <div className="space-y-3">
            {pendingPayments.length > 0 ? pendingPayments.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div>
                  <div className="font-mono text-sm">{p.transaction_code ?? 'N/A'}</div>
                  <div className="text-xs text-muted-foreground">KES {Number(p.amount).toLocaleString()}</div>
                </div>
                <span className="text-xs text-muted-foreground">{p.profile?.username}</span>
              </div>
            )) : <p className="text-muted-foreground text-center py-4">No pending payments</p>}
          </div>
        </div>

        {/* Live Tournaments */}
        <div className="rounded-xl bg-card border border-border/50 p-6">
          <h2 className="font-display font-bold mb-4">Live Tournaments</h2>
          {liveTournaments.length > 0 ? (
            <div className="space-y-3">
              {liveTournaments.map((t: any) => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <div className="font-semibold">{t.title}</div>
                    <div className="text-xs text-muted-foreground">{t.current_participants} players</div>
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
