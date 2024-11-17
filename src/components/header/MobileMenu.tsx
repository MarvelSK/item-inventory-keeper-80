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

export const MobileMenu = () => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-[250px] bg-white"
        sideOffset={5}
      >
        <DropdownMenuItem className="p-0">
          <CompanyDialog />
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0">
          <CustomerDialog />
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0">
          <BackupDialog />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};