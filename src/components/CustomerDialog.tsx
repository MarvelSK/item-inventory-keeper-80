import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
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
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table";
import { customers, addCustomer, deleteCustomer } from "@/lib/inventory";
import { Trash2, Edit2 } from "lucide-react";
import { EditCustomerForm } from "./EditCustomerForm";
import { toast } from "sonner";
import { ScrollArea } from "./ui/scroll-area";

interface CustomerDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CustomerDialog = ({ open, onOpenChange }: CustomerDialogProps) => {
  const [customerName, setCustomerName] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<null | Customer>(null);
  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);

  const actualOpen = open !== undefined ? open : isMainDialogOpen;
  const handleOpenChange = onOpenChange || setIsMainDialogOpen;

  const handleAddCustomer = () => {
    if (!customerName.trim()) {
      toast.error("Vyplňte meno zákazníka");
      return;
    }
    addCustomer(customerName);
    setCustomerName("");
    toast.success("Zákazník bol pridaný");
  };

  const handleEditCustomer = (customer: Customer) => {
    const customerToUpdate = customers.find(c => c.id === customer.id);
    if (customerToUpdate) {
      customerToUpdate.name = customer.name;
      customerToUpdate.labels = customer.labels;
      setIsEditDialogOpen(false);
      toast.success("Zákazník bol upravený");
    }
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
      <Dialog open={actualOpen} onOpenChange={handleOpenChange}>
        {!onOpenChange && (
          <DialogTrigger asChild>
            <Button variant="outline" className="hover:text-[#47acc9] w-full md:w-auto">
              Správa zákazníkov
            </Button>
          </DialogTrigger>
        )}
        <DialogContent className="w-[95vw] max-w-[625px] h-[90vh] md:h-auto">
          <DialogHeader>
            <DialogTitle>Správa zákazníkov</DialogTitle>
            <DialogDescription>
              Pridajte, upravte alebo vymažte zákazníkov
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[calc(90vh-180px)] md:h-auto">
            <div className="space-y-4 p-1">
              <div className="flex flex-col md:flex-row gap-2">
                <Input
                  placeholder="Meno zákazníka"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleAddCustomer} 
                  className="bg-[#212490] hover:bg-[#47acc9] w-full md:w-auto"
                >
                  Pridať
                </Button>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Meno</TableHead>
                      <TableHead>Štítky</TableHead>
                      <TableHead className="w-[100px]">Akcie</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.filter(c => !c.deleted).map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {customer.labels?.map((label) => (
                              <LabelBadge key={label.id} label={label} />
                            ))}
                          </div>
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
                              className="hover:text-red-500"
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
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upraviť zákazníka</DialogTitle>
            <DialogDescription>
              Upravte údaje zákazníka
            </DialogDescription>
          </DialogHeader>
          {editingCustomer && (
            <EditCustomerForm customer={editingCustomer} onSave={handleEditCustomer} />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="w-[95vw] max-w-[425px]">
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
