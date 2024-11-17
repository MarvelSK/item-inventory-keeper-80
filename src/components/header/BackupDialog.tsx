import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DatabaseBackup } from "lucide-react";

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
      <DialogContent className="w-[95vw] max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Zálohovanie</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Button className="w-full bg-[#212490] hover:bg-[#47acc9]">
            Zálohovať dáta
          </Button>
          <Button className="w-full bg-[#212490] hover:bg-[#47acc9]">
            Obnoviť dáta
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};