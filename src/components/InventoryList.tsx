import { useState } from "react";
import { Item } from "@/lib/types";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { EditItemDialog } from "./inventory/EditItemDialog";
import { InventorySearch } from "./inventory/InventorySearch";
import { InventoryTable } from "./inventory/InventoryTable";
import { InventoryGrid } from "./inventory/InventoryGrid";
import { useItems } from "@/hooks/useItems";
import { Loader2 } from "lucide-react";
import { MassImportDialog } from "./inventory/MassImportDialog";
import { InventoryStats } from "./inventory/InventoryStats";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";

export const InventoryList = () => {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof Item>("code");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const filteredItems = Array.isArray(items) 
    ? items.filter(
        (item) =>
          item.code.toLowerCase().includes(search.toLowerCase()) ||
          item.company.toLowerCase().includes(search.toLowerCase()) ||
          item.customer.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const sortedAndFilteredItems = [...filteredItems].sort((a, b) => {
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-4 px-4 sm:px-0">
      <div className="flex justify-between items-center">
        <InventorySearch
          search={search}
          setSearch={setSearch}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        <MassImportDialog />
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
        />
      )}

      {totalPages > 1 && (
        <Pagination className="justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

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