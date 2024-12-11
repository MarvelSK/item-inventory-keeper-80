import { Button } from "../ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { Customer } from "@/lib/types";

interface CustomerActionsProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

export const CustomerActions = ({ customer, onEdit, onDelete }: CustomerActionsProps) => {
  return (
    <div className="flex space-x-2 justify-center md:justify-start">
      <Button
        variant="ghost"
        size="icon"
        className="hover:text-[#47acc9]"
        onClick={() => onEdit(customer)}
      >
        <Edit2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="hover:text-red-500"
        onClick={() => onDelete(customer.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};