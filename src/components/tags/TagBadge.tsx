import { Tag } from "@/lib/types";
import { Badge } from "../ui/badge";

interface TagBadgeProps {
  tag: Tag;
  onRemove?: () => void;
}

export const TagBadge = ({ tag, onRemove }: TagBadgeProps) => {
  return (
    <Badge
      style={{ backgroundColor: tag.color }}
      className="mr-1 mb-1"
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