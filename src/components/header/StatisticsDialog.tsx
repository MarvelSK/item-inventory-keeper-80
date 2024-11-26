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
import { customers } from "@/lib/inventory";
import { Badge } from "../ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from "date-fns";

export const StatisticsDialog = () => {
  const { items } = useItems();

  // Group items by customer
  const itemsByCustomer = items.reduce((acc, item) => {
    if (!acc[item.customer]) {
      acc[item.customer] = [];
    }
    acc[item.customer].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  const STATUS_MAP = {
    waiting: { label: 'Čaká na dovoz', variant: 'secondary' },
    in_stock: { label: 'Na sklade', variant: 'success' },
    in_transit: { label: 'V preprave', variant: 'warning' },
    delivered: { label: 'Doručené', variant: 'default' }
  } as const;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="ml-2">
          <BarChart className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Štatistiky zakázok</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow">
          <div className="space-y-6 p-4">
            <Accordion type="single" collapsible className="space-y-4">
              {Object.entries(itemsByCustomer).map(([customerId, customerItems]) => {
                const customer = customers.find((c) => c.id === customerId);
                if (!customer) return null;

                // Count items by status
                const statusCounts = customerItems.reduce((acc, item) => {
                  if (!acc[item.status]) {
                    acc[item.status] = 0;
                  }
                  acc[item.status]++;
                  return acc;
                }, {} as Record<string, number>);

                // Calculate dimensions statistics
                const dimensionsStats = customerItems.reduce(
                  (acc, item) => {
                    if (item.length) acc.totalLength += item.length;
                    if (item.width) acc.totalWidth += item.width;
                    if (item.height) acc.totalHeight += item.height;
                    return acc;
                  },
                  { totalLength: 0, totalWidth: 0, totalHeight: 0 }
                );

                return (
                  <AccordionItem 
                    key={customerId} 
                    value={customerId}
                    className="border rounded-lg p-4 bg-white"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex flex-col items-start space-y-2 w-full">
                        <h3 className="text-lg font-semibold">{customer.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(statusCounts).map(([status, count]) => (
                            <Badge 
                              key={status} 
                              variant={STATUS_MAP[status as keyof typeof STATUS_MAP].variant as any}
                            >
                              {STATUS_MAP[status as keyof typeof STATUS_MAP].label}: {count}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="mt-4 space-y-4">
                        <div className="text-sm">
                          <p><strong>Celková dĺžka:</strong> {dimensionsStats.totalLength} cm</p>
                          <p><strong>Celková šírka:</strong> {dimensionsStats.totalWidth} cm</p>
                          <p><strong>Celková výška:</strong> {dimensionsStats.totalHeight} cm</p>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium">Položky:</h4>
                          <div className="space-y-2">
                            {customerItems.map((item) => (
                              <div key={item.id} className="border rounded p-3 bg-gray-50">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">{item.code}</p>
                                    <p className="text-sm text-gray-600">{item.description || "-"}</p>
                                    <p className="text-sm">
                                      Rozmery: {item.length && item.width && item.height
                                        ? `${item.length}×${item.width}×${item.height} cm`
                                        : "-"}
                                    </p>
                                    <p className="text-sm">
                                      Vytvorené: {format(item.createdAt, "dd.MM.yyyy HH:mm")}
                                    </p>
                                  </div>
                                  <Badge variant={STATUS_MAP[item.status].variant as any}>
                                    {STATUS_MAP[item.status].label}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
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