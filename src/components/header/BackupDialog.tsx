import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DatabaseBackup } from "lucide-react";
import { ImportSection } from "./backup/ImportSection";

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
            Import Data
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="w-[95vw] max-w-[800px] rounded-lg">
        <DialogHeader>
          <DialogTitle>Import Data</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium">Import PDF Data</h3>
            <ImportSection />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};