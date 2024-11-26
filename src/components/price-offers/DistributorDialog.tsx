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
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Distributor {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  sales_rep_email: string | null;
}

interface DistributorDialogProps {
  region: 'slovakia' | 'hungary' | 'romania';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DistributorDialog = ({ region, open, onOpenChange }: DistributorDialogProps) => {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [isAddMode, setIsAddMode] = useState(false);
  const [editingDistributor, setEditingDistributor] = useState<Distributor | null>(null);
  const [deletingDistributor, setDeletingDistributor] = useState<Distributor | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [salesRepEmail, setSalesRepEmail] = useState('');

  const fetchDistributors = async () => {
    const { data } = await supabase
      .from('distributors')
      .select('*')
      .eq('region', region)
      .eq('deleted', false)
      .order('name');
    
    if (data) setDistributors(data);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setSalesRepEmail('');
    setIsAddMode(false);
    setEditingDistributor(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingDistributor) {
        const { error } = await supabase
          .from('distributors')
          .update({
            name,
            email,
            phone,
            sales_rep_email: salesRepEmail,
          })
          .eq('id', editingDistributor.id);

        if (error) throw error;
        toast.success('Dodávateľ bol úspešne upravený');
      } else {
        const { error } = await supabase
          .from('distributors')
          .insert([{
            name,
            email,
            phone,
            sales_rep_email: salesRepEmail,
            region,
          }]);

        if (error) throw error;
        toast.success('Dodávateľ bol úspešne pridaný');
      }
      
      resetForm();
      fetchDistributors();
    } catch (error) {
      toast.error('Nepodarilo sa uložiť dodávateľa');
    }
  };

  const handleEdit = (distributor: Distributor) => {
    setEditingDistributor(distributor);
    setName(distributor.name);
    setEmail(distributor.email || '');
    setPhone(distributor.phone || '');
    setSalesRepEmail(distributor.sales_rep_email || '');
  };

  const handleDelete = async () => {
    if (!deletingDistributor) return;
    
    try {
      const { error } = await supabase
        .from('distributors')
        .update({ deleted: true })
        .eq('id', deletingDistributor.id);

      if (error) throw error;
      toast.success('Dodávateľ bol úspešne odstránený');
      setDeletingDistributor(null);
      fetchDistributors();
    } catch (error) {
      toast.error('Nepodarilo sa odstrániť dodávateľa');
    }
  };

  // Fetch distributors when dialog opens
  useState(() => {
    if (open) fetchDistributors();
  }, [open, region]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mb-4 text-[#212490]">
              Dodávatelia
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {!isAddMode && !editingDistributor && (
              <div className="flex justify-end">
                <Button onClick={() => setIsAddMode(true)}>
                  Pridať dodávateľa
                </Button>
              </div>
            )}

            {(isAddMode || editingDistributor) && (
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
                  <label className="text-sm font-medium mb-1 block">Kontaktné údaje</label>
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

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                  >
                    Zrušiť
                  </Button>
                  <Button type="submit">
                    {editingDistributor ? 'Uložiť' : 'Pridať'}
                  </Button>
                </div>
              </form>
            )}

            {!isAddMode && !editingDistributor && (
              <div className="border rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Názov</th>
                      <th className="text-left p-3">Email</th>
                      <th className="text-left p-3">Kontaktné údaje</th>
                      <th className="text-left p-3">Obchodný zástupca</th>
                      <th className="text-right p-3">Akcie</th>
                    </tr>
                  </thead>
                  <tbody>
                    {distributors.map((distributor) => (
                      <tr key={distributor.id} className="border-b">
                        <td className="p-3">{distributor.name}</td>
                        <td className="p-3">{distributor.email || '-'}</td>
                        <td className="p-3">{distributor.phone || '-'}</td>
                        <td className="p-3">{distributor.sales_rep_email || '-'}</td>
                        <td className="p-3 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(distributor)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeletingDistributor(distributor)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {!distributors.length && (
                      <tr>
                        <td colSpan={5} className="text-center p-3 text-muted-foreground">
                          Žiadni dodávatelia
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingDistributor}
        onOpenChange={(open) => !open && setDeletingDistributor(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Odstrániť dodávateľa?</AlertDialogTitle>
            <AlertDialogDescription>
              Táto akcia sa nedá vrátiť späť. Dodávateľ bude natrvalo odstránený.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Odstrániť
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};