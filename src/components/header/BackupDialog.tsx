import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DatabaseBackup, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { 
  wipeInventory, 
  wipeCompanies, 
  wipeCustomers, 
  backupInventory,
  backupCompanies,
  backupCustomers,
  backupEverything,
  wipeEverything
} from "@/lib/inventory";

interface BackupDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const BackupDialog = ({ open, onOpenChange }: BackupDialogProps) => {
  const handleBackupInventory = () => {
    backupInventory();
    toast.success("Záloha inventára bola vytvorená");
  };

  const handleBackupCompanies = () => {
    backupCompanies();
    toast.success("Záloha spoločností bola vytvorená");
  };

  const handleBackupCustomers = () => {
    backupCustomers();
    toast.success("Záloha zákazníkov bola vytvorená");
  };

  const handleBackupEverything = () => {
    backupEverything();
    toast.success("Záloha všetkých dát bola vytvorená");
  };

  const handleWipeInventory = () => {
    wipeInventory();
    toast.success("Inventár bol vymazaný");
  };

  const handleWipeCompanies = () => {
    wipeCompanies();
    toast.success("Spoločnosti boli vymazané");
  };

  const handleWipeCustomers = () => {
    wipeCustomers();
    toast.success("Zákazníci boli vymazaní");
  };

  const handleWipeEverything = () => {
    wipeEverything();
    toast.success("Všetky dáta boli vymazané");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!onOpenChange && (
        <DialogTrigger asChild>
          <Button variant="outline" className="hover:text-[#47acc9] w-full md:w-auto">
            <DatabaseBackup className="mr-2 h-4 w-4" />
            Zálohovanie
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="w-[95vw] max-w-[425px] rounded-lg">
        <DialogHeader>
          <DialogTitle>Zálohovanie a správa dát</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Zálohovanie dát</h3>
            <div className="space-y-2">
              <Button 
                className="w-full bg-[#212490] hover:bg-[#47acc9] rounded-md"
                onClick={handleBackupInventory}
              >
                <Save className="mr-2 h-4 w-4" />
                Zálohovať inventár
              </Button>
              <Button 
                className="w-full bg-[#212490] hover:bg-[#47acc9] rounded-md"
                onClick={handleBackupCompanies}
              >
                <Save className="mr-2 h-4 w-4" />
                Zálohovať spoločnosti
              </Button>
              <Button 
                className="w-full bg-[#212490] hover:bg-[#47acc9] rounded-md"
                onClick={handleBackupCustomers}
              >
                <Save className="mr-2 h-4 w-4" />
                Zálohovať zákazníkov
              </Button>
              <Button 
                className="w-full bg-[#212490] hover:bg-[#47acc9] rounded-md"
                onClick={handleBackupEverything}
              >
                <Save className="mr-2 h-4 w-4" />
                Zálohovať všetko
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Vymazanie dát</h3>
            <div className="space-y-2">
              <Button 
                variant="destructive" 
                className="w-full rounded-md"
                onClick={handleWipeInventory}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Vymazať inventár
              </Button>
              <Button 
                variant="destructive" 
                className="w-full rounded-md"
                onClick={handleWipeCompanies}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Vymazať spoločnosti
              </Button>
              <Button 
                variant="destructive" 
                className="w-full rounded-md"
                onClick={handleWipeCustomers}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Vymazať zákazníkov
              </Button>
              <Button 
                variant="destructive" 
                className="w-full rounded-md"
                onClick={handleWipeEverything}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Vymazať všetko
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};