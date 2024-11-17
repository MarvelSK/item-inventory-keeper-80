import { useState } from "react";
import { Item } from "@/lib/types";
import { getAllItems, deleteItem, updateItem } from "@/lib/inventory";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { EditItemDialog } from "./inventory/EditItemDialog";
import { InventorySearch } from "./inventory/InventorySearch";
import { InventoryTable } from "./inventory/InventoryTable";
import { InventoryGrid } from "./inventory/InventoryGrid";

export const InventoryList = () => {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof Item>("code");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [items] = useState(getAllItems());
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const sortedAndFilteredItems = items
    .filter(
      (item) =>
        item.code.toLowerCase().includes(search.toLowerCase()) ||
        item.company.toLowerCase().includes(search.toLowerCase()) ||
        item.customer.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      return sortDirection === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

  const toggleSort = (field: keyof Item) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDelete = () => {
    if (deletingItemId) {
      deleteItem(deletingItemId);
      setDeletingItemId(null);
      setIsDeleteDialogOpen(false);
      toast.success("Položka bola vymazaná");
    }
  };

  const handleEdit = (updatedItem: Item) => {
    updateItem(updatedItem);
    setEditingItem(null);
    setIsEditDialogOpen(false);
    toast.success("Položka bola upravená");
  };

  return (
    <div className="space-y-4">
      <InventorySearch
        search={search}
        setSearch={setSearch}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {viewMode === "list" ? (
        <InventoryTable
          items={sortedAndFilteredItems}
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
          items={sortedAndFilteredItems}
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
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