import { Trophy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

export default function Leaderboard() {
  const { data: leaderboard = [], isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data: statsData } = await supabase
        .from('leaderboard_stats')
        .select('*')
        .order('points', { ascending: false })
        .limit(50);
      
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">Top players ranked by performance</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Leaderboard</h1>
        <p className="text-muted-foreground">Top players ranked by performance</p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center py-16">
          <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display text-xl font-bold mb-2">No rankings yet</h3>
          <p className="text-muted-foreground">Join tournaments to appear on the leaderboard</p>
        </div>
      ) : (
        <>
          {/* Top 3 */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {leaderboard.slice(0, 3).map((player: any, index: number) => (
              <div key={player.id} className={`rounded-2xl p-6 text-center ${index === 0 ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-900/20 border-yellow-500/30 md:order-2' : index === 1 ? 'bg-gradient-to-br from-gray-400/20 to-gray-700/20 border-gray-500/30 md:order-1' : 'bg-gradient-to-br from-orange-500/20 to-orange-900/20 border-orange-500/30 md:order-3'} border`}>
                <div className="text-4xl mb-4">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</div>
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarImage src={player.profiles?.avatar_url} />
                  <AvatarFallback className="text-2xl bg-primary/20 text-primary">{(player.profiles?.username ?? 'U').slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h3 className="font-display text-xl font-bold">{player.profiles?.username ?? 'Unknown'}</h3>
                <p className="text-muted-foreground text-sm mb-4">{player.profiles?.game_handle ?? '-'}</p>
                <div className="font-display text-3xl font-bold text-primary mb-2">{(player.points ?? 0).toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Points</p>
                <div className="flex justify-center gap-4 mt-4 text-sm">
                  <span className="text-green-400">{player.wins ?? 0}W</span>
                  <span className="text-red-400">{player.losses ?? 0}L</span>
                </div>
              </div>
            ))}
          </div>

          {/* Full Rankings */}
          <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 bg-secondary/50 text-sm font-semibold text-muted-foreground">
              <div className="col-span-1">Rank</div>
              <div className="col-span-4">Player</div>
              <div className="col-span-2 text-center">W/L</div>
              <div className="col-span-2 text-center">Points</div>
              <div className="col-span-3 text-right">Earnings</div>
            </div>
            {leaderboard.map((player: any, index: number) => (
              <div key={player.id} className="grid grid-cols-12 gap-4 p-4 border-t border-border/50 items-center hover:bg-secondary/30 transition-colors">
                <div className="col-span-1 font-display font-bold">{index + 1}</div>
                <div className="col-span-4 flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={player.profiles?.avatar_url} />
                    <AvatarFallback className="bg-primary/20 text-primary text-sm">{(player.profiles?.username ?? 'U').slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{player.profiles?.username ?? 'Unknown'}</div>
                    <div className="text-xs text-muted-foreground">{player.profiles?.game_handle ?? '-'}</div>
                  </div>
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-green-400">{player.wins ?? 0}</span>
                  <span className="text-muted-foreground"> / </span>
                  <span className="text-red-400">{player.losses ?? 0}</span>
                </div>
                <div className="col-span-2 text-center font-display font-bold text-primary">{(player.points ?? 0).toLocaleString()}</div>
                <div className="col-span-3 text-right font-semibold">KES {Number(player.earnings ?? 0).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
