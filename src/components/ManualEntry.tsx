import { useState } from "react";
import { companies, customers, addItem } from "@/lib/inventory";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const ManualEntry = () => {
  const [formData, setFormData] = useState({
    code: "",
    quantity: 0,
    company: "",
    customer: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.company || !formData.customer) {
      toast.error("Vyplňte všetky povinné polia");
      return;
    }

    addItem(formData);
    toast.success("Položka bola pridaná");
    setFormData({ code: "", quantity: 0, company: "", customer: "" });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-[#212490]">Pridať novú položku</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kód položky
          </label>
          <Input
            value={formData.code}
            onChange={(e) =>
              setFormData({ ...formData, code: e.target.value })
            }
            placeholder="Zadajte kód položky"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Množstvo
          </label>
          <Input
            type="number"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })
            }
            placeholder="Zadajte množstvo"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Spoločnosť
          </label>
          <Select
            value={formData.company}
            onValueChange={(value) => setFormData({ ...formData, company: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Vyberte spoločnosť" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Zákazník
          </label>
          <Select
            value={formData.customer}
            onValueChange={(value) => setFormData({ ...formData, customer: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Vyberte zákazníka" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#212490] hover:bg-[#47acc9] text-white"
        >
          Pridať položku
        </Button>
      </form>
    </div>
  );
};