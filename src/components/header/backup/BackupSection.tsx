import { Button } from "../../ui/button";
import { Save } from "lucide-react";
import { backupInventory, backupCompanies, backupCustomers } from "@/lib/inventory";
import { toast } from "sonner";

export const BackupSection = () => {
  const handleBackup = (type: 'inventory' | 'companies' | 'customers') => {
    switch (type) {
      case 'inventory':
        backupInventory();
        toast.success("Záloha inventára bola vytvorená");
        break;
      case 'companies':
        backupCompanies();
        toast.success("Záloha spoločností bola vytvorená");
        break;
      case 'customers':
        backupCustomers();
        toast.success("Záloha zákazníkov bola vytvorená");
        break;
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