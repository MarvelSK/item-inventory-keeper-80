import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { getActiveCustomers } from "@/lib/inventory";

interface CustomerSelectProps {
  value: string;
  companyId: string;
  onChange: (value: string) => void;
  onAddNew: () => void;
}

export const CustomerSelect = ({ value, companyId, onChange, onAddNew }: CustomerSelectProps) => {
  const customers = getActiveCustomers().filter(
    (customer) => !companyId || customer.companyId === companyId
  );

  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Vyberte zákazníka" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={onAddNew}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};