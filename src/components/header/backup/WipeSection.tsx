import { useState } from "react";
import { Button } from "../../ui/button";
import { Trash2 } from "lucide-react";
import { wipeAll } from "@/lib/services/backupService";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";

export const WipeSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleWipeAll = async () => {
    try {
      await supabase.from('items').update({ deleted: true }).eq('deleted', false);
      await supabase.from('customers').update({ deleted: true }).eq('deleted', false);
      toast.success("Systém bol vymazaný");
      window.location.reload();
    } catch (error) {
      toast.error("Chyba pri vymazávaní dát");
    }
  };

  const handleWipePreservePostponed = async () => {
    try {
      // Get all postponed items to preserve their customers
      const { data: postponedItems } = await supabase
        .from('items')
        .select('customer')
        .eq('postponed', true)
        .eq('deleted', false);

      const customersToPreserve = [...new Set(postponedItems?.map(item => item.customer) || [])];

      // Delete non-postponed items
      await supabase
        .from('items')
        .update({ deleted: true })
        .eq('postponed', false)
        .eq('deleted', false);

      // Delete customers not associated with postponed items
      if (customersToPreserve.length > 0) {
        await supabase
          .from('customers')
          .update({ deleted: true })
          .not('id', 'in', `(${customersToPreserve.join(',')})`)
          .eq('deleted', false);
      } else {
        await supabase
          .from('customers')
          .update({ deleted: true })
          .eq('deleted', false);
      }

      toast.success("Systém bol vymazaný (odložené položky boli zachované)");
      window.location.reload();
    } catch (error) {
      toast.error("Chyba pri vymazávaní dát");
    }
  };

  return (
    <>
      <Button 
        variant="destructive" 
        className="w-full rounded-md"
        onClick={() => setIsDialogOpen(true)}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Vymazať celý systém
      </Button>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Vymazať systém</AlertDialogTitle>
            <AlertDialogDescription>
              Vyberte spôsob vymazania systému:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleWipePreservePostponed}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              Zachovať odložené položky
            </AlertDialogAction>
            <AlertDialogAction
              onClick={handleWipeAll}
              className="bg-red-600 hover:bg-red-700"
            >
              Vymazať všetko
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};