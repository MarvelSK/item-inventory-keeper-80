import { Button } from "../../ui/button";
import { Trash2 } from "lucide-react";
import { wipeInventory, wipeCompanies, wipeCustomers } from "@/lib/inventory";
import { toast } from "sonner";

export const WipeSection = () => {
  const handleWipe = (type: 'inventory' | 'companies' | 'customers') => {
    switch (type) {
      case 'inventory':
        wipeInventory();
        toast.success("Inventár bol vymazaný");
        break;
      case 'companies':
        wipeCompanies();
        toast.success("Spoločnosti boli vymazané");
        break;
      case 'customers':
        wipeCustomers();
        toast.success("Zákazníci boli vymazaní");
        break;
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