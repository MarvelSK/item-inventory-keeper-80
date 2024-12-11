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
import { SlidersVertical, Loader2 } from "lucide-react";
import { EditCustomerForm } from "./EditCustomerForm";
import { toast } from "sonner";
import { ScrollArea } from "./ui/scroll-area";
import { Customer } from "@/lib/types";
import { useCustomers } from "@/hooks/useCustomers";
import { CustomerTable } from "./customers/CustomerTable";

interface CustomerDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CustomerDialog = ({ open, onOpenChange }: CustomerDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<null | Customer>(null);
  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);

  const { customers, isLoading, addCustomer, updateCustomer, deleteCustomer } = useCustomers();

  const actualOpen = open !== undefined ? open : isMainDialogOpen;
  const handleOpenChange = onOpenChange || setIsMainDialogOpen;

  const handleAddCustomer = async () => {
    if (!searchTerm.trim()) {
      toast.error("Vyplňte názov zakázky");
      return;
    }
    await addCustomer(searchTerm);
    setSearchTerm("");
  };

  const handleEditCustomer = async (customer: Customer) => {
    await updateCustomer(customer);
    setIsEditDialogOpen(false);
  };

  const handleDeleteCustomer = async () => {
    if (deletingCustomerId) {
      await deleteCustomer(deletingCustomerId);
      setDeletingCustomerId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Dialog open={actualOpen} onOpenChange={handleOpenChange}>
        {!onOpenChange && (
          <DialogTrigger asChild>
            <Button variant="outline" className="hover:text-[#47acc9] w-full md:w-auto">
              <SlidersVertical className="mr-2 h-4 w-4" />
              Správa zakázok
            </Button>
          </DialogTrigger>
        )}
        <DialogContent className="w-[95vw] max-w-[625px] h-[90vh] md:h-[80vh]">
          <DialogHeader className="text-center md:text-left">
            <DialogTitle>Správa zakázok</DialogTitle>
            <DialogDescription>
              Pridajte, upravte alebo vymažte zakázky
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 h-[calc(90vh-180px)] md:h-[calc(80vh-180px)]">
            <div className="space-y-4 p-1">
              <div className="flex flex-col md:flex-row gap-2">
                <Input
                  placeholder="Vyhľadať alebo pridať zakázku"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleAddCustomer} 
                  className="bg-[#212490] hover:bg-[#47acc9] w-full md:w-auto"
                >
                  Pridať
                </Button>
              </div>
              <CustomerTable 
                customers={filteredCustomers}
                onEdit={(customer) => {
                  setEditingCustomer(customer);
                  setIsEditDialogOpen(true);
                }}
                onDelete={(id) => {
                  setDeletingCustomerId(id);
                  setIsDeleteDialogOpen(true);
                }}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upraviť zakázku</DialogTitle>
            <DialogDescription>
              Upravte údaje zakázky
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
            <AlertDialogTitle>Vymazať zakázku</AlertDialogTitle>
            <AlertDialogDescription>
              Naozaj chcete vymazať túto zakázku? Táto akcia sa nedá vrátiť späť.
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