import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { companies, customers } from "@/lib/inventory";
import { Item } from "@/lib/types";
import { useState, useEffect } from "react";

interface EditItemDialogProps {
  item: Item | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (item: Item) => void;
}

export const EditItemDialog = ({ item, isOpen, onOpenChange, onSave }: EditItemDialogProps) => {
  const [editedItem, setEditedItem] = useState<Item | null>(null);

  useEffect(() => {
    if (item) {
      setEditedItem({ ...item });
    }
  }, [item]);

  if (!editedItem) return null;

  const handleSave = () => {
    onSave(editedItem);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upraviť položku</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Kód"
            value={editedItem.code}
            onChange={(e) =>
              setEditedItem({ ...editedItem, code: e.target.value })
            }
          />
          <Input
            type="number"
            placeholder="Množstvo"
            value={editedItem.quantity}
            onChange={(e) =>
              setEditedItem({
                ...editedItem,
                quantity: parseInt(e.target.value) || 0,
              })
            }
          />
          <Select 
            value={editedItem.company} 
            onValueChange={(value) => setEditedItem({ ...editedItem, company: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Vybrať spoločnosť" />
            </SelectTrigger>
            <SelectContent>
              {companies.filter(c => !c.deleted).map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select 
            value={editedItem.customer} 
            onValueChange={(value) => setEditedItem({ ...editedItem, customer: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Vybrať zákazníka" />
            </SelectTrigger>
            <SelectContent>
              {customers.filter(c => !c.deleted).map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleSave}
            className="w-full bg-[#212490] hover:bg-[#47acc9]"
          >
            Uložiť
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};