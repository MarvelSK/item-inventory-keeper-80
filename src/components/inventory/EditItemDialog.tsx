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

interface EditItemDialogProps {
  item: Item | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (item: Item) => void;
}

export const EditItemDialog = ({ item, isOpen, onOpenChange, onSave }: EditItemDialogProps) => {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upraviť položku</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Kód"
            value={item.code}
            onChange={(e) =>
              onSave({ ...item, code: e.target.value })
            }
          />
          <Input
            type="number"
            placeholder="Množstvo"
            value={item.quantity}
            onChange={(e) =>
              onSave({
                ...item,
                quantity: parseInt(e.target.value) || 0,
              })
            }
          />
          <Select 
            value={item.company} 
            onValueChange={(value) => onSave({ ...item, company: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Vybrať spoločnosť" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select 
            value={item.customer} 
            onValueChange={(value) => onSave({ ...item, customer: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Vybrať zákazníka" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full bg-[#212490] hover:bg-[#47acc9]"
          >
            Uložiť
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};