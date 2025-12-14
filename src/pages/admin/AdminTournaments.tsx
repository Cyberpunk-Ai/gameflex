import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockTournaments } from '@/lib/mock-data';
import { Plus, Edit, Trash2 } from 'lucide-react';

const statusLabels: Record<string, string> = { live: 'Live', upcoming: 'Upcoming', registration_open: 'Open', registration_closed: 'Closed', completed: 'Done', cancelled: 'Cancelled' };

export default function AdminTournaments() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Manage Tournaments</h1>
        <Button variant="neon"><Plus className="h-4 w-4 mr-2" />Create Tournament</Button>
      </div>
      <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
        <div className="grid grid-cols-7 gap-4 p-4 bg-secondary/50 text-sm font-semibold text-muted-foreground">
          <div className="col-span-2">Tournament</div>
          <div>Game</div>
          <div>Prize</div>
          <div>Players</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        {mockTournaments.map((t) => (
          <div key={t.id} className="grid grid-cols-7 gap-4 p-4 border-t border-border/50 items-center text-sm">
            <div className="col-span-2 font-semibold truncate">{t.title}</div>
            <div className="uppercase">{t.game}</div>
            <div>KES {t.prizePool.toLocaleString()}</div>
            <div>{t.currentParticipants}/{t.maxParticipants}</div>
            <div><Badge variant={t.status === 'live' ? 'live' : t.status === 'registration_open' ? 'registration' : t.status === 'completed' ? 'completed' : 'upcoming'}>{statusLabels[t.status]}</Badge></div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost"><Edit className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
