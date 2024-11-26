import { useState } from "react";
import { Item } from "@/lib/types";
import { toast } from "sonner";

interface InventoryListLogicProps {
  items: Item[];
  updateItem: (item: Item) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  currentPage: number;
  itemsPerPage: number;
}

export const InventoryListLogic = ({ 
  items, 
  updateItem, 
  deleteItem, 
  currentPage, 
  itemsPerPage 
}: InventoryListLogicProps) => {
  const [filters, setFilters] = useState({ status: "" });
  const [sortField, setSortField] = useState<keyof Item>("code");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const filterItems = (items: Item[]) => {
    return items.filter((item) => {
      if (filters.status && item.status !== filters.status) return false;
      return true;
    });
  };

  const sortItems = (items: Item[]) => {
    return [...items].sort((a, b) => {
      if (a.postponed && !b.postponed) return -1;
      if (!a.postponed && b.postponed) return 1;
      
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  const filteredAndSortedItems = sortItems(filterItems(Array.isArray(items) ? items : []));
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredAndSortedItems.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async () => {
    if (deletingItemId) {
      await deleteItem(deletingItemId);
      setDeletingItemId(null);
    }
  };

  const handleEdit = async (updatedItem: Item) => {
    await updateItem(updatedItem);
    setEditingItem(null);
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

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return {
    filteredAndSortedItems,
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
  };
};