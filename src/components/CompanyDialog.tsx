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
import { companies, addCompany, deleteCompany } from "@/lib/inventory";
import { Trash2, Edit2 } from "lucide-react";
import { EditCompanyForm } from "./EditCompanyForm";
import { toast } from "sonner";
import { ScrollArea } from "./ui/scroll-area";

export const CompanyDialog = () => {
  const [companyName, setCompanyName] = useState("");
  const [editingCompany, setEditingCompany] = useState<null | { id: string; name: string }>(null);
  const [deletingCompanyId, setDeletingCompanyId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);

  const handleAddCompany = () => {
    if (!companyName.trim()) {
      toast.error("Vyplňte názov spoločnosti");
      return;
    }
    addCompany(companyName);
    setCompanyName("");
    toast.success("Spoločnosť bola pridaná");
  };

  const handleEditCompany = (company: { id: string; name: string }) => {
    const companyToUpdate = companies.find(c => c.id === company.id);
    if (companyToUpdate) {
      companyToUpdate.name = company.name;
      setIsEditDialogOpen(false);
      toast.success("Spoločnosť bola upravená");
    }
  };

  const handleDeleteCompany = () => {
    if (deletingCompanyId) {
      deleteCompany(deletingCompanyId);
      setDeletingCompanyId(null);
      setIsDeleteDialogOpen(false);
      toast.success("Spoločnosť bola vymazaná");
    }
  };

  return (
    <>
      <Dialog open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="hover:text-[#47acc9] w-full md:w-auto">
            Správa spoločností
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[95vw] max-w-[625px] h-[90vh] md:h-auto">
          <DialogHeader>
            <DialogTitle>Správa spoločností</DialogTitle>
            <DialogDescription>
              Pridajte, upravte alebo vymažte spoločnosti
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[calc(90vh-180px)] md:h-auto">
            <div className="space-y-4 p-1">
              <div className="flex flex-col md:flex-row gap-2">
                <Input
                  placeholder="Názov spoločnosti"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleAddCompany} 
                  className="bg-[#212490] hover:bg-[#47acc9] w-full md:w-auto"
                >
                  Pridať
                </Button>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Názov</TableHead>
                      <TableHead className="w-[100px]">Akcie</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companies.filter(c => !c.deleted).map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">{company.name}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:text-[#47acc9]"
                              onClick={() => {
                                setEditingCompany(company);
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
                                setDeletingCompanyId(company.id);
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
            <DialogTitle>Upraviť spoločnosť</DialogTitle>
            <DialogDescription>
              Upravte názov spoločnosti
            </DialogDescription>
          </DialogHeader>
          {editingCompany && (
            <EditCompanyForm company={editingCompany} onSave={handleEditCompany} />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="w-[95vw] max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Vymazať spoločnosť</AlertDialogTitle>
            <AlertDialogDescription>
              Naozaj chcete vymazať túto spoločnosť? Táto akcia sa nedá vrátiť späť.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCompany}>Vymazať</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};