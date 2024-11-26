import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PriceOfferModal } from "./PriceOfferModal";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export const PriceOffersList = () => {
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  const { data: offers, isLoading } = useQuery({
    queryKey: ["price-offers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("price_offers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Číslo</TableHead>
              <TableHead>Produkt</TableHead>
              <TableHead>Zákazník</TableHead>
              <TableHead>Kontakt</TableHead>
              <TableHead>Dátum</TableHead>
              <TableHead>Stav</TableHead>
              <TableHead className="text-right">Akcie</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offers?.map((offer) => (
              <TableRow key={offer.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">#{offer.id}</TableCell>
                <TableCell>{offer.product}</TableCell>
                <TableCell>{offer.name}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{offer.phone_number}</p>
                    <p className="text-gray-500">{offer.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(offer.created_at), "dd.MM.yyyy")}
                </TableCell>
                <TableCell>
                  <Badge variant={offer.notification ? "success" : "secondary"}>
                    {offer.notification ? "Odoslané" : "Neodoslané"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedOffer(offer)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PriceOfferModal
        offer={selectedOffer}
        open={!!selectedOffer}
        onOpenChange={(open) => !open && setSelectedOffer(null)}
      />
    </div>
  );
};