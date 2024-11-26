import { useState } from "react";
import { Item } from "@/lib/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { EditItemDialog } from "./inventory/EditItemDialog";
import { InventorySearch } from "./inventory/InventorySearch";
import { InventoryTable } from "./inventory/InventoryTable";
import { InventoryGrid } from "./inventory/InventoryGrid";
import { useItems } from "@/hooks/useItems";
import { Loader2 } from "lucide-react";
import { MassImportDialog } from "./inventory/MassImportDialog";
import { InventoryStats } from "./inventory/InventoryStats";
import { InventoryPagination } from "./inventory/InventoryPagination";
import { ArchiveControls } from "./inventory/ArchiveControls";
import { toast } from "sonner";

interface Filters {
  status: string;
  minLength?: number;
  maxLength?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  dateFrom?: Date;
  dateTo?: Date;
  showArchived?: boolean;
}

export const InventoryList = () => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>({ status: "", showArchived: false });
  const [sortField, setSortField] = useState<keyof Item>("code");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  const { items, isLoading, error, updateItem, deleteItem } = useItems();

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-red-500">
        Failed to load items. Please try again later.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  const filterItems = (items: Item[]) => {
    return items.filter((item) => {
      if (!filters.showArchived && item.archived) return false;
      if (filters.showArchived && !item.archived) return false;

      // Text search
      const searchMatch =
        item.code.toLowerCase().includes(search.toLowerCase()) ||
        item.company.toLowerCase().includes(search.toLowerCase()) ||
        item.customer.toLowerCase().includes(search.toLowerCase());

      if (!searchMatch) return false;

      // Status filter
      if (filters.status && item.status !== filters.status) return false;

      // Date range filter
      if (filters.dateFrom || filters.dateTo) {
        const itemDate = new Date(item.createdAt);
        if (filters.dateFrom && itemDate < filters.dateFrom) return false;
        if (filters.dateTo && itemDate > filters.dateTo) return false;
      }

      // Dimension filters
      if (filters.minLength && (!item.length || item.length < filters.minLength)) return false;
      if (filters.maxLength && (!item.length || item.length > filters.maxLength)) return false;
      if (filters.minWidth && (!item.width || item.width < filters.minWidth)) return false;
      if (filters.maxWidth && (!item.width || item.width > filters.maxWidth)) return false;
      if (filters.minHeight && (!item.height || item.height < filters.minHeight)) return false;
      if (filters.maxHeight && (!item.height || item.height > filters.maxHeight)) return false;

      return true;
    });
  };

  const filteredItems = Array.isArray(items) ? filterItems(items) : [];

  const sortedAndFilteredItems = [...filteredItems].sort((a, b) => {
    if (a.postponed && !b.postponed) return -1;
    if (!a.postponed && b.postponed) return 1;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    return sortDirection === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const totalPages = Math.ceil(sortedAndFilteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = sortedAndFilteredItems.slice(startIndex, startIndex + itemsPerPage);

  const toggleSort = (field: keyof Item) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDelete = async () => {
    if (deletingItemId) {
      await deleteItem(deletingItemId);
      setDeletingItemId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEdit = async (updatedItem: Item) => {
    await updateItem(updatedItem);
    setEditingItem(null);
    setIsEditDialogOpen(false);
  };

  const handlePostpone = async (item: Item) => {
    if (!item.postponed) {
      const reason = prompt("Zadajte dôvod odloženia položky:");
      if (!reason) return;
      
      const updatedItem = {
        ...item,
        postponed: true,
        postponeReason: reason,
        updatedAt: new Date()
      };
      await updateItem(updatedItem);
      toast.success("Položka bola označená ako odložená");
    } else {
      const updatedItem = {
        ...item,
        postponed: false,
        postponeReason: undefined,
        updatedAt: new Date()
      };
      await updateItem(updatedItem);
      toast.success("Položka už nie je označená ako odložená");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <InventorySearch
          search={search}
          setSearch={setSearch}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onFilterChange={setFilters}
          showArchived={filters.showArchived}
        />
        <div className="flex gap-2">
          <ArchiveControls items={items} />
          <MassImportDialog />
        </div>
      </div>

      <InventoryStats items={sortedAndFilteredItems} />

      {viewMode === "list" ? (
        <InventoryTable
          items={paginatedItems}
          sortField={sortField}
          sortDirection={sortDirection}
          toggleSort={toggleSort}
          onEdit={(item) => {
            setEditingItem(item);
            setIsEditDialogOpen(true);
          }}
          onDelete={(id) => {
            setDeletingItemId(id);
            setIsDeleteDialogOpen(true);
          }}
          onPostpone={handlePostpone}
        />
      ) : (
        <InventoryGrid
          items={paginatedItems}
          onEdit={(item) => {
            setEditingItem(item);
            setIsEditDialogOpen(true);
          }}
          onDelete={(id) => {
            setDeletingItemId(id);
            setIsDeleteDialogOpen(true);
          }}
          onPostpone={handlePostpone}
        />
      )}

      <InventoryPagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(parseInt(value, 10));
          setCurrentPage(1);
        }}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="w-[95vw] max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Vymazať položku</AlertDialogTitle>
            <AlertDialogDescription>
              Naozaj chcete vymazať túto položku? Táto akcia sa nedá vrátiť späť.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Vymazať</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditItemDialog
        item={editingItem}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleEdit}
      />
    </div>
  );
};