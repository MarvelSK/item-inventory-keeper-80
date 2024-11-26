import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileDown } from "lucide-react";
import { useState } from "react";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CustomerOrderPDF } from "./CustomerOrderPDF";
import { Customer, Item } from "@/lib/types";
import { toast } from "sonner";

interface BatchExportDialogProps {
  customerOrders: { customer: Customer; items: Item[] }[];
}

export const BatchExportDialog = ({ customerOrders }: BatchExportDialogProps) => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [template, setTemplate] = useState<"default" | "compact">("default");

  const handleSelectOrder = (customerId: string) => {
    setSelectedOrders(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const selectedOrdersData = customerOrders.filter(
    order => selectedOrders.includes(order.customer.id)
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="ml-2">
          <FileDown className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Hromadný export zakázok</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            {customerOrders.map(({ customer }) => (
              <div key={customer.id} className="flex items-center space-x-2">
                <Checkbox
                  id={customer.id}
                  checked={selectedOrders.includes(customer.id)}
                  onCheckedChange={() => handleSelectOrder(customer.id)}
                />
                <label htmlFor={customer.id} className="text-sm font-medium">
                  {customer.name}
                </label>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <PDFDownloadLink
              document={
                <CustomerOrderPDF 
                  orders={selectedOrdersData}
                  template={template}
                />
              }
              fileName={`zakazky-${new Date().toISOString()}.pdf`}
              onClick={() => {
                if (selectedOrders.length === 0) {
                  toast.error("Vyberte aspoň jednu zakázku");
                  return;
                }
                toast.success("Export PDF bol spustený");
              }}
            >
              <Button 
                variant="default" 
                disabled={selectedOrders.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportovať ({selectedOrders.length})
              </Button>
            </PDFDownloadLink>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};