import { Button } from "../../ui/button";
import { Save } from "lucide-react";
import { backupAll } from "@/lib/services/backupService";
import { useItems } from "@/hooks/useItems";
import { useCustomers } from "@/hooks/useCustomers";
import { toast } from "sonner";

export const BackupSection = () => {
  const { items } = useItems();
  const { customers } = useCustomers();

  const handleBackup = async () => {
    try {
      await backupAll(items, customers);
      toast.success("Záloha systému bola vytvorená");
    } catch (error) {
      toast.error("Chyba pri vytváraní zálohy");
    }
  };

  return (
    <Button 
      className="w-full bg-[#212490] hover:bg-[#47acc9] rounded-md"
      onClick={handleBackup}
    >
      <Save className="mr-2 h-4 w-4" />
      Zálohovať celý systém
    </Button>
  );
};