import { CompanyDialog } from "./CompanyDialog";
import { CustomerDialog } from "./CustomerDialog";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { DatabaseBackup, Trash2 } from "lucide-react";
import { backupInventory, wipeInventory } from "@/lib/inventory";
import { toast } from "sonner";

export const Header = () => {
  const handleBackupAndWipe = () => {
    backupInventory();
    wipeInventory();
    toast.success("Inventár zálohovaný a vymazaný");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="https://zipscreeny.sk/images/NEVAlogo_blu.png"
              alt="NEVA Logo"
              className="h-8"
            />
            <h1 className="text-xl font-bold text-[#212490]">Skladový Manažér</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="hover:text-[#47acc9]">
                  <DatabaseBackup className="h-4 w-4 mr-2" />
                  Záloha a vymazanie
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Záloha a vymazanie dát</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Button
                    onClick={() => backupInventory()}
                    className="w-full bg-[#212490] hover:bg-[#47acc9]"
                  >
                    <DatabaseBackup className="h-4 w-4 mr-2" />
                    Zálohovať všetky dáta
                  </Button>
                  <Button
                    onClick={handleBackupAndWipe}
                    variant="destructive"
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Zálohovať a vymazať všetky dáta
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <CompanyDialog />
            <CustomerDialog />
          </nav>
        </div>
      </div>
    </header>
  );
};