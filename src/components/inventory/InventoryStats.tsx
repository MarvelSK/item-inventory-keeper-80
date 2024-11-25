import { Item } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface InventoryStatsProps {
  items: Item[];
}

export const InventoryStats = ({ items }: InventoryStatsProps) => {
  // Calculate total counts and quantities
  const totalItems = items.length;
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate per-customer statistics
  const customerStats = items.reduce((acc, item) => {
    if (!acc[item.customer]) {
      acc[item.customer] = {
        itemCount: 0,
        totalQuantity: 0,
      };
    }
    acc[item.customer].itemCount += 1;
    acc[item.customer].totalQuantity += item.quantity;
    return acc;
  }, {} as Record<string, { itemCount: number; totalQuantity: number }>);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Štatistiky podľa zakázok</CardTitle>
        </CardHeader>
        <CardContent className="max-h-[150px] overflow-y-auto">
          <div className="space-y-2">
            {Object.entries(customerStats).map(([customer, stats]) => (
              <div key={customer} className="flex justify-between items-center text-sm">
                <span className="font-medium">{customer}</span>
                <span className="text-muted-foreground">
                  {stats.itemCount} položiek ({stats.totalQuantity} ks)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};