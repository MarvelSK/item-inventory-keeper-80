import { Item } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface InventoryStatsProps {
  items: Item[];
}

export const InventoryStats = ({ items }: InventoryStatsProps) => {
  const totalItems = items.length;
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Celkový počet položiek</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalItems}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Celkové množstvo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalQuantity}</div>
        </CardContent>
      </Card>
    </div>
  );
};