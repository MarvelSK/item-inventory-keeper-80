import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DatabaseBackup } from "lucide-react";
import { backupAll } from "@/lib/services/backupService";
import { importAll } from "@/lib/services/backupService";
import { wipeAll } from "@/lib/services/backupService";
import { toast } from "sonner";
import { Upload, Save, Trash2 } from "lucide-react";

interface BackupDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const BackupDialog = ({ open, onOpenChange }: BackupDialogProps) => {
  const handleBackup = async () => {
    try {
      await backupAll();
      toast.success("Záloha bola úspešne vytvorená");
    } catch (error) {
      toast.error("Chyba pri vytváraní zálohy");
    }
  };

  const handleImport = async (file: File) => {
    try {
      await importAll(file);
      toast.success("Dáta boli úspešne importované");
      window.location.reload();
    } catch (error) {
      toast.error(`Chyba pri importovaní: ${error}`);
    }
  };

  const handleWipe = async () => {
    if (confirm("Naozaj chcete vymazať všetky dáta? Táto akcia sa nedá vrátiť späť.")) {
      try {
        await wipeAll();
        toast.success("Všetky dáta boli vymazané");
        window.location.reload();
      } catch (error) {
        toast.error("Chyba pri vymazávaní dát");
      }
    }
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
      <DialogContent className="w-[95vw] max-w-[800px] rounded-lg">
        <DialogHeader>
          <DialogTitle>Zálohovanie a správa dát</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <Button 
              className="bg-[#212490] hover:bg-[#47acc9] rounded-md"
              onClick={handleBackup}
            >
              <Save className="mr-2 h-4 w-4" />
              Zálohovať všetky dáta
            </Button>

            <Button
              variant="outline"
              className="hover:text-[#47acc9]"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.csv';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) handleImport(file);
                };
                input.click();
              }}
            >
              <Upload className="mr-2 h-4 w-4" />
              Importovať všetky dáta
            </Button>

            <Button 
              variant="destructive" 
              className="rounded-md"
              onClick={handleWipe}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Vymazať všetky dáta
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};