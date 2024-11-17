import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../ui/dialog";
import { DatabaseBackup, Trash2 } from "lucide-react";
import {
  backupInventory,
  wipeInventory,
  wipeCompanies,
  wipeCustomers,
  companies,
  customers,
} from "@/lib/inventory";
import { toast } from "sonner";
import { ScrollArea } from "../ui/scroll-area";

export const BackupDialog = () => {
  const handleBackupAll = () => {
    backupInventory();
    toast.success("Všetky dáta zálohované");
  };

  const handleWipeAll = () => {
    wipeInventory(true);
    wipeCompanies();
    wipeCustomers();
    toast.success("Všetky dáta vymazané");
  };

  const handleBackupCompanies = () => {
    const csvContent = companies
      .filter(company => !company.deleted)
      .map(company => `${company.id},${company.name}`)
      .join('\n');
    
    const blob = new Blob([`id,name\n${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `companies_backup_${new Date().toISOString()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success("Spoločnosti zálohované");
  };

  const handleWipeCompanies = () => {
    wipeCompanies();
    toast.success("Spoločnosti vymazané");
  };

  const handleBackupCustomers = () => {
    const csvContent = customers
      .filter(customer => !customer.deleted)
      .map(customer => `${customer.id},${customer.name},${customer.companyId}`)
      .join('\n');
    
    const blob = new Blob([`id,name,companyId\n${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `customers_backup_${new Date().toISOString()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success("Zákazníci zálohovaní");
  };

  const handleWipeCustomers = () => {
    wipeCustomers();
    toast.success("Zákazníci vymazaní");
  };

  const handleBackupItems = () => {
    backupInventory();
    toast.success("Položky zálohované");
  };

  const handleWipeItems = () => {
    wipeInventory();
    toast.success("Položky vymazané");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <DatabaseBackup className="h-4 w-4 mr-2" />
          Záloha a vymazanie
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-md">
        <DialogHeader>
          <DialogTitle>Záloha a vymazanie dát</DialogTitle>
          <DialogDescription>
            Zálohujte alebo vymažte dáta z aplikácie
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] md:h-auto">
          <div className="space-y-4 p-1">
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleBackupAll}
                variant="outline"
                className="w-full"
              >
                <DatabaseBackup className="h-4 w-4 mr-2" />
                Zálohovať všetko
              </Button>
              <Button
                onClick={handleWipeAll}
                variant="destructive"
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Vymazať všetko
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleBackupCompanies}
                variant="outline"
                className="flex-1"
              >
                <DatabaseBackup className="h-4 w-4 mr-2" />
                Zálohovať spoločnosti
              </Button>
              <Button
                onClick={handleWipeCompanies}
                variant="destructive"
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Vymazať spoločnosti
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleBackupCustomers}
                variant="outline"
                className="flex-1"
              >
                <DatabaseBackup className="h-4 w-4 mr-2" />
                Zálohovať zákazníkov
              </Button>
              <Button
                onClick={handleWipeCustomers}
                variant="destructive"
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Vymazať zákazníkov
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleBackupItems}
                variant="outline"
                className="flex-1"
              >
                <DatabaseBackup className="h-4 w-4 mr-2" />
                Zálohovať položky
              </Button>
              <Button
                onClick={handleWipeItems}
                variant="destructive"
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Vymazať položky
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};