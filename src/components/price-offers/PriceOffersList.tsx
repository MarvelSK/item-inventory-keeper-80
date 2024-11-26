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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const PriceOffersList = () => {
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
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Objednávka č.</TableHead>
            <TableHead>Dátum objednávky</TableHead>
            <TableHead>Dodávateľ</TableHead>
            <TableHead>Dátum notifikácie</TableHead>
            <TableHead>Zákazník</TableHead>
            <TableHead>Kontakt</TableHead>
            <TableHead>Dotazník spokojnosti</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offers?.map((offer) => (
            <TableRow key={offer.id}>
              <TableCell>
                <Accordion type="single" collapsible>
                  <AccordionItem value={offer.id.toString()}>
                    <AccordionTrigger className="hover:no-underline">
                      {offer.id}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 p-4 bg-gray-50 rounded-md">
                        <h3 className="font-semibold">Detaily objednávky</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p><strong>Produkt:</strong> {offer.product}</p>
                            <p><strong>Ovládanie:</strong> {offer.control}</p>
                            <p><strong>Farba:</strong> {offer.color}</p>
                            <p><strong>Doplnková farba:</strong> {offer.color_adv}</p>
                            <p><strong>Lamela:</strong> {offer.plate}</p>
                            <p><strong>Fasáda:</strong> {offer.facade}</p>
                            <p><strong>Krytie:</strong> {offer.casing}</p>
                            <p><strong>Počet:</strong> {offer.count}</p>
                          </div>
                          <div>
                            <p><strong>Šírka:</strong> {offer.width}</p>
                            <p><strong>Výška:</strong> {offer.height}</p>
                            <p><strong>Balík:</strong> {offer.packet}</p>
                            <p><strong>Vodiace lišty:</strong> {offer.rails}</p>
                            <p><strong>Motor:</strong> {offer.motor}</p>
                            <p><strong>Príslušenstvo motora:</strong> {offer.motor_acc}</p>
                            <p><strong>Poznámky:</strong> {offer.notices}</p>
                            <p><strong>Správa:</strong> {offer.message}</p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TableCell>
              <TableCell>
                {format(new Date(offer.created_at), "dd.MM.yyyy HH:mm")}
              </TableCell>
              <TableCell>{offer.vendor_contact || "-"}</TableCell>
              <TableCell>
                {offer.vendor_date
                  ? format(new Date(offer.vendor_date), "dd.MM.yyyy")
                  : "-"}
              </TableCell>
              <TableCell>{offer.name}</TableCell>
              <TableCell>
                <div>
                  <p>{offer.phone_number}</p>
                  <p className="text-sm text-gray-500">{offer.email}</p>
                </div>
              </TableCell>
              <TableCell>
                {offer.notification ? (
                  <span className="text-green-600">Odoslané</span>
                ) : (
                  <span className="text-gray-500">Neodoslané</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};