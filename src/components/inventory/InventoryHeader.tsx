import { InventorySearch } from "./InventorySearch";
import { MassImportDialog } from "./MassImportDialog";

interface InventoryHeaderProps {
  search: string;
  setSearch: (value: string) => void;
  viewMode: "list" | "grid";
  setViewMode: (mode: "list" | "grid") => void;
  onFilterChange: (filters: any) => void;
}

export const InventoryHeader = ({
  search,
  setSearch,
  viewMode,
  setViewMode,
  onFilterChange,
}: InventoryHeaderProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <InventorySearch
          search={search}
          setSearch={setSearch}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onFilterChange={onFilterChange}
        />
      </div>
      <div>
        <MassImportDialog />
      </div>
    </div>
  );
};