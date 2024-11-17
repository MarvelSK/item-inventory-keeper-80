import { Table, TableHeader, TableRow, TableHead, TableBody } from "../ui/table";
import { Item } from "@/lib/types";
import { ArrowUp, ArrowDown } from "lucide-react";
import { InventoryListItem } from "./InventoryListItem";

interface InventoryTableProps {
  items: Item[];
  sortField: keyof Item;
  sortDirection: "asc" | "desc";
  toggleSort: (field: keyof Item) => void;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

export const InventoryTable = ({
  items,
  sortField,
  sortDirection,
  toggleSort,
  onEdit,
  onDelete,
}: InventoryTableProps) => {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer hover:text-[#47acc9]"
              onClick={() => toggleSort("code")}
            >
              Kód
              {sortField === "code" &&
                (sortDirection === "asc" ? (
                  <ArrowUp className="inline ml-1 h-4 w-4" />
                ) : (
                  <ArrowDown className="inline ml-1 h-4 w-4" />
                ))}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-[#47acc9]"
              onClick={() => toggleSort("quantity")}
            >
              Množstvo
              {sortField === "quantity" &&
                (sortDirection === "asc" ? (
                  <ArrowUp className="inline ml-1 h-4 w-4" />
                ) : (
                  <ArrowDown className="inline ml-1 h-4 w-4" />
                ))}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-[#47acc9]"
              onClick={() => toggleSort("company")}
            >
              Spoločnosť
              {sortField === "company" &&
                (sortDirection === "asc" ? (
                  <ArrowUp className="inline ml-1 h-4 w-4" />
                ) : (
                  <ArrowDown className="inline ml-1 h-4 w-4" />
                ))}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-[#47acc9]"
              onClick={() => toggleSort("customer")}
            >
              Zákazník
              {sortField === "customer" &&
                (sortDirection === "asc" ? (
                  <ArrowUp className="inline ml-1 h-4 w-4" />
                ) : (
                  <ArrowDown className="inline ml-1 h-4 w-4" />
                ))}
            </TableHead>
            <TableHead>Vytvorené</TableHead>
            <TableHead className="w-[100px]">Akcie</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <InventoryListItem
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};