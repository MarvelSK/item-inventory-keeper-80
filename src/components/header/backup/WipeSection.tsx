import { Button } from "../../ui/button";
import { Trash2 } from "lucide-react";
import { wipeAll } from "@/lib/services/backupService";
import { toast } from "sonner";

export const WipeSection = () => {
  const handleWipe = async () => {
    try {
      await wipeAll();
      toast.success("Systém bol vymazaný");
      window.location.reload();
    } catch (error) {
      toast.error("Chyba pri vymazávaní dát");
    }
  };

  return (
    <Button 
      variant="destructive" 
      className="w-full rounded-md"
      onClick={handleWipe}
    >
      <Trash2 className="mr-2 h-4 w-4" />
      Vymazať celý systém
    </Button>
  );
};