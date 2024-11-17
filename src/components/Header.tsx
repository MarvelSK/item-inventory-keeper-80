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
import { DatabaseBackup } from "lucide-react";
import { MobileMenu } from "./header/MobileMenu";

export const Header = () => {
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
            <h1 className="text-xl font-bold text-[#212490] hidden md:block">
              Skladový Manažér
            </h1>
          </div>
          
          {/* Mobile Menu */}
          <div className="md:hidden">
            <MobileMenu />
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
            <CompanyDialog />
            <CustomerDialog />
          </nav>
        </div>
      </div>
    </header>
  );
};
