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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export const PriceOffersList = () => {
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

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

  const totalPages = Math.ceil((offers?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOffers = offers?.slice(startIndex, startIndex + itemsPerPage) || [];

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
            <TableRow className="h-8">
              <TableHead className="text-xs">Objednávka č.</TableHead>
              <TableHead className="text-xs">Dátum objednávky</TableHead>
              <TableHead className="text-xs">Dodávateľ</TableHead>
              <TableHead className="text-xs">Dátum notifikácie</TableHead>
              <TableHead className="text-xs">Zákazník</TableHead>
              <TableHead className="text-xs">Kontakt</TableHead>
              <TableHead className="text-xs">Dotazník spokojnosti</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOffers.map((offer) => (
              <TableRow 
                key={offer.id} 
                className="h-8 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedOffer(offer)}
              >
                <TableCell className="text-xs font-medium py-1">#{offer.id}</TableCell>
                <TableCell className="text-xs py-1">
                  {format(new Date(offer.created_at), "dd.MM.yyyy HH:mm")}
                </TableCell>
                <TableCell className="text-xs py-1">
                  {offer.vendor_contact || "-"}
                </TableCell>
                <TableCell className="text-xs py-1">
                  {offer.vendor_date 
                    ? format(new Date(offer.vendor_date), "dd.MM.yyyy HH:mm")
                    : "-"}
                </TableCell>
                <TableCell className="text-xs py-1">{offer.name}</TableCell>
                <TableCell className="py-1">
                  <div className="text-xs">
                    <p>{offer.phone_number}</p>
                    <p className="text-gray-500">{offer.email}</p>
                  </div>
                </TableCell>
                <TableCell className="text-xs py-1">
                  <Badge variant={offer.notification ? "success" : "secondary"} className="text-xs">
                    {offer.notification ? "Áno" : "Nie"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 order-2 sm:order-1">
          <span className="text-sm text-gray-500">Položky na stránku:</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="50" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Pagination className="order-1 sm:order-2">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <PriceOfferModal
        offer={selectedOffer}
        open={!!selectedOffer}
        onOpenChange={(open) => !open && setSelectedOffer(null)}
      />
    </div>
  );
};