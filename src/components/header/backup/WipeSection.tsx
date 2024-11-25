import { Button } from "../../ui/button";
import { Trash2 } from "lucide-react";
import { wipeItems, wipeCompanies, wipeCustomers } from "@/lib/services";
import { toast } from "sonner";

export const WipeSection = () => {
  const handleWipe = async (type: 'inventory' | 'companies' | 'customers') => {
    try {
      switch (type) {
        case 'inventory':
          await wipeItems();
          toast.success("Inventár bol vymazaný");
          break;
        case 'companies':
          await wipeCompanies();
          toast.success("Spoločnosti boli vymazané");
          break;
        case 'customers':
          await wipeCustomers();
          toast.success("Zakázky boli vymazané");
          break;
      }
    } catch (error) {
      toast.error("Chyba pri vymazávaní dát");
    }
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="destructive" 
        className="flex-1 rounded-md"
        onClick={() => handleWipe('inventory')}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Inventár
      </Button>
      <Button 
        variant="destructive" 
        className="flex-1 rounded-md"
        onClick={() => handleWipe('companies')}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Spoločnosti
      </Button>
      <Button 
        variant="destructive" 
        className="flex-1 rounded-md"
        onClick={() => handleWipe('customers')}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Zákazníci
      </Button>
    </div>
  );
};