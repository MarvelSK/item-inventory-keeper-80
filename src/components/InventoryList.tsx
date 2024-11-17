import { useState } from "react";
import { Input } from "./ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "./ui/table";
import { Button } from "./ui/button";
import { getAllItems, deleteItem, updateItem } from "@/lib/inventory";
import { Item } from "@/lib/types";
import { Search, ArrowUp, ArrowDown, Grid, List } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { toast } from "sonner";
import { InventoryListItem } from "./inventory/InventoryListItem";
import { InventoryGridItem } from "./inventory/InventoryGridItem";
import { EditItemDialog } from "./inventory/EditItemDialog";

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

      {viewMode === "list" ? (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:text-[#47acc9]"
                  onClick={() => toggleSort("code")}
                >
                  Kód
                  {sortField === "code" && (
                    sortDirection === "asc" ? <ArrowUp className="inline ml-1 h-4 w-4" /> : 
                    <ArrowDown className="inline ml-1 h-4 w-4" />
                  )}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-[#47acc9]"
                  onClick={() => toggleSort("quantity")}
                >
                  Množstvo
                  {sortField === "quantity" && (
                    sortDirection === "asc" ? <ArrowUp className="inline ml-1 h-4 w-4" /> : 
                    <ArrowDown className="inline ml-1 h-4 w-4" />
                  )}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-[#47acc9]"
                  onClick={() => toggleSort("company")}
                >
                  Spoločnosť
                  {sortField === "company" && (
                    sortDirection === "asc" ? <ArrowUp className="inline ml-1 h-4 w-4" /> : 
                    <ArrowDown className="inline ml-1 h-4 w-4" />
                  )}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-[#47acc9]"
                  onClick={() => toggleSort("customer")}
                >
                  Zákazník
                  {sortField === "customer" && (
                    sortDirection === "asc" ? <ArrowUp className="inline ml-1 h-4 w-4" /> : 
                    <ArrowDown className="inline ml-1 h-4 w-4" />
                  )}
                </TableHead>
                <TableHead>Vytvorené</TableHead>
                <TableHead>Upravené</TableHead>
                <TableHead className="w-[100px]">Akcie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredItems.map((item) => (
                <InventoryListItem
                  key={item.id}
                  item={item}
                  onEdit={(item) => {
                    setEditingItem(item);
                    setIsEditDialogOpen(true);
                  }}
                  onDelete={(id) => {
                    setDeletingItemId(id);
                    setIsDeleteDialogOpen(true);
                  }}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedAndFilteredItems.map((item) => (
            <InventoryGridItem
              key={item.id}
              item={item}
              onEdit={(item) => {
                setEditingItem(item);
                setIsEditDialogOpen(true);
              }}
              onDelete={(id) => {
                setDeletingItemId(id);
                setIsDeleteDialogOpen(true);
              }}
            />
          ))}
        </div>
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