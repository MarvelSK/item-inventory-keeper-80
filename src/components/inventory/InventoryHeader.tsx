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
    <div className="space-y-4">
      <div className="flex flex-col w-full sm:flex-row sm:items-center sm:space-x-2">
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