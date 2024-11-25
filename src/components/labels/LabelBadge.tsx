import { Label } from "@/lib/types";
import { Badge } from "../ui/badge";

interface LabelBadgeProps {
  label: Label;
  onRemove?: () => void;
}

export const LabelBadge = ({ label, onRemove }: LabelBadgeProps) => {
  return (
    <Badge
      style={{ backgroundColor: label.color }}
      className="mr-1 mb-1"
      variant="secondary"
    >
      {label.name}
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