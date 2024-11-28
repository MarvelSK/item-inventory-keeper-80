import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

interface DimensionInputsProps {
  filters: {
    minLength?: number;
    maxLength?: number;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
  };
  onFilterChange: (filters: any) => void;
}

export const DimensionInputs = ({ filters, onFilterChange }: DimensionInputsProps) => {
  const handleFilterChange = (newFilters: any) => {
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-2">
      <Label className="dark:text-foreground">Rozmery (cm)</Label>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs dark:text-foreground">Dĺžka</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Od"
              value={filters.minLength || ""}
              onChange={(e) => handleFilterChange({ minLength: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full dark:bg-muted/10 dark:border-border/50"
            />
            <Input
              type="number"
              placeholder="Do"
              value={filters.maxLength || ""}
              onChange={(e) => handleFilterChange({ maxLength: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full dark:bg-muted/10 dark:border-border/50"
            />
          </div>
        </div>
        <div>
          <Label className="text-xs dark:text-foreground">Šírka</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Od"
              value={filters.minWidth || ""}
              onChange={(e) => handleFilterChange({ minWidth: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full dark:bg-muted/10 dark:border-border/50"
            />
            <Input
              type="number"
              placeholder="Do"
              value={filters.maxWidth || ""}
              onChange={(e) => handleFilterChange({ maxWidth: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full dark:bg-muted/10 dark:border-border/50"
            />
          </div>
        </div>
        <div className="col-span-2">
          <Label className="text-xs dark:text-foreground">Výška</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Od"
              value={filters.minHeight || ""}
              onChange={(e) => handleFilterChange({ minHeight: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full dark:bg-muted/10 dark:border-border/50"
            />
            <Input
              type="number"
              placeholder="Do"
              value={filters.maxHeight || ""}
              onChange={(e) => handleFilterChange({ maxHeight: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full dark:bg-muted/10 dark:border-border/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};