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
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table";
import { companies } from "@/lib/inventory";
import { Trash2, Edit2 } from "lucide-react";

export const CompanyDialog = () => {
  const [companyName, setCompanyName] = useState("");

  const handleAddCompany = () => {
    // TODO: Implement company creation
    setCompanyName("");
  };

  return (
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
                          // TODO: Implement company edit
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-[#47acc9]"
                        onClick={() => {
                          // TODO: Implement company deletion
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