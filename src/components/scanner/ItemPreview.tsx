import { Item } from "@/lib/types";
import { useCustomers } from "@/hooks/useCustomers";
import { Badge } from "../ui/badge";
import { TagBadge } from "../tags/TagBadge";
import { Card } from "../ui/card";

interface ItemPreviewProps {
  item: Item | null;
}

const STATUS_MAP = {
  waiting: { label: 'Čaká na dovoz', variant: 'warning' },
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
    <Card className="bg-black/40 backdrop-blur-sm border-0 text-white animate-fade-in">
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-white/90">Kód: {item.code}</h3>
            <p className="text-sm text-white/70">Zákazník: {customer?.name || "Unknown"}</p>
          </div>
          <Badge 
            variant={statusInfo.variant as any}
            className="bg-white/10 backdrop-blur-sm text-white"
          >
            {statusInfo.label}
          </Badge>
        </div>
        
        {item.description && (
          <p className="text-sm text-white/70">
            Popis: {item.description}
          </p>
        )}
        
        {customer?.tags && customer.tags.length > 0 && (
          <div>
            <p className="text-sm text-white/70 mb-1">Štítky zákazníka:</p>
            <div className="flex flex-wrap gap-1">
              {customer.tags.map((tag) => (
                <TagBadge 
                  key={tag.id} 
                  tag={tag}
                  className="bg-white/10 text-white backdrop-blur-sm" 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};