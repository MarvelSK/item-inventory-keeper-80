import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Send } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PriceOfferModalProps {
  offer: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VENDORS = [
  { id: 1, name: "Dodávateľ 1" },
  { id: 2, name: "Dodávateľ 2" },
  { id: 3, name: "Dodávateľ 3" },
];

export const PriceOfferModal = ({ offer, open, onOpenChange }: PriceOfferModalProps) => {
  if (!offer) return null;

  const DetailRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className="grid grid-cols-2 py-2 border-b border-gray-100">
      <span className="text-gray-600 text-sm">{label}</span>
      <span className="text-sm">{value || '-'}</span>
    </div>
  );

  const handleSendSatisfactionEmail = async () => {
    // TODO: Implement email sending logic
    console.log("Sending satisfaction email...");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold mb-4 text-[#212490]">
            Detail objednávky #{offer.id}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-1">
            <h3 className="font-medium mb-3 text-[#212490]">Produkt</h3>
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

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-3 text-[#212490]">Zákazník</h3>
              <DetailRow label="Meno zákazníka" value={offer.name} />
              <DetailRow label="Adresa" value={offer.address} />
              <DetailRow label="Tel. č." value={offer.phone_number} />
              <DetailRow label="E-mail" value={offer.email} />
              <DetailRow label="Miesto realizácie" value={offer.place} />
            </div>
            
            <div>
              <h3 className="font-medium mb-3 text-[#212490]">Dodávateľ</h3>
              <Select defaultValue={offer.vendor_id?.toString()}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Vybrať dodávateľa" />
                </SelectTrigger>
                <SelectContent>
                  {VENDORS.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id.toString()}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-[#212490]">Poznámky</h3>
              <textarea
                className="w-full min-h-[100px] p-3 border rounded-md bg-gray-50 text-sm"
                placeholder="Pridať poznámku..."
                defaultValue={offer.notices}
                readOnly
              />
            </div>

            <div className="flex gap-2 mt-4">
              <Button 
                className="w-full bg-[#212490] hover:bg-[#47acc9]"
                onClick={handleSendSatisfactionEmail}
              >
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