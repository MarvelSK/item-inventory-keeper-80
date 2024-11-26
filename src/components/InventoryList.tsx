import { useState } from "react";
import { Item } from "@/lib/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { EditItemDialog } from "./inventory/EditItemDialog";
import { InventoryTable } from "./inventory/InventoryTable";
import { InventoryGrid } from "./inventory/InventoryGrid";
import { useItems } from "@/hooks/useItems";
import { Loader2 } from "lucide-react";
import { InventoryStats } from "./inventory/InventoryStats";
import { InventoryPagination } from "./inventory/InventoryPagination";
import { InventoryHeader } from "./inventory/InventoryHeader";
import { InventoryListLogic } from "./inventory/InventoryListLogic";

export const InventoryList = () => {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  const { items, isLoading, error, mutateAsync: updateItem, deleteItem } = useItems();

  const {
    paginatedItems,
    totalPages,
    editingItem,
    setEditingItem,
    deletingItemId,
    setDeletingItemId,
    handleDelete,
    handleEdit,
    handlePostpone,
    handleFilterChange,
    sortField,
    sortDirection,
    toggleSort,
  } = InventoryListLogic({
    items,
    updateItem,
    deleteItem,
    currentPage,
    itemsPerPage,
  });

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

  return (
    <div className="space-y-4">
      <InventoryHeader
        search={search}
        setSearch={setSearch}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onFilterChange={handleFilterChange}
      />

      <InventoryStats items={items} />

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