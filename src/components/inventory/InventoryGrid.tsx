import { Item } from "@/lib/types";
import { InventoryGridItem } from "./InventoryGridItem";

interface InventoryGridProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

export const InventoryGrid = ({ items, onEdit, onDelete }: InventoryGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <InventoryGridItem
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};