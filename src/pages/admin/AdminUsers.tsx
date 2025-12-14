import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { mockAllUsers } from '@/lib/mock-data';

export default function AdminUsers() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">User Management</h1>
      <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
        <div className="grid grid-cols-6 gap-4 p-4 bg-secondary/50 text-sm font-semibold text-muted-foreground">
          <div className="col-span-2">User</div>
          <div>Phone</div>
          <div>Balance</div>
          <div>Status</div>
          <div>Joined</div>
        </div>
        {mockAllUsers.map((user) => (
          <div key={user.id} className="grid grid-cols-6 gap-4 p-4 border-t border-border/50 items-center text-sm">
            <div className="col-span-2 flex items-center gap-3">
              <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary/20 text-primary">{user.username.slice(0, 2)}</AvatarFallback></Avatar>
              <div>
                <div className="font-semibold">{user.username}</div>
                <div className="text-xs text-muted-foreground">{user.gameHandle}</div>
              </div>
            </div>
            <div>{user.phone}</div>
            <div className="font-semibold">KES {user.walletBalance.toLocaleString()}</div>
            <div><Badge variant={user.isVerified ? 'completed' : 'pending'}>{user.isVerified ? 'Verified' : 'Pending'}</Badge></div>
            <div className="text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
