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
            <TableRow className="h-10">
              <TableHead className="text-xs">Číslo</TableHead>
              <TableHead className="text-xs">Produkt</TableHead>
              <TableHead className="text-xs">Zákazník</TableHead>
              <TableHead className="text-xs">Kontakt</TableHead>
              <TableHead className="text-xs">Dátum</TableHead>
              <TableHead className="text-xs">Stav</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offers?.map((offer) => (
              <TableRow 
                key={offer.id} 
                className="h-12 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedOffer(offer)}
              >
                <TableCell className="text-xs font-medium">#{offer.id}</TableCell>
                <TableCell className="text-xs">{offer.product}</TableCell>
                <TableCell className="text-xs">{offer.name}</TableCell>
                <TableCell>
                  <div className="text-xs">
                    <p>{offer.phone_number}</p>
                    <p className="text-gray-500">{offer.email}</p>
                  </div>
                </TableCell>
                <TableCell className="text-xs">
                  {format(new Date(offer.created_at), "dd.MM.yyyy")}
                </TableCell>
                <TableCell>
                  <Badge variant={offer.notification ? "default" : "secondary"} className="text-xs">
                    {offer.notification ? "Odoslané" : "Neodoslané"}
                  </Badge>
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