import { Item } from "@/lib/types";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { useCustomers } from "@/hooks/useCustomers";

interface ScannedItemsListProps {
  items: Item[];
}

const STATUS_MAP = {
  waiting: { label: 'Čaká na dovoz', variant: 'destructive' as const },
  in_stock: { label: 'Na sklade', variant: 'secondary' as const },
  in_transit: { label: 'V preprave', variant: 'outline' as const },
  delivered: { label: 'Doručené', variant: 'default' as const }
};

export const ScannedItemsList = ({ items }: ScannedItemsListProps) => {
  const { customers } = useCustomers();

  if (!items.length) {
    return (
      <div className="text-center text-muted-foreground p-4">
        Zatiaľ neboli naskenované žiadne položky
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(50vh-2rem)] rounded-md border">
      <div className="space-y-2 p-4">
        {items.map((item) => {
          const customer = customers.find(c => c.id === item.customer);
          const tags = customer?.tags || [];

          return (
            <div
              key={item.id}
              className="flex flex-col bg-card rounded-lg p-3 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="font-medium">{item.code}</div>
                <Badge variant={STATUS_MAP[item.status].variant}>
                  {STATUS_MAP[item.status].label}
                </Badge>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="text-xs py-0"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};