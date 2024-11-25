import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CustomerSelect } from "./CustomerSelect";
import { v4 as uuidv4 } from 'uuid';
import { useItems } from "@/hooks/useItems";
import { Textarea } from "../ui/textarea";
import { LabelManager } from "../labels/LabelManager";
import { Label } from "@/lib/types";

export const AddItemForm = () => {
  const [code, setCode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState("");
  const [labels, setLabels] = useState<Label[]>([]);
  const { addItem } = useItems();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code || !selectedCustomer) {
      return;
    }

    const newItem = {
      id: uuidv4(),
      code,
      quantity,
      description,
      size,
      labels,
      customer: selectedCustomer,
      company: "", // Empty string as we removed company selector
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted: false
    };

    await addItem(newItem);
    setCode("");
    setQuantity(1);
    setSelectedCustomer("");
    setDescription("");
    setSize("");
    setLabels([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Kód položky"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
      />
      <Input
        type="number"
        placeholder="Množstvo"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        required
      />
      <Input
        placeholder="Veľkosť"
        value={size}
        onChange={(e) => setSize(e.target.value)}
      />
      <Textarea
        placeholder="Popis"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="min-h-[100px]"
      />
      <LabelManager labels={labels} onLabelsChange={setLabels} />
      <CustomerSelect value={selectedCustomer} onChange={setSelectedCustomer} onAddNew={() => {}} />
      <Button type="submit" className="w-full bg-[#212490] hover:bg-[#47acc9]">
        Pridať položku
      </Button>
    </form>
  );
};