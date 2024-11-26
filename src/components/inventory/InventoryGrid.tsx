import { Item } from "@/lib/types";
import { InventoryGridItem } from "./InventoryGridItem";

interface InventoryGridProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
  onPostpone: (item: Item) => void;
}

export const InventoryGrid = ({ items, onEdit, onDelete, onPostpone }: InventoryGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <InventoryGridItem
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onPostpone={onPostpone}
        />
      ))}
    </div>
  );
};