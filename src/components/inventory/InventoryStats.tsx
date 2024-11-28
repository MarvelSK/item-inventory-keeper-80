import { Item } from "@/lib/types";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

interface InventoryStatsProps {
  items: Item[];
}

const STATUS_MAP = {
  waiting: { label: 'Čaká na dovoz', variant: 'warning' as const },
  in_stock: { label: 'Na sklade', variant: 'secondary' as const },
  in_transit: { label: 'V preprave', variant: 'warning' as const },
  delivered: { label: 'Doručené', variant: 'default' as const }
} as const;

export const InventoryStats = ({ items }: InventoryStatsProps) => {
  const totalItems = items.length;
  
  const statusCounts = items.reduce((acc, item) => {
    if (!acc[item.status]) {
      acc[item.status] = 0;
    }
    acc[item.status]++;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
      <Card className="col-span-1">
        <CardContent className="p-2 flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            Celkom
          </Badge>
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {totalItems}
          </span>
        </CardContent>
      </Card>
      
      {Object.entries(STATUS_MAP).map(([status, info]) => (
        <Card key={status} className="col-span-1">
          <CardContent className="p-2 flex items-center justify-between">
            <Badge variant={info.variant} className="text-xs">
              {info.label}
            </Badge>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {statusCounts[status] || 0}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};