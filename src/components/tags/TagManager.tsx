import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tag } from "@/lib/types";
import { TagBadge } from "./TagBadge";
import { ChromePicker } from "react-color";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface TagManagerProps {
  tags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
}

const existingTags: Tag[] = [
  { id: "1", name: "VIP", color: "#FF0000" },
  { id: "2", name: "Bežný", color: "#00FF00" },
  { id: "3", name: "Nový", color: "#0000FF" },
];

export const TagManager = ({ tags, onTagsChange }: TagManagerProps) => {
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#3B82F6");
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const handleAddExistingTag = (tagId: string) => {
    const tagToAdd = existingTags.find(t => t.id === tagId);
    if (tagToAdd && !tags.some(t => t.id === tagId)) {
      onTagsChange([...tags, tagToAdd]);
      toast.success("Štítok bol úspešne pridaný");
    }
  };

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
    setIsCreatingNew(false);
    toast.success("Štítok bol úspešne pridaný");
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(tags.filter((tag) => tag.id !== tagId));
    toast.success("Štítok bol odstránený");
  };

  return (
    <div className="space-y-4">
      {!isCreatingNew ? (
        <div className="flex gap-2">
          <Select onValueChange={handleAddExistingTag}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Vyberte existujúci štítok" />
            </SelectTrigger>
            <SelectContent>
              {existingTags
                .filter(tag => !tags.some(t => t.id === tag.id))
                .map(tag => (
                  <SelectItem key={tag.id} value={tag.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: tag.color }}
                      />
                      {tag.name}
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setIsCreatingNew(true)}>Nový štítok</Button>
        </div>
      ) : (
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
          <Button variant="outline" onClick={() => setIsCreatingNew(false)}>Zrušiť</Button>
        </div>
      )}
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