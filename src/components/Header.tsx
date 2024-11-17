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
import { DatabaseBackup } from "lucide-react";
import { backupInventory, wipeInventory, companies, customers } from "@/lib/inventory";
import { toast } from "sonner";

export const Header = () => {
  const handleBackupAndWipeAll = () => {
    backupInventory();
    wipeInventory();
    toast.success("Inventár zálohovaný a vymazaný");
  };

  const handleBackupAndWipeCompanies = () => {
    const csvContent = companies.map(company => 
      `${company.id},${company.name}`
    ).join('\n');
    
    const blob = new Blob([`id,name\n${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `companies_backup_${new Date().toISOString()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);

    companies.length = 0;
    toast.success("Spoločnosti zálohované a vymazané");
  };

  const handleBackupAndWipeCustomers = () => {
    const csvContent = customers.map(customer => 
      `${customer.id},${customer.name},${customer.companyId}`
    ).join('\n');
    
    const blob = new Blob([`id,name,companyId\n${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `customers_backup_${new Date().toISOString()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);

    customers.length = 0;
    toast.success("Zákazníci zálohovaní a vymazaní");
  };

  const handleBackupAndWipeItems = () => {
    backupInventory();
    wipeInventory();
    toast.success("Položky zálohované a vymazané");
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
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Záloha a vymazanie dát</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Button
                    onClick={handleBackupAndWipeAll}
                    variant="destructive"
                    className="w-full"
                  >
                    <DatabaseBackup className="h-4 w-4 mr-2" />
                    Zálohovať a vymazať všetky dáta
                  </Button>
                  <Button
                    onClick={handleBackupAndWipeCompanies}
                    variant="destructive"
                    className="w-full"
                  >
                    <DatabaseBackup className="h-4 w-4 mr-2" />
                    Zálohovať a vymazať spoločnosti
                  </Button>
                  <Button
                    onClick={handleBackupAndWipeCustomers}
                    variant="destructive"
                    className="w-full"
                  >
                    <DatabaseBackup className="h-4 w-4 mr-2" />
                    Zálohovať a vymazať zákazníkov
                  </Button>
                  <Button
                    onClick={handleBackupAndWipeItems}
                    variant="destructive"
                    className="w-full"
                  >
                    <DatabaseBackup className="h-4 w-4 mr-2" />
                    Zálohovať a vymazať položky
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