import { useState } from "react";
import { Button } from "../../ui/button";
import { Trash2 } from "lucide-react";
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
      // First, mark all non-postponed items as deleted
      await supabase
        .from('items')
        .update({ deleted: true })
        .eq('postponed', false)
        .eq('deleted', false);

      // Get all customers that have postponed items
      const { data: customersWithPostponedItems } = await supabase
        .from('items')
        .select('customer')
        .eq('postponed', true)
        .eq('deleted', false);

      // Extract unique customer IDs
      const customersToPreserve = [...new Set(customersWithPostponedItems?.map(item => item.customer) || [])];

      // Mark all other customers as deleted
      if (customersToPreserve.length > 0) {
        await supabase
          .from('customers')
          .update({ deleted: true })
          .not('id', 'in', `(${customersToPreserve.join(',')})`)
          .eq('deleted', false);
      } else {
        // If no customers to preserve, mark all as deleted
        await supabase
          .from('customers')
          .update({ deleted: true })
          .eq('deleted', false);
      }

      toast.success("Systém bol vymazaný (odložené položky boli zachované)");
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
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