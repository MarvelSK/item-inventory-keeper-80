import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

interface EditCompanyFormProps {
  company: {
    id: string;
    name: string;
  };
  onSave: (company: { id: string; name: string }) => void;
}

export const EditCompanyForm = ({ company, onSave }: EditCompanyFormProps) => {
  const [name, setName] = useState(company.name);

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Vyplňte názov spoločnosti");
      return;
    }
    onSave({ id: company.id, name });
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Názov spoločnosti"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={handleSubmit} className="w-full bg-[#212490] hover:bg-[#47acc9]">
        Uložiť
      </Button>
    </div>
  );
};