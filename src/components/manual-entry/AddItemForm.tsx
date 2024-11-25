import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CustomerSelect } from "./CustomerSelect";
import { v4 as uuidv4 } from 'uuid';
import { useItems } from "@/hooks/useItems";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const DESCRIPTIONS = ['Příslušenství', 'Plechy', 'Žaluzie', 'Vodící profily'];

export const AddItemForm = () => {
  const [code, setCode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [description, setDescription] = useState("");
  const [length, setLength] = useState<number | undefined>();
  const [width, setWidth] = useState<number | undefined>();
  const [height, setHeight] = useState<number | undefined>();
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
        length,
        width,
        height,
        tags: [],
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
      setLength(undefined);
      setWidth(undefined);
      setHeight(undefined);
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
      <Select value={description} onValueChange={setDescription}>
        <SelectTrigger>
          <SelectValue placeholder="Vyberte popis" />
        </SelectTrigger>
        <SelectContent>
          {DESCRIPTIONS.map((desc) => (
            <SelectItem key={desc} value={desc}>
              {desc}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="grid grid-cols-3 gap-2">
        <Input
          type="number"
          placeholder="Délka (cm)"
          value={length ?? ""}
          onChange={(e) => setLength(e.target.value ? Number(e.target.value) : undefined)}
        />
        <Input
          type="number"
          placeholder="Šířka (cm)"
          value={width ?? ""}
          onChange={(e) => setWidth(e.target.value ? Number(e.target.value) : undefined)}
        />
        <Input
          type="number"
          placeholder="Výška (cm)"
          value={height ?? ""}
          onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>
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