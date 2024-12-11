import { Item } from "@/lib/types";
import { ScrollArea } from "../ui/scroll-area";
import { format } from "date-fns";

interface ScannedItemsListProps {
  items: Item[];
}

export const ScannedItemsList = ({ items }: ScannedItemsListProps) => {
  if (!items.length) {
    return (
      <div className="text-center text-muted-foreground p-4">
        No items scanned yet
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
            <div>
              <p className="font-medium">{item.code}</p>
              <p className="text-sm text-muted-foreground">
                Status: {item.status}
              </p>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              {format(new Date(item.updatedAt), "HH:mm:ss")}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};