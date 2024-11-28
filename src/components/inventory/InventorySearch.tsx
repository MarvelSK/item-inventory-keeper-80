import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Grid, List } from "lucide-react";
import { InventoryFilters } from "./InventoryFilters";

interface InventorySearchProps {
  search: string;
  setSearch: (value: string) => void;
  viewMode: "list" | "grid";
  setViewMode: (mode: "list" | "grid") => void;
  onFilterChange: (filters: any) => void;
}

export const InventorySearch = ({
  search,
  setSearch,
  viewMode,
  setViewMode,
  onFilterChange,
}: InventorySearchProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Vyhľadať položky..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="flex space-x-2">
        <InventoryFilters onFilterChange={onFilterChange} />
        <Button
          variant="outline"
          size="icon"
          onClick={() => setViewMode("list")}
          className={`layout-button ${viewMode === "list" ? "bg-accent" : ""}`}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setViewMode("grid")}
          className={`layout-button ${viewMode === "grid" ? "bg-accent" : ""}`}
        >
          <Grid className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};