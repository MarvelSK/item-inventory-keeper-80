import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { companies } from "@/lib/inventory";
import { toast } from "sonner";

interface EditCustomerFormProps {
  customer: {
    id: string;
    name: string;
    companyId: string;
  };
  onSave: (customer: { id: string; name: string; companyId: string }) => void;
}

export const EditCustomerForm = ({ customer, onSave }: EditCustomerFormProps) => {
  const [name, setName] = useState(customer.name);
  const [companyId, setCompanyId] = useState(customer.companyId);

  const handleSubmit = () => {
    if (!name.trim() || !companyId) {
      toast.error("Vyplňte všetky polia");
      return;
    }
    onSave({ id: customer.id, name, companyId });
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Meno zákazníka"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Select value={companyId} onValueChange={setCompanyId}>
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
      <Button onClick={handleSubmit} className="w-full bg-[#212490] hover:bg-[#47acc9]">
        Uložiť
      </Button>
    </div>
  );
};