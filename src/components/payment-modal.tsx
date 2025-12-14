import { useState } from 'react';
import { X, Phone, Copy, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Tournament } from '@/types';

interface PaymentModalProps {
  tournament: Tournament;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const MPESA_PAYBILL = '247247';
const MPESA_ACCOUNT = 'GAMEFLEX';

export function PaymentModal({ tournament, isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [step, setStep] = useState<'instructions' | 'verify'>('instructions');
  const [transactionCode, setTransactionCode] = useState('');
  const [gameHandle, setGameHandle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard`,
    });
  };

  const handleSubmit = async () => {
    if (!transactionCode.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter the M-Pesa transaction code',
        variant: 'destructive',
      });
      return;
    }

    if (!gameHandle.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your game handle/username',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'Registration Submitted!',
      description: 'Your payment is being verified. You will be notified once confirmed.',
    });
    
    setIsSubmitting(false);
    onSuccess();
    onClose();
  };

  const handleClose = () => {
    setStep('instructions');
    setTransactionCode('');
    setGameHandle('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">
            {step === 'instructions' ? 'Pay via M-Pesa' : 'Verify Payment'}
          </DialogTitle>
          <DialogDescription>
            {step === 'instructions' 
              ? `Entry fee: KES ${tournament.entryFee.toLocaleString()}`
              : 'Enter your M-Pesa transaction details'}
          </DialogDescription>
        </DialogHeader>

        {step === 'instructions' ? (
          <div className="space-y-6">
            {/* Payment Instructions */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  M-Pesa Paybill Instructions
                </h4>
                <ol className="space-y-2 text-sm">
                  <li>1. Go to M-Pesa on your phone</li>
                  <li>2. Select <strong>Lipa na M-Pesa</strong></li>
                  <li>3. Select <strong>Pay Bill</strong></li>
                  <li>4. Enter Business Number: <strong>{MPESA_PAYBILL}</strong></li>
                  <li>5. Enter Account Number: <strong>{MPESA_ACCOUNT}</strong></li>
                  <li>6. Enter Amount: <strong>KES {tournament.entryFee}</strong></li>
                  <li>7. Enter your M-Pesa PIN and confirm</li>
                </ol>
              </div>

              {/* Quick Copy */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => copyToClipboard(MPESA_PAYBILL, 'Paybill')}
                  className="p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-left"
                >
                  <span className="text-xs text-muted-foreground">Paybill</span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold">{MPESA_PAYBILL}</span>
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
                <button
                  onClick={() => copyToClipboard(MPESA_ACCOUNT, 'Account')}
                  className="p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-left"
                >
                  <span className="text-xs text-muted-foreground">Account</span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold">{MPESA_ACCOUNT}</span>
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-200">
                  After payment, save your M-Pesa confirmation message. You'll need the transaction code to verify.
                </p>
              </div>
            </div>

            <Button onClick={() => setStep('verify')} className="w-full" variant="neon">
              I've Made the Payment
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transactionCode">M-Pesa Transaction Code</Label>
              <Input
                id="transactionCode"
                placeholder="e.g., QWE12345RT"
                value={transactionCode}
                onChange={(e) => setTransactionCode(e.target.value.toUpperCase())}
                className="font-mono uppercase"
              />
              <p className="text-xs text-muted-foreground">
                Find this in your M-Pesa confirmation SMS
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gameHandle">Your Game Handle/Username</Label>
              <Input
                id="gameHandle"
                placeholder="e.g., ProGamer#1234"
                value={gameHandle}
                onChange={(e) => setGameHandle(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                This is how opponents will find you in-game
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('instructions')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1"
                variant="neon"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
