import { Item } from "@/lib/types";
import { useCustomers } from "@/hooks/useCustomers";
import { Badge } from "../ui/badge";
import { TagBadge } from "../tags/TagBadge";
import { Card } from "../ui/card";

interface ItemPreviewProps {
  item: Item | null;
}

const STATUS_MAP = {
  waiting: { label: 'Čaká na dovoz', variant: 'secondary' },
  in_stock: { label: 'Na sklade', variant: 'success' },
  in_transit: { label: 'V preprave', variant: 'warning' },
  delivered: { label: 'Doručené', variant: 'default' }
} as const;

export const ItemPreview = ({ item }: ItemPreviewProps) => {
  const { customers } = useCustomers();
  
  if (!item) return null;
  
  const customer = customers.find(c => c.id === item.customer);
  const statusInfo = STATUS_MAP[item.status];

  return (
    <Card className="p-4 mt-4 animate-fade-in">
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">Kód: {item.code}</h3>
            <p className="text-sm text-gray-500">Zákazník: {customer?.name || "Unknown"}</p>
          </div>
          <Badge variant={statusInfo.variant as any}>{statusInfo.label}</Badge>
        </div>
        
        {item.description && (
          <p className="text-sm text-gray-600">
            Popis: {item.description}
          </p>
        )}
        
        {(item.height || item.width || item.length) && (
          <p className="text-sm text-gray-600">
            Rozmery: {item.height && item.width && item.length
              ? `V:${item.height}×Š:${item.width}×D:${item.length} cm`
              : "-"}
          </p>
        )}
        
        {customer?.tags && customer.tags.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Štítky zákazníka:</p>
            <div className="flex flex-wrap gap-1">
              {customer.tags.map((tag) => (
                <TagBadge key={tag.id} tag={tag} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};