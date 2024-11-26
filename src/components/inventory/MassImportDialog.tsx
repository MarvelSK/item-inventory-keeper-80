import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { importMassItems } from "@/lib/services/massImportService";
import { toast } from "sonner";

export const MassImportDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState("");

  const handleImport = async () => {
    try {
      await importMassItems(data);
      toast.success("Položky boli úspešne importované");
      setIsOpen(false);
      setData("");
    } catch (error) {
      console.error('Import failed:', error);
      toast.error("Chyba pri importe položiek");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full sm:w-auto hover:text-[#47acc9]"
        >
          Hromadný import
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Hromadný import položiek</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Vložte dáta pre import..."
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="min-h-[300px]"
          />
          <Button 
            onClick={handleImport}
            className="w-full bg-[#212490] hover:bg-[#47acc9]"
          >
            Importovať
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};