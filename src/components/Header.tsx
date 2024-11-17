import { Boxes } from "lucide-react";
import { CompanyDialog } from "./CompanyDialog";
import { CustomerDialog } from "./CustomerDialog";

export const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/neva-logo.png" alt="NEVA Logo" className="h-8" />
            <h1 className="text-xl font-bold text-[#212490]">Skladový Manažér</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <CompanyDialog />
            <CustomerDialog />
          </nav>
        </div>
      </div>
    </header>
  );
};