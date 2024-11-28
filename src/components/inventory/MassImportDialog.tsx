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
import { importItems } from "@/lib/services/massImportService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Progress } from "../ui/progress";
import { useQueryClient } from "@tanstack/react-query";

export const MassImportDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<string>("");
  const queryClient = useQueryClient();

  const handleImport = async () => {
    try {
      setIsLoading(true);
      setProgress(0);
      setStage("");
      
      let items;
      try {
        items = JSON.parse(data);
        if (!Array.isArray(items)) {
          throw new Error("Data must be an array of items");
        }
      } catch (e) {
        toast.error("Invalid JSON format");
        return;
      }

      await importItems(items);
      
      // Refresh inventory list after successful import
      await queryClient.invalidateQueries({ queryKey: ['items'] });
      
      setIsOpen(false);
      setData("");
      toast.success("Import completed successfully");
    } catch (error) {
      console.error('Import failed:', error);
      toast.error("Error importing items");
    } finally {
      setIsLoading(false);
      setProgress(0);
      setStage("");
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
          {isLoading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>{stage}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
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