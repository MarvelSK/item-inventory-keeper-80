import { useState } from "react";
import { Input } from "./ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table";
import { getAllItems } from "@/lib/inventory";
import { Item } from "@/lib/types";
import { Search, ArrowUp, ArrowDown } from "lucide-react";

export const InventoryList = () => {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof Item>("code");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [items] = useState(getAllItems());

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

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Vyhľadať položky..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.company}</TableCell>
                <TableCell>{item.customer}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};