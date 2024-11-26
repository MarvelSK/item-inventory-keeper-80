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
                <div key={customerId} className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">{customer.name}</h3>
                  <div className="grid gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Celkový počet položiek: {customerItems.length}</p>
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
                    <div className="text-sm">
                      <p><strong>Celková dĺžka:</strong> {dimensionsStats.totalLength} cm</p>
                      <p><strong>Celková šírka:</strong> {dimensionsStats.totalWidth} cm</p>
                      <p><strong>Celková výška:</strong> {dimensionsStats.totalHeight} cm</p>
                    </div>
                    {customer.tags && customer.tags.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-1">Štítky:</p>
                        <div className="flex flex-wrap gap-1">
                          {customer.tags.map((tag) => (
                            <Badge key={tag.id} style={{ backgroundColor: tag.color }}>
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};