import { MoreVertical } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Item } from "@/lib/types";

interface ItemActionsDropdownProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
  onPostpone: (item: Item) => void;
}

export const ItemActionsDropdown = ({
  item,
  onEdit,
  onDelete,
  onPostpone,
}: ItemActionsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-muted dark:hover:bg-muted/20"
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-border">
        <DropdownMenuItem 
          onClick={() => onEdit(item)}
          className="cursor-pointer hover:bg-muted dark:hover:bg-muted/20"
        >
          Upraviť
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onPostpone(item)}
          className="cursor-pointer hover:bg-muted dark:hover:bg-muted/20"
        >
          {item.postponed ? 'Zrušiť odloženie' : 'Označiť ako odložené'}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onDelete(item.id)}
          className="cursor-pointer text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20"
        >
          Vymazať
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};