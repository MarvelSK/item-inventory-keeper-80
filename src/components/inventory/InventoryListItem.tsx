import { Item } from "@/lib/types";
import { Button } from "../ui/button";
import { TableCell, TableRow } from "../ui/table";
import { Edit2, Trash2, ChevronRight } from "lucide-react";
import { companies, customers } from "@/lib/inventory";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useState, useEffect } from "react";

interface InventoryListItemProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

export const InventoryListItem = ({ item, onEdit, onDelete }: InventoryListItemProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const company = companies.find((c) => c.id === item.company)?.name || "Unknown";
  const customer = customers.find((c) => c.id === item.customer)?.name || "Unknown";

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

  return (
    <>
      <TableRow className="group cursor-pointer" onClick={handleRowClick}>
        <TableCell className="font-medium">{item.code}</TableCell>
        <TableCell>{item.quantity}</TableCell>
        <TableCell className="hidden sm:table-cell">{company}</TableCell>
        <TableCell className="hidden sm:table-cell">{customer}</TableCell>
        <TableCell className="hidden sm:table-cell">
          {format(item.createdAt, "dd.MM.yyyy HH:mm")}
        </TableCell>
        <TableCell>
          <div className="flex justify-end sm:justify-start space-x-2">
            {!isMobile && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-[#47acc9] h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(item);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-red-500 h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-[#47acc9] h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
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
                <p><strong>Množstvo:</strong> {item.quantity}</p>
                <p><strong>Spoločnosť:</strong> {company}</p>
                <p><strong>Zákazník:</strong> {customer}</p>
                <p><strong>Vytvorené:</strong> {format(item.createdAt, "dd.MM.yyyy HH:mm")}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  className="flex-1 bg-[#212490] hover:bg-[#47acc9]"
                  onClick={() => {
                    setIsDialogOpen(false);
                    onEdit(item);
                  }}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Upraviť
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    setIsDialogOpen(false);
                    onDelete(item.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Vymazať
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};