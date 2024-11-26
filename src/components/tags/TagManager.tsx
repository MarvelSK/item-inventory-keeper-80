import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { Tag } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChromePicker } from "react-color";
import { TagBadge } from "./TagBadge";

interface TagManagerProps {
  tags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
}

export const TagManager = ({ tags, onTagsChange }: TagManagerProps) => {
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#3B82F6");

  const handleAddNewTag = () => {
    if (!newTagName.trim()) {
      toast.error("Prosím zadajte názov štítku");
      return;
    }

    const newTag: Tag = {
      id: Math.random().toString(36).substr(2, 9),
      name: newTagName.trim(),
      color: selectedColor,
    };

    onTagsChange([...tags, newTag]);
    setNewTagName("");
    toast.success("Štítok bol úspešne pridaný");
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(tags.filter((tag) => tag.id !== tagId));
    toast.success("Štítok bol odstránený");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Názov štítku"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
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
              Farba
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <ChromePicker
              color={selectedColor}
              onChange={(color) => setSelectedColor(color.hex)}
            />
          </PopoverContent>
        </Popover>
        <Button onClick={handleAddNewTag}>Pridať</Button>
      </div>
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => (
          <TagBadge
            key={tag.id}
            tag={tag}
            onRemove={() => handleRemoveTag(tag.id)}
          />
        ))}
      </div>
    </div>
  );
};