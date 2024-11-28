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
          <SelectTrigger className="bg-background border-border dark:bg-muted/10 dark:border-border/50">
            <SelectValue placeholder="Vyberte zákazníka" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border dark:bg-card dark:border-border/50">
            {customers.map((customer) => (
              <SelectItem 
                key={customer.id} 
                value={customer.id}
                className="hover:bg-muted dark:hover:bg-muted/20"
              >
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
        className="dark:bg-muted/10 dark:border-border/50 dark:hover:bg-primary/20"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};