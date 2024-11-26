import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { DistributorDialog } from "./DistributorDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DistributorsListProps {
  region: 'slovakia' | 'hungary' | 'romania';
}

export const DistributorsList = ({ region }: DistributorsListProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: distributors, refetch } = useQuery({
    queryKey: ["distributors", region],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("distributors")
        .select("*")
        .eq("region", region)
        .eq("deleted", false)
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Dodávatelia</h3>
        <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Pridať dodávateľa
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Názov</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefón</TableHead>
              <TableHead>Obchodný zástupca</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {distributors?.map((distributor) => (
              <TableRow key={distributor.id}>
                <TableCell className="font-medium">{distributor.name}</TableCell>
                <TableCell>{distributor.email || '-'}</TableCell>
                <TableCell>{distributor.phone || '-'}</TableCell>
                <TableCell>{distributor.sales_rep_email || '-'}</TableCell>
              </TableRow>
            ))}
            {!distributors?.length && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  Žiadni dodávatelia
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DistributorDialog
        region={region}
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onDistributorAdded={refetch}
      />
    </div>
  );
};