import { useState } from "react";
import { Input } from "./ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table";
import { Button } from "./ui/button";
import { getAllItems, deleteItem, updateItem } from "@/lib/inventory";
import { Item } from "@/lib/types";
import { Search, ArrowUp, ArrowDown, Edit2, Trash2, Grid, List } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { toast } from "sonner";

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
                <TableHead className="w-[100px]">Akcie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.company}</TableCell>
                  <TableCell>{item.customer}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-[#47acc9]"
                        onClick={() => {
                          setEditingItem(item);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-[#47acc9]"
                        onClick={() => {
                          setDeletingItemId(item.id);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedAndFilteredItems.map((item) => (
            <div key={item.id} className="p-4 border rounded-lg space-y-2">
              <div className="font-medium">{item.code}</div>
              <div className="text-sm text-gray-500">
                <div>Množstvo: {item.quantity}</div>
                <div>Spoločnosť: {item.company}</div>
                <div>Zákazník: {item.customer}</div>
              </div>
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 hover:text-[#47acc9]"
                  onClick={() => {
                    setEditingItem(item);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Upraviť
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 hover:text-[#47acc9]"
                  onClick={() => {
                    setDeletingItemId(item.id);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Vymazať
                </Button>
              </div>
            </div>
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upraviť položku</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <Input
                placeholder="Kód"
                value={editingItem.code}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, code: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Množstvo"
                value={editingItem.quantity}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
              />
              <Input
                placeholder="Spoločnosť"
                value={editingItem.company}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, company: e.target.value })
                }
              />
              <Input
                placeholder="Zákazník"
                value={editingItem.customer}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, customer: e.target.value })
                }
              />
              <Button
                onClick={() => handleEdit(editingItem)}
                className="w-full bg-[#212490] hover:bg-[#47acc9]"
              >
                Uložiť
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};