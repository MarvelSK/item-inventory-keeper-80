import { CompanyDialog } from "./CompanyDialog";
import { CustomerDialog } from "./CustomerDialog";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "./ui/dialog";
import { DatabaseBackup, Trash2, Menu } from "lucide-react";
import {
  backupInventory,
  wipeInventory,
  wipeCompanies,
  wipeCustomers,
  companies,
  customers,
} from "@/lib/inventory";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ScrollArea } from "./ui/scroll-area";

export const Header = () => {
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
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <img
              src="https://www.somfy.cz/common/img/library//logo_neva.png"
              alt="NEVA Logo"
              className="h-8"
            />
            <h1 className="text-xl font-bold text-[#212490] hidden md:block">Skladový Manažér</h1>
          </div>
          
          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem>
                  <CompanyDialog />
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CustomerDialog />
                </DropdownMenuItem>
                <DropdownMenuItem>
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
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-4">
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
                  <DialogDescription>
                    Zálohujte alebo vymažte dáta z aplikácie
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
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
