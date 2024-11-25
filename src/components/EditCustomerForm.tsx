import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Customer, Tag } from "@/lib/types";
import { TagManager } from "./tags/TagManager";

interface EditCustomerFormProps {
  customer: Customer;
  onSave: (customer: Customer) => void;
}

export const EditCustomerForm = ({ customer, onSave }: EditCustomerFormProps) => {
  const [name, setName] = useState(customer.name);
  const [tags, setTags] = useState(customer.tags || []);

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Vyplňte názov zakázky");
      return;
    }
    onSave({ ...customer, name, tags });
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Názov zakázky"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TagManager tags={tags} onTagsChange={setTags} />
      <Button onClick={handleSubmit} className="w-full bg-[#212490] hover:bg-[#47acc9]">
        Uložiť
      </Button>
    </div>
  );
};