import { Item } from "@/lib/types";
import { useCustomers } from "@/hooks/useCustomers";
import { format } from "date-fns";
import { Badge } from "../ui/badge";
import { ItemActionsDropdown } from "./ItemActionsDropdown";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

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
  const { customers } = useCustomers();
  const customer = customers.find((c) => c.id === item.customer)?.name || "Unknown";
  const statusInfo = STATUS_MAP[item.status];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`p-4 border rounded-lg space-y-2 ${
            item.postponed ? 'bg-yellow-100 hover:bg-yellow-200' : 'hover:bg-gray-50'
          }`}>
            <div className="font-medium">{item.code}</div>
            <div className="text-sm text-gray-500">
              <div>Zákazník: {customer}</div>
              <div>Popis: {item.description || "-"}</div>
              <div>Rozmery: {item.height && item.width && item.length
                ? `V:${item.height}×Š:${item.width}×D:${item.length} cm`
                : "-"}
              </div>
              <div>Stav: <Badge variant={statusInfo.variant as any}>{statusInfo.label}</Badge></div>
              <div>Vytvorené: {format(new Date(item.createdAt), "dd.MM.yyyy HH:mm")}</div>
              <div>Upravené: {format(new Date(item.updatedAt), "dd.MM.yyyy HH:mm")}</div>
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
        </TooltipTrigger>
        {item.postponed && item.postponeReason && (
          <TooltipContent>
            <p>Dôvod odloženia: {item.postponeReason}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};