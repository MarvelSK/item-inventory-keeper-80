import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CompanyDialog } from "../CompanyDialog";
import { CustomerDialog } from "../CustomerDialog";
import { BackupDialog } from "./BackupDialog";
import { useState } from "react";

export const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDialogClick = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-[250px] bg-white z-50"
        sideOffset={5}
      >
        <DropdownMenuItem 
          className="p-0 focus:bg-transparent"
          onSelect={handleDialogClick}
        >
          <CompanyDialog />
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="p-0 focus:bg-transparent"
          onSelect={handleDialogClick}
        >
          <CustomerDialog />
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="p-0 focus:bg-transparent"
          onSelect={handleDialogClick}
        >
          <BackupDialog />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};