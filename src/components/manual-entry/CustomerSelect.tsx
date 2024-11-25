import { useState, useEffect } from "react";
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
import { Customer } from "@/lib/types";

interface CustomerSelectProps {
  value: string;
  onChange: (value: string) => void;
  onAddNew: () => void;
}

export const CustomerSelect = ({ value, onChange, onAddNew }: CustomerSelectProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const fetchedCustomers = await getActiveCustomers();
      setCustomers(fetchedCustomers);
    };
    fetchCustomers();
  }, []);

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