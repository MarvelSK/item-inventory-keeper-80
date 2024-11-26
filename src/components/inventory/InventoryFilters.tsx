import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar } from "../ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
    status: "",
  });

  const handleFilterChange = (newFilters: Partial<FilterValues>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="ml-2">
          <Filter className="h-4 w-4 mr-2" />
          Filtre
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Stav</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange({ status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Všetky stavy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Všetky stavy</SelectItem>
                <SelectItem value="waiting">Čaká na dovoz</SelectItem>
                <SelectItem value="in_stock">Na sklade</SelectItem>
                <SelectItem value="in_transit">V preprave</SelectItem>
                <SelectItem value="delivered">Doručené</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Dátum vytvorenia</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateFrom ? (
                      format(filters.dateFrom, "dd.MM.yyyy")
                    ) : (
                      "Od"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) => handleFilterChange({ dateFrom: date })}
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateTo ? (
                      format(filters.dateTo, "dd.MM.yyyy")
                    ) : (
                      "Do"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={(date) => handleFilterChange({ dateTo: date })}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Rozmery (cm)</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Dĺžka</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Od"
                    value={filters.minLength || ""}
                    onChange={(e) => handleFilterChange({ minLength: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    placeholder="Do"
                    value={filters.maxLength || ""}
                    onChange={(e) => handleFilterChange({ maxLength: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Šírka</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Od"
                    value={filters.minWidth || ""}
                    onChange={(e) => handleFilterChange({ minWidth: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    placeholder="Do"
                    value={filters.maxWidth || ""}
                    onChange={(e) => handleFilterChange({ maxWidth: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <Label className="text-xs">Výška</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Od"
                    value={filters.minHeight || ""}
                    onChange={(e) => handleFilterChange({ minHeight: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    placeholder="Do"
                    value={filters.maxHeight || ""}
                    onChange={(e) => handleFilterChange({ maxHeight: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};