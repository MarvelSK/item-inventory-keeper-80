import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
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
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table";
import { customers, companies, addCustomer, deleteCustomer } from "@/lib/inventory";
import { Trash2, Edit2 } from "lucide-react";
import { EditCustomerForm } from "./EditCustomerForm";
import { toast } from "sonner";

export const CustomerDialog = () => {
  const [customerName, setCustomerName] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<null | { id: string; name: string; companyId: string }>(null);
  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleAddCustomer = () => {
    if (!customerName.trim() || !selectedCompany) {
      toast.error("Vyplňte všetky polia");
      return;
    }
    addCustomer(customerName, selectedCompany);
    setCustomerName("");
    setSelectedCompany("");
    toast.success("Zákazník bol pridaný");
  };

  const handleEditCustomer = (customer: { id: string; name: string; companyId: string }) => {
    // TODO: Implement customer edit API
    setIsEditDialogOpen(false);
    toast.success("Zákazník bol upravený");
  };

  const handleDeleteCustomer = () => {
    if (deletingCustomerId) {
      deleteCustomer(deletingCustomerId);
      setDeletingCustomerId(null);
      setIsDeleteDialogOpen(false);
      toast.success("Zákazník bol vymazaný");
    }
  };

  return (
    <>
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
                            setEditingCustomer(customer);
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
                            setDeletingCustomerId(customer.id);
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
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upraviť zákazníka</DialogTitle>
          </DialogHeader>
          {editingCustomer && (
            <EditCustomerForm customer={editingCustomer} onSave={handleEditCustomer} />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Vymazať zákazníka</AlertDialogTitle>
            <AlertDialogDescription>
              Naozaj chcete vymazať tohto zákazníka? Táto akcia sa nedá vrátiť späť.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCustomer}>Vymazať</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};