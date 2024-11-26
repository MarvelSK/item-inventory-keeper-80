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
import { Loader2 } from "lucide-react";

export const MassImportDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = async () => {
    try {
      setIsLoading(true);
      await importMassItems(data);
      setIsOpen(false);
      setData("");
    } catch (error) {
      console.error('Import failed:', error);
      toast.error("Chyba pri importe položiek");
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
          />
          <Button 
            onClick={handleImport}
            className="w-full bg-[#212490] hover:bg-[#47acc9]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importujem...
              </>
            ) : (
              'Importovať'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};