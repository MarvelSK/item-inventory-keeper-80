import { Button } from "../../ui/button";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from "../../ui/label";

interface DateRangeInputsProps {
  filters: {
    dateFrom?: Date;
    dateTo?: Date;
  };
  onFilterChange: (filters: any) => void;
}

export const DateRangeInputs = ({ filters, onFilterChange }: DateRangeInputsProps) => {
  return (
    <div className="space-y-2">
      <Label className="dark:text-foreground">Dátum vytvorenia</Label>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal dark:bg-muted/10 dark:border-border/50",
                !filters.dateFrom && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateFrom ? format(filters.dateFrom, "dd.MM.yyyy") : "Od"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 dark:bg-card dark:border-border/50" align="start">
            <Calendar
              mode="single"
              selected={filters.dateFrom}
              onSelect={(date) => onFilterChange({ dateFrom: date })}
              className="dark:bg-card"
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal dark:bg-muted/10 dark:border-border/50",
                !filters.dateTo && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateTo ? format(filters.dateTo, "dd.MM.yyyy") : "Do"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 dark:bg-card dark:border-border/50" align="start">
            <Calendar
              mode="single"
              selected={filters.dateTo}
              onSelect={(date) => onFilterChange({ dateTo: date })}
              className="dark:bg-card"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};