import { Button } from "../ui/button";
import { Archive, ArchiveRestore } from "lucide-react";
import { useItems } from "@/hooks/useItems";
import { Item } from "@/lib/types";
import { toast } from "sonner";
import { differenceInMonths } from "date-fns";

interface ArchiveControlsProps {
  items: Item[];
}

export const ArchiveControls = ({ items }: ArchiveControlsProps) => {
  const { updateItem } = useItems();

  const handleAutoArchive = async () => {
    const itemsToArchive = items.filter(item => 
      !item.archived && 
      item.status === 'delivered' &&
      differenceInMonths(new Date(), new Date(item.updatedAt)) >= 3
    );

    if (itemsToArchive.length === 0) {
      toast.info("No items qualify for archiving");
      return;
    }

    try {
      await Promise.all(itemsToArchive.map(item => 
        updateItem({
          ...item,
          archived: true,
          archiveDate: new Date()
        })
      ));
      toast.success(`Archived ${itemsToArchive.length} items`);
    } catch (error) {
      toast.error("Failed to archive items");
    }
  };

  const handleRestoreAll = async () => {
    const archivedItems = items.filter(item => item.archived);
    
    if (archivedItems.length === 0) {
      toast.info("No archived items to restore");
      return;
    }

    try {
      await Promise.all(archivedItems.map(item =>
        updateItem({
          ...item,
          archived: false,
          archiveDate: undefined
        })
      ));
      toast.success(`Restored ${archivedItems.length} items`);
    } catch (error) {
      toast.error("Failed to restore items");
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="hover:text-[#47acc9]"
        onClick={handleAutoArchive}
      >
        <Archive className="mr-2 h-4 w-4" />
        Auto Archive
      </Button>
      <Button
        variant="outline"
        className="hover:text-[#47acc9]"
        onClick={handleRestoreAll}
      >
        <ArchiveRestore className="mr-2 h-4 w-4" />
        Restore All
      </Button>
    </div>
  );
};