import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CompanySelect } from "./CompanySelect";
import { CustomerSelect } from "./CustomerSelect";
import { v4 as uuidv4 } from 'uuid';
import { useItems } from "@/hooks/useItems";

export const AddItemForm = () => {
  const [code, setCode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const { addItem } = useItems();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code || !selectedCompany || !selectedCustomer) {
      return;
    }

    const newItem = {
      id: uuidv4(),
      code,
      quantity,
      company: selectedCompany,
      customer: selectedCustomer,
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted: false
    };

    await addItem(newItem);
    setCode("");
    setQuantity(1);
    setSelectedCompany("");
    setSelectedCustomer("");
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
      <CompanySelect value={selectedCompany} onChange={setSelectedCompany} onAddNew={() => {}} />
      <CustomerSelect value={selectedCustomer} onChange={setSelectedCustomer} onAddNew={() => {}} />
      <Button type="submit" className="w-full bg-[#212490] hover:bg-[#47acc9]">
        Pridať položku
      </Button>
    </form>
  );
};