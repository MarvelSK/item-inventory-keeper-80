import { Button } from "../ui/button";
import { BarChart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { customers } from "@/lib/inventory";

export const StatisticsDialog = () => {
  const totalCustomers = customers.filter(c => !c.deleted).length;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="hover:text-[#47acc9] w-full md:w-auto">
          <BarChart className="mr-2 h-4 w-4" />
          Štatistiky zakázok
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[625px] h-[90vh] md:h-[80vh]">
        <DialogHeader>
          <DialogTitle>Štatistiky zakázok</DialogTitle>
          <DialogDescription>
            Prehľad štatistík všetkých zakázok
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 h-[calc(90vh-180px)] md:h-[calc(80vh-180px)]">
          <div className="space-y-4 p-4">
            <div className="grid gap-4">
              <div className="bg-secondary p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Celkový počet zakázok</h3>
                <p className="text-3xl font-bold text-primary">{totalCustomers}</p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};