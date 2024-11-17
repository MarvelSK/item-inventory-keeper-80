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
import {
  backupInventory,
  wipeInventory,
  wipeCompanies,
  wipeCustomers,
  companies,
  customers,
} from "@/lib/inventory";
import { toast } from "sonner";

export const Header = () => {
  const handleBackupAll = () => {
    backupInventory();
    toast.success("Všetky dáta zálohované");
  };

  const handleWipeAll = () => {
    wipeInventory();
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
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="https://www.somfy.cz/common/img/library//logo_neva.png"
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
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Záloha a vymazanie dát</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleBackupAll}
                      variant="outline"
                      className="flex-1"
                    >
                      <DatabaseBackup className="h-4 w-4 mr-2" />
                      Zálohovať všetko
                    </Button>
                    <Button
                      onClick={handleWipeAll}
                      variant="destructive"
                      className="flex-1"
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