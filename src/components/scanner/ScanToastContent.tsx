import { Customer, Item } from "@/lib/types";
import { TagBadge } from "../tags/TagBadge";

interface ScanToastContentProps {
  item: Item;
  customer: Customer;
}

export const ScanToastContent = ({ item, customer }: ScanToastContentProps) => {
  return (
    <div className="space-y-2">
      <p className="font-medium">Zakázka: {item.code}</p>
      <p>{customer.name}</p>
      <div className="flex flex-wrap gap-1">
        {customer.tags.map((tag) => (
          <TagBadge key={tag.id} tag={tag} />
        ))}
      </div>
    </div>
  );
};