import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { DistributorDialog } from "./DistributorDialog";

interface DistributorsListProps {
  region: 'slovakia' | 'hungary' | 'romania';
}

export const DistributorsList = ({ region }: DistributorsListProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      <Button 
        onClick={() => setIsDialogOpen(true)}
        variant="outline"
        className="mb-4"
      >
        <Users className="h-4 w-4 mr-2" />
        Dodávatelia
      </Button>

      <DistributorDialog
        region={region}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
};