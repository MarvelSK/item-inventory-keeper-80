import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart } from "lucide-react";
import { useItems } from "@/hooks/useItems";
import { useCustomers } from "@/hooks/useCustomers";
import { Badge } from "../ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from "date-fns";
import { BatchExportDialog } from "../pdf/BatchExportDialog";

interface StatisticsDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export const StatisticsDialog = ({ open, onOpenChange, trigger }: StatisticsDialogProps) => {
  const { items } = useItems();
  const { customers } = useCustomers();

  // Group items by customer
  const itemsByCustomer = items.reduce((acc, item) => {
    if (!acc[item.customer]) {
      acc[item.customer] = [];
    }
    acc[item.customer].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  const customerOrders = Object.entries(itemsByCustomer).map(([customerId, items]) => {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return null;
    return { customer, items };
  }).filter((order): order is NonNullable<typeof order> => order !== null);

  const STATUS_MAP = {
    waiting: { label: 'Čaká na dovoz', variant: 'secondary' },
    in_stock: { label: 'Na sklade', variant: 'success' },
    in_transit: { label: 'V preprave', variant: 'warning' },
    delivered: { label: 'Doručené', variant: 'default' }
  } as const;

  const totalOrders = customerOrders.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="icon" className="hidden md:inline-flex ml-2">
            <BarChart className="h-5 w-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-2xl h-[90vh] md:h-[80vh]">
        <DialogHeader>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <DialogTitle>Štatistiky zakázok</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Celkový počet zakázok: {totalOrders}
              </p>
            </div>
            <BatchExportDialog customerOrders={customerOrders} />
          </div>
        </DialogHeader>
        <ScrollArea className="flex-1 h-[calc(90vh-100px)] md:h-[calc(80vh-100px)]">
          <div className="space-y-2 p-2">
            <Accordion type="single" collapsible className="space-y-2">
              {customerOrders.map(({ customer, items }) => {
                const statusCounts = items.reduce((acc, item) => {
                  if (!acc[item.status]) {
                    acc[item.status] = 0;
                  }
                  acc[item.status]++;
                  return acc;
                }, {} as Record<string, number>);

                return (
                  <AccordionItem 
                    key={customer.id} 
                    value={customer.id}
                    className="border rounded-lg bg-white"
                  >
                    <AccordionTrigger className="hover:no-underline px-3 py-2">
                      <div className="flex flex-col items-center md:items-start space-y-1 w-full">
                        <div className="flex items-center justify-between w-full">
                          <h3 className="text-base font-medium">{customer.name}</h3>
                        </div>
                        <div className="flex flex-wrap gap-1 justify-center md:justify-start">
                          {Object.entries(statusCounts).map(([status, count]) => (
                            <Badge 
                              key={status} 
                              variant={STATUS_MAP[status as keyof typeof STATUS_MAP].variant as any}
                              className="text-xs px-2 py-0"
                            >
                              {STATUS_MAP[status as keyof typeof STATUS_MAP].label}: {count}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="px-3 pb-3 space-y-2">
                        <div className="space-y-2">
                          {items.map((item) => (
                            <div key={item.id} className="border rounded p-2 bg-gray-50 text-sm">
                              <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-2">
                                <div className="space-y-0.5 text-center md:text-left">
                                  <p className="font-medium">{item.code}</p>
                                  <p className="text-gray-600 text-xs">{item.description || "-"}</p>
                                  <p className="text-xs">
                                    Rozmery: {item.length && item.width && item.height
                                      ? `${item.length}×${item.width}×${item.height} cm`
                                      : "-"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {format(new Date(item.createdAt), "dd.MM.yyyy HH:mm")}
                                  </p>
                                </div>
                                <Badge 
                                  variant={STATUS_MAP[item.status].variant as any}
                                  className="text-xs whitespace-nowrap"
                                >
                                  {STATUS_MAP[item.status].label}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};