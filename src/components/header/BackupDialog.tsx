import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DatabaseBackup } from "lucide-react";
import { BackupSection } from "./backup/BackupSection";
import { ImportSection } from "./backup/ImportSection";
import { WipeSection } from "./backup/WipeSection";

interface BackupDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const BackupDialog = ({ open, onOpenChange }: BackupDialogProps) => {
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
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Zálohovanie dát</h3>
            <BackupSection />
            
            <h3 className="text-lg font-medium mt-6">Import dát</h3>
            <ImportSection />
            
            <h3 className="text-lg font-medium mt-6">Vymazanie dát</h3>
            <WipeSection />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};