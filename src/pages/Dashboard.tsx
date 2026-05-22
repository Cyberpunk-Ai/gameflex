import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Trophy, TrendingUp, Gamepad2, Star, ArrowRight, Edit, Phone, Camera, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth-context';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { QuickActions } from '@/components/quick-actions';
import { ReferralCard } from '@/components/referral-card';
import { AchievementsDisplay } from '@/components/achievements-display';
import { ActivityFeed } from '@/components/activity-feed';
import { EditProfileModal } from '@/components/profile/edit-profile-modal';

export default function Dashboard() {
  const { user, profile, isAuthenticated } = useAuth();
  const [showEditProfile, setShowEditProfile] = useState(false);
  
  const { data: registrations = [] } = useQuery({
    queryKey: ['user-registrations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('registrations')
        .select('*, tournaments(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      return data ?? [];
    },
    enabled: !!user,
  });

  const { data: rewards = [] } = useQuery({
    queryKey: ['user-rewards', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase.from('rewards').select('*').eq('user_id', user.id).limit(5);
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

  const { data: achievements = [] } = useQuery({
    queryKey: ['user-achievements', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Get all achievements
      const { data: allAchievements } = await supabase
        .from('achievements')
        .select('*')
        .order('points', { ascending: true });
      
      // Get user's earned achievements
      const { data: userAchievements } = await supabase
        .from('user_achievements')
        .select('achievement_id, earned_at')
        .eq('user_id', user.id);
      
      const earnedMap = new Map(userAchievements?.map(ua => [ua.achievement_id, ua.earned_at]) ?? []);
      
      return (allAchievements ?? []).map(a => ({
        ...a,
        earned: earnedMap.has(a.id),
        earned_at: earnedMap.get(a.id),
      }));
    },
    enabled: !!user,
  });

  const { data: upcomingMatches = [] } = useQuery({
    queryKey: ['user-upcoming-matches', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('matches')
        .select('*, tournaments(title, game)')
        .or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`)
        .in('status', ['scheduled', 'live'])
        .order('scheduled_at', { ascending: true })
        .limit(3);
      return data ?? [];
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

  const earnedAchievements = achievements.filter(a => a.earned);
  const winRate = stats?.wins && stats?.losses 
    ? Math.round((stats.wins / (stats.wins + stats.losses)) * 100) 
    : 0;

  // XP / level model (visual only — derived from points)
  const points = stats?.points ?? 0;
  const level = Math.max(1, Math.floor(points / 1000) + 1);
  const xpInLevel = points % 1000;
  const xpPct = Math.min(100, (xpInLevel / 1000) * 100);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Card Header */}
      <div className="relative mb-8 p-6 md:p-8 glass-panel-strong iridescent-border overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-aurora opacity-30 blur-3xl animate-aurora pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary to-accent opacity-60 blur-md group-hover:opacity-100 transition-opacity" />
            <Avatar className="relative h-20 w-20 border-2 border-white/20">
              <AvatarImage src={profile?.avatar_url ?? undefined} />
              <AvatarFallback className="text-2xl bg-primary/20 font-bold">
                {profile?.username?.charAt(0).toUpperCase() ?? 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-display text-3xl md:text-4xl font-bold">
                {profile?.username ?? 'Gamer'}
              </h1>
              {profile?.is_verified && (
                <Badge variant="secondary" className="bg-green-500/20 text-green-400">Verified</Badge>
              )}
            </div>
            <p className="text-muted-foreground mb-2">
              {(profile as any)?.bio || 'No bio yet - tell others about yourself!'}
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              {profile?.game_handle && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/50">
                  <Gamepad2 className="h-3.5 w-3.5" />
                  {profile.game_handle}
                </span>
              )}
              {profile?.phone && (
                <a 
                  href={`https://wa.me/${profile.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
              )}
            </div>
          </div>
          
          <Button onClick={() => setShowEditProfile(true)} className="shrink-0">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <QuickActions />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { icon: Wallet, label: 'Wallet', value: `KES ${(profile?.wallet_balance ?? 0).toLocaleString()}`, color: 'from-violet-500/30 to-indigo-500/10', ring: 'ring-violet-400/40', glow: 'shadow-[0_0_28px_-6px_hsl(252_95%_70%/0.5)]', iconColor: 'text-violet-300' },
          { icon: Trophy, label: 'Tournaments', value: stats?.tournaments_played ?? 0, color: 'from-amber-400/30 to-yellow-600/10', ring: 'ring-amber-300/40', glow: 'shadow-[0_0_28px_-6px_hsl(45_100%_60%/0.55)]', iconColor: 'text-amber-300' },
          { icon: TrendingUp, label: `${winRate}% Win Rate`, value: `${stats?.wins ?? 0}W · ${stats?.losses ?? 0}L`, color: 'from-emerald-400/30 to-teal-600/10', ring: 'ring-emerald-300/40', glow: 'shadow-[0_0_28px_-6px_hsl(160_84%_55%/0.5)]', iconColor: 'text-emerald-300' },
          { icon: Zap, label: 'Points', value: (stats?.points ?? 0).toLocaleString(), color: 'from-cyan-400/30 to-sky-600/10', ring: 'ring-cyan-300/40', glow: 'shadow-[0_0_28px_-6px_hsl(188_95%_60%/0.55)]', iconColor: 'text-cyan-300' },
          { icon: Star, label: 'Achievements', value: earnedAchievements.length, color: 'from-fuchsia-400/30 to-pink-600/10', ring: 'ring-fuchsia-300/40', glow: 'shadow-[0_0_28px_-6px_hsl(320_95%_65%/0.55)]', iconColor: 'text-fuchsia-300' },
        ].map((s) => (
          <div key={s.label} className={cn('group relative rounded-2xl glass-elite p-4 md:p-5 overflow-hidden ring-1', s.ring, s.glow)}>
            <div className={cn('absolute -top-12 -right-12 h-32 w-32 rounded-full blur-2xl opacity-50 bg-gradient-to-br', s.color)} />
            <s.icon className={cn('relative h-6 w-6 md:h-7 md:w-7 mb-3 drop-shadow-[0_0_12px_currentColor]', s.iconColor)} />
            <div className="relative font-display text-xl md:text-2xl font-bold tracking-tight">{s.value}</div>
            <div className="relative text-[11px] md:text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Energy Core — cinematic centerpiece */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 glass-elite holo-border p-6 md:p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-aurora opacity-10 animate-aurora pointer-events-none" />
          <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel mb-4 text-xs uppercase tracking-widest">
                <Sparkles className="h-3.5 w-3.5 text-accent" /> Progression Core
              </div>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-display text-5xl md:text-6xl font-bold shimmer-text">LVL {level}</span>
                <span className="text-sm text-muted-foreground">{xpInLevel} / 1000 XP</span>
              </div>
              <p className="text-sm text-muted-foreground mb-5 max-w-md">
                Charge your reactor. Win matches, claim achievements, and ascend the ranks of the elite gaming network.
              </p>
              <div className="energy-bar mb-2"><span style={{ width: `${xpPct}%` }} /></div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Current tier · LVL {level}</span>
                <span className="text-primary-glow">Next · LVL {level + 1}</span>
              </div>
            </div>
            <div className="energy-core w-48 h-48 md:w-56 md:h-56 mx-auto">
              <div className="ring" />
              <div className="ring r2" />
              <div className="ring r3" />
              <div className="core-glow" />
              <div className="orbit"><i /></div>
              <div className="orbit o2"><i /></div>
              <div className="orbit o3"><i /></div>
            </div>
          </div>
        </div>

        {/* Tier rarity strip */}
        <div className="glass-elite p-6 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl bg-gradient-to-br from-fuchsia-500/40 to-violet-500/20" />
          <h3 className="relative font-display font-bold text-lg mb-4">Rarity Vault</h3>
          <div className="relative space-y-3">
            {[
              { name: 'Common',    cls: 'border-slate-400/30 text-slate-300' },
              { name: 'Rare',      cls: 'border-cyan-400/40 text-cyan-300 rarity-rare' },
              { name: 'Epic',      cls: 'border-violet-400/40 text-violet-300 rarity-epic' },
              { name: 'Legendary', cls: 'border-amber-400/40 text-amber-300 rarity-legendary' },
              { name: 'Mythic',    cls: 'border-pink-400/40 text-pink-300 rarity-mythic' },
            ].map((r) => (
              <div key={r.name} className={cn('flex items-center justify-between px-3 py-2 rounded-xl border bg-black/20', r.cls)}>
                <span className="text-sm font-semibold tracking-wide">{r.name}</span>
                <span className="text-xs uppercase opacity-70">tier</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Matches Alert */}
      {upcomingMatches.length > 0 && (
        <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <div>
                <h3 className="font-display font-bold">Upcoming Match!</h3>
                <p className="text-sm text-muted-foreground">
                  You have {upcomingMatches.length} match{upcomingMatches.length > 1 ? 'es' : ''} scheduled
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/my-matches">View Matches</Link>
            </Button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Achievements */}
          <div className="rounded-xl bg-card border border-border/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-lg">Achievements</h2>
              <Badge variant="secondary">{earnedAchievements.length}/{achievements.length}</Badge>
            </div>
            <AchievementsDisplay achievements={achievements.slice(0, 5)} />
          </div>

          {/* Active Tournaments */}
          <div className="rounded-xl bg-card border border-border/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-lg">My Tournaments</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/tournaments">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            {registrations.length > 0 ? (
              <div className="space-y-3">
                {registrations.map((r: any) => r.tournaments && (
                  <Link key={r.id} to={`/tournaments/${r.tournaments.id}`} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                    <div>
                      <div className="font-semibold">{r.tournaments.title}</div>
                      <div className="text-sm text-muted-foreground">{r.tournaments.game?.toUpperCase()}</div>
                    </div>
                    <Badge variant={r.tournaments.status === 'live' ? 'destructive' : 'secondary'}>
                      {r.tournaments.status?.replace('_', ' ')}
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Gamepad2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">No tournaments yet</p>
                <Button asChild>
                  <Link to="/tournaments">Browse Tournaments</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Rewards */}
          <div className="rounded-xl bg-card border border-border/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-lg">Recent Rewards</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/rewards">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            {rewards.length > 0 ? (
              <div className="space-y-3">
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
            ) : (
              <p className="text-muted-foreground text-center py-8">No rewards yet. Win tournaments to earn!</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Referral Card */}
          <ReferralCard />

          {/* Activity Feed */}
          <div className="rounded-xl bg-card border border-border/50 p-6">
            <h3 className="font-display font-bold mb-4">Live Activity</h3>
            <ActivityFeed />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal open={showEditProfile} onOpenChange={setShowEditProfile} />
    </div>
  );
}
