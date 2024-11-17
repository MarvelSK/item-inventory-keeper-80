import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addItem } from "@/lib/inventory";
import { toast } from "sonner";
import { CompanySelect } from "./CompanySelect";
import { CustomerSelect } from "./CustomerSelect";

export const AddItemForm = () => {
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
        <CompanySelect
          value={formData.company}
          onChange={(value) => setFormData({ ...formData, company: value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Zákazník
        </label>
        <CustomerSelect
          value={formData.customer}
          companyId={formData.company}
          onChange={(value) => setFormData({ ...formData, customer: value })}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-[#212490] hover:bg-[#47acc9] text-white"
      >
        Pridať položku
      </Button>
    </form>
  );
};