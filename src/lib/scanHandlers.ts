import { Item } from "./types";
import { playSuccessSound, playErrorSound } from "./sounds";
import { toast } from "sonner";
import { Customer } from "./types";

export const handleScanResult = async (
  item: Item | undefined,
  mode: "receiving" | "loading" | "delivery",
  customer: Customer | undefined,
  updateItem: (item: Item) => Promise<void>
) => {
  if (!item) {
    playErrorSound();
    toast.error("Položka nebola nájdená");
    return { success: false, status: "error" as const };
  }

  let newStatus: Item["status"] | undefined;
  let success = false;

  switch (mode) {
    case "receiving":
      if (item.status === "waiting") {
        newStatus = "in_stock";
        success = true;
      }
      break;
    case "loading":
      if (item.status === "in_stock") {
        newStatus = "in_transit";
        success = true;
      }
      break;
    case "delivery":
      if (item.status === "in_transit") {
        newStatus = "delivered";
        success = true;
      }
      break;
  }

  if (success && newStatus) {
    try {
      await updateItem({ ...item, status: newStatus, updatedAt: new Date() });
      playSuccessSound();
      
      if (customer?.tags && customer.tags.length > 0) {
        import("@/components/scanner/ScanToastContent").then(({ ScanToastContent }) => {
          toast(ScanToastContent({ item, customer }), {
            duration: 3000,
          });
        });
      }
      
      return { success: true, status: "success" as const };
    } catch (error) {
      playErrorSound();
      toast.error("Chyba pri aktualizácii položky");
      return { success: false, status: "error" as const };
    }
  } else {
    playErrorSound();
    toast.error("Nesprávny stav položky pre túto operáciu");
    return { success: false, status: "error" as const };
  }
};