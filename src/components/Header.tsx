import { CustomerDialog } from "./CustomerDialog";
import { DatabaseBackup } from "lucide-react";
import { MobileMenu } from "./header/MobileMenu";
import { BackupDialog } from "./header/BackupDialog";
import { StatisticsDialog } from "./header/StatisticsDialog";

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
              ZÁVOZOVÝ SYSTÉM
            </h1>
          </div>
          
          {/* Mobile Menu */}
          <div className="md:hidden">
            <MobileMenu />
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-4">
            <CustomerDialog />
            <BackupDialog />
            <StatisticsDialog />
          </nav>
        </div>
      </div>
    </header>
  );
};