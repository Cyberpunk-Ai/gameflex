import { CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';

export default function AdminPayments() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: payments = [] } = useQuery({
    queryKey: ['admin-payments'],
    queryFn: async () => {
      const { data } = await supabase
        .from('payments')
        .select('*, profiles(username), tournaments(title)')
        .order('created_at', { ascending: false });
      return data ?? [];
    }
  });

  const updatePaymentMutation = useMutation({
    mutationFn: async ({ id, status, rejectionReason }: { id: string; status: 'verified' | 'rejected'; rejectionReason?: string }) => {
      const { error } = await supabase
        .from('payments')
        .update({ 
          status, 
          verified_by: user?.id,
          verified_at: new Date().toISOString(),
          rejection_reason: rejectionReason 
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
      toast({ 
        title: variables.status === 'verified' ? 'Payment Verified' : 'Payment Rejected',
        description: `Payment has been ${variables.status}`,
        variant: variables.status === 'rejected' ? 'destructive' : 'default'
      });
    }
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Payment Verification</h1>
      <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
        <div className="grid grid-cols-7 gap-4 p-4 bg-secondary/50 text-sm font-semibold text-muted-foreground">
          <div>Transaction</div>
          <div>User</div>
          <div>Tournament</div>
          <div>Amount</div>
          <div>Status</div>
          <div>Date</div>
          <div>Actions</div>
        </div>
        {payments.map((payment: any) => (
          <div key={payment.id} className="grid grid-cols-7 gap-4 p-4 border-t border-border/50 items-center text-sm">
            <div className="font-mono truncate">{payment.transaction_code ?? '-'}</div>
            <div className="truncate">{payment.profiles?.username ?? '-'}</div>
            <div className="truncate">{payment.tournaments?.title ?? '-'}</div>
            <div className="font-semibold">KES {Number(payment.amount).toLocaleString()}</div>
            <div>
              <Badge variant={
                payment.status === 'verified' ? 'default' : 
                payment.status === 'pending' ? 'secondary' : 
                'destructive'
              }>
                {payment.status}
              </Badge>
            </div>
            <div className="text-muted-foreground">{new Date(payment.created_at).toLocaleDateString()}</div>
            <div className="flex gap-2">
              {payment.status === 'pending' && (
                <>
                  <Button 
                    size="sm" 
                    variant="default" 
                    onClick={() => updatePaymentMutation.mutate({ id: payment.id, status: 'verified' })}
                    disabled={updatePaymentMutation.isPending}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => updatePaymentMutation.mutate({ id: payment.id, status: 'rejected', rejectionReason: 'Invalid transaction' })}
                    disabled={updatePaymentMutation.isPending}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
        {payments.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">No payments found</div>
        )}
      </div>
    </div>
  );
}
