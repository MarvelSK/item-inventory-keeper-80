import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "@/lib/types";
import { LabelBadge } from "./LabelBadge";
import { ChromePicker } from "react-color";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { toast } from "sonner";

interface LabelManagerProps {
  labels: Label[];
  onLabelsChange: (labels: Label[]) => void;
}

export const LabelManager = ({ labels, onLabelsChange }: LabelManagerProps) => {
  const [newLabelName, setNewLabelName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#3B82F6");

  const handleAddLabel = () => {
    if (!newLabelName.trim()) {
      toast.error("Please enter a label name");
      return;
    }

    const newLabel: Label = {
      id: Math.random().toString(36).substr(2, 9),
      name: newLabelName.trim(),
      color: selectedColor,
    };

    onLabelsChange([...labels, newLabel]);
    setNewLabelName("");
    toast.success("Label added successfully");
  };

  const handleRemoveLabel = (labelId: string) => {
    onLabelsChange(labels.filter((label) => label.id !== labelId));
    toast.success("Label removed successfully");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Label name"
          value={newLabelName}
          onChange={(e) => setNewLabelName(e.target.value)}
          className="flex-1"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-[100px]"
              style={{ backgroundColor: selectedColor }}
            >
              Color
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <ChromePicker
              color={selectedColor}
              onChange={(color) => setSelectedColor(color.hex)}
            />
          </PopoverContent>
        </Popover>
        <Button onClick={handleAddLabel}>Add</Button>
      </div>
      <div className="flex flex-wrap gap-1">
        {labels.map((label) => (
          <LabelBadge
            key={label.id}
            label={label}
            onRemove={() => handleRemoveLabel(label.id)}
          />
        ))}
      </div>
    </div>
  );
};