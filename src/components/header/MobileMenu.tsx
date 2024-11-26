import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CustomerDialog } from "../CustomerDialog";
import { BackupDialog } from "./BackupDialog";
import { StatisticsDialog } from "./StatisticsDialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const MobileMenu = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);
  const [isStatisticsDialogOpen, setIsStatisticsDialogOpen] = useState(false);

  const handleMenuItemClick = (dialogSetter: (open: boolean) => void) => {
    setIsOpen(false);
    dialogSetter(true);
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="ml-auto">
            <Menu className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-[90vw] max-w-[250px] bg-white shadow-lg rounded-md border border-gray-200"
          sideOffset={5}
        >
          <DropdownMenuItem 
            className="p-3 focus:bg-transparent hover:bg-slate-50 cursor-pointer"
            onSelect={() => {
              setIsOpen(false);
              navigate('/cenove-ponuky');
            }}
          >
            Cenové Ponuky
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="p-3 focus:bg-transparent hover:bg-slate-50 cursor-pointer"
            onSelect={(e) => {
              e.preventDefault();
              handleMenuItemClick(setIsCustomerDialogOpen);
            }}
          >
            Správa zakázok
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="p-3 focus:bg-transparent hover:bg-slate-50 cursor-pointer"
            onSelect={(e) => {
              e.preventDefault();
              handleMenuItemClick(setIsBackupDialogOpen);
            }}
          >
            Zálohovanie
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="p-3 focus:bg-transparent hover:bg-slate-50 cursor-pointer"
            onSelect={(e) => {
              e.preventDefault();
              handleMenuItemClick(setIsStatisticsDialogOpen);
            }}
          >
            Štatistiky
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CustomerDialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen} />
      <BackupDialog open={isBackupDialogOpen} onOpenChange={setIsBackupDialogOpen} />
      <StatisticsDialog open={isStatisticsDialogOpen} onOpenChange={setIsStatisticsDialogOpen} />
    </>
  );
};