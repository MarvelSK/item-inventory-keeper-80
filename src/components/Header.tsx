import { CustomerDialog } from "./CustomerDialog";
import { StatisticsDialog } from "./header/StatisticsDialog";
import { BackupDialog } from "./header/BackupDialog";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const Header = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <img
              src="https://www.somfy.cz/common/img/library//logo_neva.png"
              alt="NEVA Logo"
              className="h-8 cursor-pointer logo"
              onClick={handleLogoClick}
            />
            <h1 className="text-xl font-bold text-[#212490] dark:text-blue-400 hidden md:block">
              ZÁVOZOVÝ SYSTÉM
            </h1>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <CustomerDialog />
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <StatisticsDialog />
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BackupDialog />
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-2">
            <CustomerDialog />
            <StatisticsDialog />
            <BackupDialog />
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
};