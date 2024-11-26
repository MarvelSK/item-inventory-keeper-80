import { Item } from "@/lib/types";
import { Button } from "../ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { companies, customers } from "@/lib/inventory";
import { format } from "date-fns";

interface InventoryGridItemProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

export const InventoryGridItem = ({ item, onEdit, onDelete }: InventoryGridItemProps) => {
  const company = companies.find((c) => c.id === item.company)?.name || "Unknown";
  const customer = customers.find((c) => c.id === item.customer)?.name || "Unknown";

  return (
    <div className="p-4 border rounded-lg space-y-2">
      <div className="font-medium">{item.code}</div>
      <div className="text-sm text-gray-500">
        <div>Spoločnosť: {company}</div>
        <div>Zákazník: {customer}</div>
        <div>Popis: {item.description || "-"}</div>
        <div>Rozmery: {item.length && item.width && item.height
          ? `${item.length}×${item.width}×${item.height} cm`
          : "-"}
        </div>
        <div>Vytvorené: {format(item.createdAt, "dd.MM.yyyy HH:mm")}</div>
        <div>Upravené: {format(item.updatedAt, "dd.MM.yyyy HH:mm")}</div>
      </div>
      <div className="flex space-x-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 hover:text-[#47acc9]"
          onClick={() => onEdit(item)}
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Upraviť
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 hover:text-[#47acc9]"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Vymazať
        </Button>
      </div>
    </div>
  );
};