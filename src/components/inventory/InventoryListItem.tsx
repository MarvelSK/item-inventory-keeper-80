import { Item } from "@/lib/types";
import { TableCell, TableRow } from "../ui/table";
import { customers } from "@/lib/inventory";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useState, useEffect } from "react";
import { TagBadge } from "../tags/TagBadge";
import { Badge } from "../ui/badge";
import { ItemActionsDropdown } from "./ItemActionsDropdown";

interface InventoryListItemProps {
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

export const InventoryListItem = ({ item, onEdit, onDelete, onPostpone }: InventoryListItemProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const customer = customers.find((c) => c.id === item.customer);
  const customerName = customer?.name || "Unknown";
  const statusInfo = STATUS_MAP[item.status];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleRowClick = () => {
    if (isMobile) {
      setIsDialogOpen(true);
    }
  };

  const formatDimensions = (item: Item) => {
    if (item.length && item.width && item.height) {
      return `D:${item.length}×Š:${item.width}×V:${item.height}`;
    }
    return "-";
  };

  return (
    <>
      <TableRow 
        className={`group cursor-pointer ${
          item.postponed ? 'bg-yellow-100 hover:bg-yellow-200' : 'hover:bg-gray-50'
        }`} 
        onClick={handleRowClick}
      >
        <TableCell className="font-medium">{item.code}</TableCell>
        <TableCell>
          <Badge variant={statusInfo.variant as any}>{statusInfo.label}</Badge>
        </TableCell>
        <TableCell className="hidden sm:table-cell">{customerName}</TableCell>
        <TableCell className="hidden sm:table-cell">
          <div className="flex flex-wrap gap-1">
            {customer?.tags?.map((tag) => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
          </div>
        </TableCell>
        <TableCell className="hidden lg:table-cell">{item.description || "-"}</TableCell>
        <TableCell className="hidden lg:table-cell">
          {formatDimensions(item)}
        </TableCell>
        <TableCell className="hidden sm:table-cell">
          {format(item.createdAt, "dd.MM.yyyy HH:mm")}
        </TableCell>
        <TableCell>
          <div className="flex justify-end sm:justify-start">
            <ItemActionsDropdown
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
              onPostpone={onPostpone}
            />
          </div>
        </TableCell>
      </TableRow>

      {isMobile && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="w-[95vw] max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Detail položky</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <p><strong>Kód:</strong> {item.code}</p>
                <p><strong>Stav:</strong> <Badge variant={statusInfo.variant as any}>{statusInfo.label}</Badge></p>
                <p><strong>Zákazník:</strong> {customerName}</p>
                {customer?.tags && customer.tags.length > 0 && (
                  <div>
                    <strong>Štítky zákazníka:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {customer.tags.map((tag) => (
                        <TagBadge key={tag.id} tag={tag} />
                      ))}
                    </div>
                  </div>
                )}
                <p><strong>Popis:</strong> {item.description || "-"}</p>
                <p><strong>Rozmery:</strong> {formatDimensions(item)} cm</p>
                <p><strong>Vytvorené:</strong> {format(item.createdAt, "dd.MM.yyyy HH:mm")}</p>
              </div>
              <div className="flex space-x-2">
                <ItemActionsDropdown
                  item={item}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onPostpone={onPostpone}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};