import { useState } from "react";
import { companies, customers, addItem } from "@/lib/inventory";
import { toast } from "sonner";

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
      toast.error("Please fill in all required fields");
      return;
    }

    addItem(formData);
    toast.success("Item added successfully");
    setFormData({ code: "", quantity: 0, company: "", customer: "" });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item Code
          </label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) =>
              setFormData({ ...formData, code: e.target.value })
            }
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })
            }
            className="w-full p-2 border rounded-md"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <select
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select Company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer
          </label>
          <select
            value={formData.customer}
            onChange={(e) =>
              setFormData({ ...formData, customer: e.target.value })
            }
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select Customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
        >
          Add Item
        </button>
      </form>
    </div>
  );
};