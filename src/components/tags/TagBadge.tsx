import { Tag } from "@/lib/types";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface TagBadgeProps {
  tag: Tag;
  onRemove?: () => void;
  className?: string;
}

export const TagBadge = ({ tag, onRemove, className }: TagBadgeProps) => {
  return (
    <Badge
      style={{ backgroundColor: tag.color }}
      className={cn("mr-1 mb-1", className)}
      variant="secondary"
    >
      {tag.name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:text-red-500"
        >
          ×
        </button>
      )}
    </Badge>
  );
};