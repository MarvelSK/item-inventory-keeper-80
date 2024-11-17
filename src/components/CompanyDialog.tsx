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
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table";
import { companies, addCompany, deleteCompany } from "@/lib/inventory";
import { Trash2, Edit2 } from "lucide-react";
import { EditCompanyForm } from "./EditCompanyForm";
import { toast } from "sonner";

export const CompanyDialog = () => {
  const [companyName, setCompanyName] = useState("");
  const [editingCompany, setEditingCompany] = useState<null | { id: string; name: string }>(null);
  const [deletingCompanyId, setDeletingCompanyId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
    // TODO: Implement company edit API
    setIsEditDialogOpen(false);
    toast.success("Spoločnosť bola upravená");
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
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="hover:text-[#47acc9]">
            Správa spoločností
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Správa spoločností</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Názov spoločnosti"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
              <Button onClick={handleAddCompany} className="bg-[#212490] hover:bg-[#47acc9]">
                Pridať
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Názov</TableHead>
                  <TableHead className="w-[100px]">Akcie</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>{company.name}</TableCell>
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
                          className="hover:text-[#47acc9]"
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
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upraviť spoločnosť</DialogTitle>
          </DialogHeader>
          {editingCompany && (
            <EditCompanyForm company={editingCompany} onSave={handleEditCompany} />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
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