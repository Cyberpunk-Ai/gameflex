import { Trophy, Medal, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { mockLeaderboard } from '@/lib/mock-data';

export default function Leaderboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Leaderboard</h1>
        <p className="text-muted-foreground">Top players ranked by performance</p>
      </div>

      {/* Top 3 */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {mockLeaderboard.slice(0, 3).map((player, index) => (
          <div key={player.userId} className={`rounded-2xl p-6 text-center ${index === 0 ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-900/20 border-yellow-500/30 md:order-2' : index === 1 ? 'bg-gradient-to-br from-gray-400/20 to-gray-700/20 border-gray-500/30 md:order-1' : 'bg-gradient-to-br from-orange-500/20 to-orange-900/20 border-orange-500/30 md:order-3'} border`}>
            <div className="text-4xl mb-4">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</div>
            <Avatar className="h-20 w-20 mx-auto mb-4"><AvatarFallback className="text-2xl bg-primary/20 text-primary">{player.username.slice(0, 2)}</AvatarFallback></Avatar>
            <h3 className="font-display text-xl font-bold">{player.username}</h3>
            <p className="text-muted-foreground text-sm mb-4">{player.gameHandle}</p>
            <div className="font-display text-3xl font-bold text-primary mb-2">{player.points.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Points</p>
            <div className="flex justify-center gap-4 mt-4 text-sm">
              <span className="text-green-400">{player.wins}W</span>
              <span className="text-red-400">{player.losses}L</span>
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
        {mockLeaderboard.map((player) => (
          <div key={player.userId} className="grid grid-cols-12 gap-4 p-4 border-t border-border/50 items-center hover:bg-secondary/30 transition-colors">
            <div className="col-span-1 font-display font-bold">{player.rank}</div>
            <div className="col-span-4 flex items-center gap-3">
              <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary/20 text-primary text-sm">{player.username.slice(0, 2)}</AvatarFallback></Avatar>
              <div>
                <div className="font-semibold">{player.username}</div>
                <div className="text-xs text-muted-foreground">{player.gameHandle}</div>
              </div>
            </div>
            <div className="col-span-2 text-center">
              <span className="text-green-400">{player.wins}</span>
              <span className="text-muted-foreground"> / </span>
              <span className="text-red-400">{player.losses}</span>
            </div>
            <div className="col-span-2 text-center font-display font-bold text-primary">{player.points.toLocaleString()}</div>
            <div className="col-span-3 text-right font-semibold">KES {player.earnings.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
