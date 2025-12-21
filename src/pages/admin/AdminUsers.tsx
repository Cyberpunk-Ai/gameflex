import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Search } from 'lucide-react';

export default function AdminUsers() {
  const [search, setSearch] = useState('');

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      return data ?? [];
    }
  });

  const filteredUsers = users.filter((user: any) => 
    user.username?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.phone?.includes(search)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">User Management</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
        <div className="grid grid-cols-6 gap-4 p-4 bg-secondary/50 text-sm font-semibold text-muted-foreground">
          <div className="col-span-2">User</div>
          <div>Email</div>
          <div>Balance</div>
          <div>Status</div>
          <div>Joined</div>
        </div>
        {filteredUsers.map((user: any) => (
          <div key={user.id} className="grid grid-cols-6 gap-4 p-4 border-t border-border/50 items-center text-sm">
            <div className="col-span-2 flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback className="bg-primary/20 text-primary">{(user.username ?? 'U').slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{user.username}</div>
                <div className="text-xs text-muted-foreground">{user.game_handle ?? '-'}</div>
              </div>
            </div>
            <div className="truncate">{user.email ?? '-'}</div>
            <div className="font-semibold">KES {Number(user.wallet_balance ?? 0).toLocaleString()}</div>
            <div><Badge variant={user.is_verified ? 'default' : 'secondary'}>{user.is_verified ? 'Verified' : 'Pending'}</Badge></div>
            <div className="text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</div>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">No users found</div>
        )}
      </div>
    </div>
  );
}
