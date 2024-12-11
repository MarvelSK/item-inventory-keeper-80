import { Item } from "@/lib/types";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";

interface ScannedItemsListProps {
  items: Item[];
}

const STATUS_MAP = {
  waiting: { label: 'Čaká na dovoz', variant: 'warning' as const },
  in_stock: { label: 'Na sklade', variant: 'success' as const },
  in_transit: { label: 'V preprave', variant: 'warning' as const },
  delivered: { label: 'Doručené', variant: 'default' as const }
};

export const ScannedItemsList = ({ items }: ScannedItemsListProps) => {
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
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-card rounded-lg p-3 shadow-sm"
          >
            <div className="font-medium">{item.code}</div>
            <Badge variant={STATUS_MAP[item.status].variant}>
              {STATUS_MAP[item.status].label}
            </Badge>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};