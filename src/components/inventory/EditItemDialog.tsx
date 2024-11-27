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
import { useCustomers } from "@/hooks/useCustomers";
import { Item } from "@/lib/types";
import { useState, useEffect } from "react";
import { Textarea } from "../ui/textarea";
import { Loader2 } from "lucide-react";

const DESCRIPTIONS = ['Příslušenství', 'Plechy', 'Žaluzie', 'Vodící profily', 'Kliky'];

const STATUS_OPTIONS = [
  { value: 'waiting', label: 'Čaká na dovoz' },
  { value: 'in_stock', label: 'Na sklade' },
  { value: 'in_transit', label: 'V preprave' },
  { value: 'delivered', label: 'Doručené' }
];

interface EditItemDialogProps {
  item: Item | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (item: Item) => Promise<void>;
}

export const EditItemDialog = ({ item, isOpen, onOpenChange, onSave }: EditItemDialogProps) => {
  const [editedItem, setEditedItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { customers } = useCustomers();

  useEffect(() => {
    if (item) {
      setEditedItem({ ...item });
    }
  }, [item]);

  if (!editedItem) return null;

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await onSave(editedItem);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[425px]">
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
            disabled={isLoading}
          />
          <Select 
            value={editedItem.customer} 
            onValueChange={(value) => setEditedItem({ ...editedItem, customer: value })}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
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
          <Select 
            value={editedItem.description || ''} 
            onValueChange={(value) => setEditedItem({ ...editedItem, description: value })}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Vyberte popis" />
            </SelectTrigger>
            <SelectContent>
              {DESCRIPTIONS.map((desc) => (
                <SelectItem key={desc} value={desc}>
                  {desc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select 
            value={editedItem.status} 
            onValueChange={(value: 'waiting' | 'in_stock' | 'in_transit' | 'delivered') => 
              setEditedItem({ ...editedItem, status: value })
            }
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Vybrať stav" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="grid grid-cols-3 gap-2">
            <Input
              type="number"
              placeholder="Délka (cm)"
              value={editedItem.length || ""}
              onChange={(e) =>
                setEditedItem({
                  ...editedItem,
                  length: parseInt(e.target.value) || undefined,
                })
              }
              disabled={isLoading}
            />
            <Input
              type="number"
              placeholder="Šířka (cm)"
              value={editedItem.width || ""}
              onChange={(e) =>
                setEditedItem({
                  ...editedItem,
                  width: parseInt(e.target.value) || undefined,
                })
              }
              disabled={isLoading}
            />
            <Input
              type="number"
              placeholder="Výška (cm)"
              value={editedItem.height || ""}
              onChange={(e) =>
                setEditedItem({
                  ...editedItem,
                  height: parseInt(e.target.value) || undefined,
                })
              }
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleSave}
            className="w-full bg-[#212490] hover:bg-[#47acc9]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ukladám...
              </>
            ) : (
              'Uložiť'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};