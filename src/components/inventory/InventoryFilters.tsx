import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Filter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { DateRangeInputs } from "./filters/DateRangeInputs";
import { DimensionInputs } from "./filters/DimensionInputs";

interface FilterValues {
  status: string;
  minLength?: number;
  maxLength?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  dateFrom?: Date;
  dateTo?: Date;
}

interface InventoryFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
}

export const InventoryFilters = ({ onFilterChange }: InventoryFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    status: "all",
  });

  const handleFilterChange = (newFilters: Partial<FilterValues>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="ml-2 dark:hover:bg-muted/30">
          <Filter className="h-4 w-4 mr-2" />
          Filtre
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 bg-background border-border dark:bg-card dark:border-border/50">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="dark:text-foreground">Stav</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange({ status: value })}
            >
              <SelectTrigger className="dark:bg-muted/10 dark:border-border/50">
                <SelectValue placeholder="Všetky stavy" />
              </SelectTrigger>
              <SelectContent className="dark:bg-card dark:border-border/50">
                <SelectItem value="all">Všetky stavy</SelectItem>
                <SelectItem value="waiting">Čaká na dovoz</SelectItem>
                <SelectItem value="in_stock">Na sklade</SelectItem>
                <SelectItem value="in_transit">V preprave</SelectItem>
                <SelectItem value="delivered">Doručené</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DateRangeInputs 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />

          <DimensionInputs 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};