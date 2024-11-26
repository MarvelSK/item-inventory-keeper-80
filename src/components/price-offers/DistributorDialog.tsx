import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DistributorDialogProps {
  region: 'slovakia' | 'hungary' | 'romania';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDistributorAdded?: () => void;
}

export const DistributorDialog = ({ region, open, onOpenChange, onDistributorAdded }: DistributorDialogProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [salesRepEmail, setSalesRepEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('distributors')
        .insert([
          {
            name,
            email,
            phone,
            sales_rep_email: salesRepEmail,
            region,
          }
        ]);

      if (error) throw error;

      toast.success('Dodávateľ bol úspešne pridaný');
      onDistributorAdded?.();
      onOpenChange(false);
      
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setSalesRepEmail('');
    } catch (error) {
      toast.error('Nepodarilo sa pridať dodávateľa');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold mb-4 text-[#212490]">
            Pridať dodávateľa
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Názov</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Názov dodávateľa"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Telefón</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+421 XXX XXX XXX"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Email obchodného zástupcu</label>
            <Input
              type="email"
              value={salesRepEmail}
              onChange={(e) => setSalesRepEmail(e.target.value)}
              placeholder="obchodny.zastupca@example.com"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Zrušiť
            </Button>
            <Button type="submit">
              Pridať
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};