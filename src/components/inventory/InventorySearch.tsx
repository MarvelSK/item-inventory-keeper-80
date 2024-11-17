import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Grid, List } from "lucide-react";

interface InventorySearchProps {
  search: string;
  setSearch: (value: string) => void;
  viewMode: "list" | "grid";
  setViewMode: (mode: "list" | "grid") => void;
}

export const InventorySearch = ({
  search,
  setSearch,
  viewMode,
  setViewMode,
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
        <Button
          variant="outline"
          size="icon"
          onClick={() => setViewMode("list")}
          className={viewMode === "list" ? "bg-accent" : ""}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setViewMode("grid")}
          className={viewMode === "grid" ? "bg-accent" : ""}
        >
          <Grid className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};