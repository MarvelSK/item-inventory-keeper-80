import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

interface EditCustomerFormProps {
  customer: {
    id: string;
    name: string;
  };
  onSave: (customer: { id: string; name: string }) => void;
}

export const EditCustomerForm = ({ customer, onSave }: EditCustomerFormProps) => {
  const [name, setName] = useState(customer.name);

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Vyplňte meno zákazníka");
      return;
    }
    onSave({ id: customer.id, name });
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Meno zákazníka"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={handleSubmit} className="w-full bg-[#212490] hover:bg-[#47acc9]">
        Uložiť
      </Button>
    </div>
  );
};