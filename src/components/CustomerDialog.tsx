import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table";
import { customers, companies } from "@/lib/inventory";
import { Trash2, Edit2 } from "lucide-react";

export const CustomerDialog = () => {
  const [customerName, setCustomerName] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");

  const handleAddCustomer = () => {
    // TODO: Implement customer creation
    setCustomerName("");
    setSelectedCompany("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="hover:text-[#47acc9]">
          Správa zákazníkov
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Správa zákazníkov</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Meno zákazníka"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Vybrať spoločnosť" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddCustomer} className="bg-[#212490] hover:bg-[#47acc9]">
              Pridať
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Meno</TableHead>
                <TableHead>Spoločnosť</TableHead>
                <TableHead className="w-[100px]">Akcie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>
                    {companies.find((c) => c.id === customer.companyId)?.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-[#47acc9]"
                        onClick={() => {
                          // TODO: Implement customer edit
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-[#47acc9]"
                        onClick={() => {
                          // TODO: Implement customer deletion
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
      </DialogContent>
    </Dialog>
  );
};