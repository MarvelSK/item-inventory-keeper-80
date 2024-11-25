import { Button } from "../../ui/button";
import { Save } from "lucide-react";
import { backupInventory, backupCompanies, backupCustomers } from "@/lib/services";
import { useItems } from "@/hooks/useItems";
import { useCompanies } from "@/hooks/useCompanies";
import { useCustomers } from "@/hooks/useCustomers";
import { toast } from "sonner";

export const BackupSection = () => {
  const { items } = useItems();
  const { companies } = useCompanies();
  const { customers } = useCustomers();

  const handleBackup = async (type: 'inventory' | 'companies' | 'customers') => {
    try {
      switch (type) {
        case 'inventory':
          await backupInventory(items);
          toast.success("Záloha inventára bola vytvorená");
          break;
        case 'companies':
          await backupCompanies(companies);
          toast.success("Záloha spoločností bola vytvorená");
          break;
        case 'customers':
          await backupCustomers(customers);
          toast.success("Záloha zákazníkov bola vytvorená");
          break;
      }
    } catch (error) {
      toast.error("Chyba pri vytváraní zálohy");
    }
  };

  return (
    <div className="flex gap-2">
      <Button 
        className="flex-1 bg-[#212490] hover:bg-[#47acc9] rounded-md"
        onClick={() => handleBackup('inventory')}
      >
        <Save className="mr-2 h-4 w-4" />
        Inventár
      </Button>
      <Button 
        className="flex-1 bg-[#212490] hover:bg-[#47acc9] rounded-md"
        onClick={() => handleBackup('companies')}
      >
        <Save className="mr-2 h-4 w-4" />
        Spoločnosti
      </Button>
      <Button 
        className="flex-1 bg-[#212490] hover:bg-[#47acc9] rounded-md"
        onClick={() => handleBackup('customers')}
      >
        <Save className="mr-2 h-4 w-4" />
        Zákazníci
      </Button>
    </div>
  );
};