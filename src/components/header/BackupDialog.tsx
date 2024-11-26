import { Button } from "../ui/button";
import { DatabaseBackup } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../ui/dialog";
import { BackupSection } from "./backup/BackupSection";
import { RestoreSection } from "./backup/RestoreSection";
import { WipeSection } from "./backup/WipeSection";

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const BackupDialog = ({ open, onOpenChange }: DialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="hover:text-[#47acc9] w-full md:w-auto">
          <DatabaseBackup className="mr-2 h-4 w-4" />
          Záloha a obnova
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Záloha a obnova systému</DialogTitle>
          <DialogDescription>
            Vytvorte zálohu systému alebo obnovte systém zo zálohy
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <BackupSection />
          <RestoreSection />
          <WipeSection />
        </div>
      </DialogContent>
    </Dialog>
  );
};