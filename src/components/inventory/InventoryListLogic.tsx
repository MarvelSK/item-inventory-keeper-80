import { useState } from "react";
import { Item } from "@/lib/types";
import { toast } from "sonner";

interface InventoryListLogicProps {
  items: Item[];
  updateItem: (item: Item) => Promise<Item>;
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
  const [search, setSearch] = useState("");

  const filterItems = (items: Item[]) => {
    return items.filter((item) => {
      const matchesFilter = !filters.status || item.status === filters.status;
      
      if (!matchesFilter) return false;
      
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch = 
          item.code?.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.status?.toLowerCase().includes(searchLower) ||
          item.customer?.toLowerCase().includes(searchLower);
        
        return matchesSearch;
      }
      
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

  const toggleSort = (field: keyof Item) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
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
    const updatedItem = item.postponed
      ? { ...item, postponed: false, postponeReason: undefined, updatedAt: new Date() }
      : {
          ...item,
          postponed: true,
          postponeReason: prompt("Zadajte dôvod odloženia položky:") || undefined,
          updatedAt: new Date()
        };

    if (updatedItem.postponed && !updatedItem.postponeReason) return;
    
    await updateItem(updatedItem);
    toast.success(updatedItem.postponed 
      ? "Položka bola označená ako odložená"
      : "Položka už nie je označená ako odložená"
    );
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (searchValue: string) => {
    setSearch(searchValue);
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
    handleSearchChange,
    search,
    sortField,
    sortDirection,
    toggleSort,
  };
};