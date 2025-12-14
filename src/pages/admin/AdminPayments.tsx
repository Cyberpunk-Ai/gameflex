import { CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockPayments, mockTournaments } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

export default function AdminPayments() {
  const { toast } = useToast();

  const handleVerify = (id: string) => {
    toast({ title: 'Payment Verified', description: `Payment ${id} has been verified` });
  };

  const handleReject = (id: string) => {
    toast({ title: 'Payment Rejected', description: `Payment ${id} has been rejected`, variant: 'destructive' });
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Payment Verification</h1>
      <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
        <div className="grid grid-cols-6 gap-4 p-4 bg-secondary/50 text-sm font-semibold text-muted-foreground">
          <div>Transaction</div>
          <div>Tournament</div>
          <div>Amount</div>
          <div>Status</div>
          <div>Date</div>
          <div>Actions</div>
        </div>
        {mockPayments.map((payment) => {
          const tournament = mockTournaments.find(t => t.id === payment.tournamentId);
          return (
            <div key={payment.id} className="grid grid-cols-6 gap-4 p-4 border-t border-border/50 items-center text-sm">
              <div className="font-mono">{payment.transactionCode}</div>
              <div className="truncate">{tournament?.title || 'N/A'}</div>
              <div className="font-semibold">KES {payment.amount}</div>
              <div><Badge variant={payment.status === 'verified' ? 'completed' : payment.status === 'pending' ? 'pending' : 'destructive'}>{payment.status}</Badge></div>
              <div className="text-muted-foreground">{new Date(payment.createdAt).toLocaleDateString()}</div>
              <div className="flex gap-2">
                {payment.status === 'pending' && (
                  <>
                    <Button size="sm" variant="default" onClick={() => handleVerify(payment.id)}><CheckCircle className="h-4 w-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => handleReject(payment.id)}><XCircle className="h-4 w-4" /></Button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
