import { Item } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

interface InventoryStatsProps {
  items: Item[];
}

const STATUS_MAP = {
  waiting: { label: 'Čaká na dovoz', variant: 'secondary' },
  in_stock: { label: 'Na sklade', variant: 'success' },
  in_transit: { label: 'V preprave', variant: 'warning' },
  delivered: { label: 'Doručené', variant: 'default' }
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Celkový počet položiek</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalItems}</div>
        </CardContent>
      </Card>
      
      {Object.entries(STATUS_MAP).map(([status, info]) => (
        <Card key={status}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Badge variant={info.variant as any} className="ml-1">
                {info.label}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statusCounts[status] || 0}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};