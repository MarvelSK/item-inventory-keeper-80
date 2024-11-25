import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Customer } from "@/lib/types";
import { LabelManager } from "./labels/LabelManager";

interface EditCustomerFormProps {
  customer: Customer;
  onSave: (customer: Customer) => void;
}

export const EditCustomerForm = ({ customer, onSave }: EditCustomerFormProps) => {
  const [name, setName] = useState(customer.name);
  const [labels, setLabels] = useState(customer.labels || []);

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Vyplňte meno zákazníka");
      return;
    }
    onSave({ ...customer, name, labels });
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Meno zákazníka"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <LabelManager labels={labels} onLabelsChange={setLabels} />
      <Button onClick={handleSubmit} className="w-full bg-[#212490] hover:bg-[#47acc9]">
        Uložiť
      </Button>
    </div>
  );
};