import { Item } from "@/lib/types";
import { Button } from "../ui/button";
import { TableCell, TableRow } from "../ui/table";
import { Edit2, Trash2 } from "lucide-react";
import { companies, customers } from "@/lib/inventory";
import { format } from "date-fns";

interface InventoryListItemProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

export const InventoryListItem = ({ item, onEdit, onDelete }: InventoryListItemProps) => {
  const company = companies.find((c) => c.id === item.company)?.name || "Unknown";
  const customer = customers.find((c) => c.id === item.customer)?.name || "Unknown";

  return (
    <TableRow>
      <TableCell>{item.code}</TableCell>
      <TableCell>{item.quantity}</TableCell>
      <TableCell>{company}</TableCell>
      <TableCell>{customer}</TableCell>
      <TableCell>{format(item.createdAt, "dd.MM.yyyy HH:mm")}</TableCell>
      <TableCell>{format(item.updatedAt, "dd.MM.yyyy HH:mm")}</TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-[#47acc9]"
            onClick={() => onEdit(item)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-[#47acc9]"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};