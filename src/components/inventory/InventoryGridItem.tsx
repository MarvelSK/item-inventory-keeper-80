import { Item } from "@/lib/types";
import { Button } from "../ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { companies, customers } from "@/lib/inventory";
import { format } from "date-fns";
import { Badge } from "../ui/badge";
import { ItemActionsDropdown } from "./ItemActionsDropdown";

interface InventoryGridItemProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
  onPostpone: (item: Item) => void;
}

const STATUS_MAP = {
  waiting: { label: 'Čaká na dovoz', variant: 'secondary' },
  in_stock: { label: 'Na sklade', variant: 'success' },
  in_transit: { label: 'V preprave', variant: 'warning' },
  delivered: { label: 'Doručené', variant: 'default' }
} as const;

export const InventoryGridItem = ({ item, onEdit, onDelete, onPostpone }: InventoryGridItemProps) => {
  const company = companies.find((c) => c.id === item.company)?.name || "Unknown";
  const customer = customers.find((c) => c.id === item.customer)?.name || "Unknown";
  const statusInfo = STATUS_MAP[item.status];

  return (
    <div className={`p-4 border rounded-lg space-y-2 ${item.postponed ? 'bg-gray-50' : ''}`}>
      <div className="font-medium">{item.code}</div>
      <div className="text-sm text-gray-500">
        <div>Spoločnosť: {company}</div>
        <div>Zákazník: {customer}</div>
        <div>Popis: {item.description || "-"}</div>
        <div>Rozmery: {item.length && item.width && item.height
          ? `${item.length}×${item.width}×${item.height} cm`
          : "-"}
        </div>
        <div>Stav: <Badge variant={statusInfo.variant as any}>{statusInfo.label}</Badge></div>
        <div>Vytvorené: {format(item.createdAt, "dd.MM.yyyy HH:mm")}</div>
        <div>Upravené: {format(item.updatedAt, "dd.MM.yyyy HH:mm")}</div>
      </div>
      <div className="flex justify-end">
        <ItemActionsDropdown
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onPostpone={onPostpone}
        />
      </div>
    </div>
  );
};