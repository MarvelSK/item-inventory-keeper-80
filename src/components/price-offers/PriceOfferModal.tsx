import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Send } from "lucide-react";

interface PriceOfferModalProps {
  offer: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PriceOfferModal = ({ offer, open, onOpenChange }: PriceOfferModalProps) => {
  if (!offer) return null;

  const DetailRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className="grid grid-cols-2 py-2 border-b border-gray-100">
      <span className="text-gray-600">{label}</span>
      <span>{value || '-'}</span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold mb-4">
            Detail objednávky #{offer.id}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-1">
            <h3 className="font-medium mb-3">Produkt</h3>
            <DetailRow label="Produkt" value={offer.product} />
            <DetailRow label="Ovládanie" value={offer.control} />
            <DetailRow label="Ovládanie motora" value={offer.motor} />
            <DetailRow label="Štandardná farba" value={offer.color} />
            <DetailRow label="Krytie plechy" value={offer.casing} />
            <DetailRow label="Pripočítať paket" value={offer.packet} />
            <DetailRow label="Vodiace lišty" value={offer.rails} />
            <DetailRow label="Prevedenie" value={offer.facade} />
            <DetailRow label="Počet" value={offer.count} />
            <DetailRow label="Šírka [mm]" value={offer.width} />
            <DetailRow label="Výška [mm]" value={offer.height} />
          </div>

          <div className="space-y-1">
            <h3 className="font-medium mb-3">Zákazník</h3>
            <DetailRow label="Meno zákazníka" value={offer.name} />
            <DetailRow label="Adresa" value={offer.address} />
            <DetailRow label="Tel. č." value={offer.phone_number} />
            <DetailRow label="E-mail" value={offer.email} />
            <DetailRow label="Miesto realizácie" value={offer.place} />
            
            <div className="mt-6">
              <h3 className="font-medium mb-3">Poznámky</h3>
              <textarea
                className="w-full min-h-[100px] p-3 border rounded-md bg-gray-50"
                placeholder="Pridať poznámku..."
                defaultValue={offer.notices}
                readOnly
              />
            </div>

            <div className="flex gap-2 mt-4">
              <Button className="w-full" variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Mail o spokojnosti
              </Button>
              <Button className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Nastaviť
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};