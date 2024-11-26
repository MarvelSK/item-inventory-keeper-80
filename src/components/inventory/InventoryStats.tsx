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
    <div className="flex gap-2 overflow-x-auto pb-2">
      <Card className="min-w-[120px] flex-shrink-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2">
          <CardTitle className="text-xs font-medium">
            <Badge variant="secondary" className="text-xs">
              Celkom
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 pt-0">
          <div className="text-2xl font-bold text-gray-900 tracking-tight">
            {totalItems}
          </div>
        </CardContent>
      </Card>
      
      {Object.entries(STATUS_MAP).map(([status, info]) => (
        <Card key={status} className="min-w-[120px] flex-shrink-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2">
            <CardTitle className="text-xs font-medium">
              <Badge variant={info.variant as any} className="text-xs">
                {info.label}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0">
            <div className="text-2xl font-bold text-gray-900 tracking-tight">
              {statusCounts[status] || 0}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};