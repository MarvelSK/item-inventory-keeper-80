import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CustomerSelect } from "./CustomerSelect";
import { v4 as uuidv4 } from 'uuid';
import { useItems } from "@/hooks/useItems";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const AddItemForm = () => {
  const [code, setCode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addItem } = useItems();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code || !selectedCustomer) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newItem = {
        id: uuidv4(),
        code,
        quantity,
        description,
        size,
        tags: [], // Tags will be inherited from customer
        customer: selectedCustomer,
        company: "",
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
      toast.success("Položka bola úspešne pridaná");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Item with this code already exists') {
          toast.error("Položka s týmto kódom už existuje");
        } else {
          toast.error("Chyba pri pridávaní položky");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
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
      <CustomerSelect value={selectedCustomer} onChange={setSelectedCustomer} onAddNew={() => {}} />
      <Button 
        type="submit" 
        className="w-full bg-[#212490] hover:bg-[#47acc9]"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Pridávam...
          </>
        ) : (
          'Pridať položku'
        )}
      </Button>
    </form>
  );
};