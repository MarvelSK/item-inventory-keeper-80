import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { getActiveCompanies } from "@/lib/inventory";

interface CompanySelectProps {
  value: string;
  onChange: (value: string) => void;
  onAddNew: () => void;
}

export const CompanySelect = ({ value, onChange, onAddNew }: CompanySelectProps) => {
  const companies = getActiveCompanies();

  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Vyberte spoločnosť" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={onAddNew}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};