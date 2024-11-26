import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart, Download } from "lucide-react";
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
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CustomerOrderPDF } from "../pdf/CustomerOrderPDF";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Štatistiky zakázok</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow">
          <div className="space-y-2 p-2">
            <Accordion type="single" collapsible className="space-y-2">
              {Object.entries(itemsByCustomer).map(([customerId, customerItems]) => {
                const customer = customers.find((c) => c.id === customerId);
                if (!customer) return null;

                const statusCounts = customerItems.reduce((acc, item) => {
                  if (!acc[item.status]) {
                    acc[item.status] = 0;
                  }
                  acc[item.status]++;
                  return acc;
                }, {} as Record<string, number>);

                return (
                  <AccordionItem 
                    key={customerId} 
                    value={customerId}
                    className="border rounded-lg bg-white"
                  >
                    <AccordionTrigger className="hover:no-underline px-3 py-2">
                      <div className="flex flex-col items-start space-y-1 w-full">
                        <div className="flex items-center justify-between w-full">
                          <h3 className="text-base font-medium">{customer.name}</h3>
                          <PDFDownloadLink
                            document={<CustomerOrderPDF customer={customer} items={customerItems} />}
                            fileName={`zakazka-${customer.name.toLowerCase()}.pdf`}
                            className="ml-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.success("Export PDF bol spustený");
                            }}
                          >
                            {({ loading }) => (
                              loading ? (
                                <Button variant="outline" size="icon" disabled>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                </Button>
                              ) : (
                                <Button variant="outline" size="icon">
                                  <Download className="h-4 w-4" />
                                </Button>
                              )
                            )}
                          </PDFDownloadLink>
                        </div>
                        <div className="flex flex-wrap gap-1">
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
                          {customerItems.map((item) => (
                            <div key={item.id} className="border rounded p-2 bg-gray-50 text-sm">
                              <div className="flex justify-between items-start gap-2">
                                <div className="space-y-0.5">
                                  <p className="font-medium">{item.code}</p>
                                  <p className="text-gray-600 text-xs">{item.description || "-"}</p>
                                  <p className="text-xs">
                                    Rozmery: {item.length && item.width && item.height
                                      ? `${item.length}×${item.width}×${item.height} cm`
                                      : "-"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {format(item.createdAt, "dd.MM.yyyy HH:mm")}
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