import { useState } from "react";
import { useItems } from "@/hooks/useItems";
import { useCustomers } from "@/hooks/useCustomers";
import { ScanControls } from "./scanner/ScanControls";
import { ScannedItemsList } from "./scanner/ScannedItemsList";
import { Item } from "@/lib/types";
import { playSuccessSound } from "@/lib/sounds";
import { ScanMode } from "./scanner/types";
import { useScanditScanner } from "@/hooks/useScanditScanner";
import { ItemPreview } from "./scanner/ItemPreview";
import { toast } from "sonner";
import { Card } from "./ui/card";

export const Scanner = () => {
  const { items, updateItem } = useItems();
  const { customers } = useCustomers();
  const [scannedItems, setScannedItems] = useState<Item[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [mode, setMode] = useState<ScanMode>("receiving");
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [previewItem, setPreviewItem] = useState<Item | null>(null);

  const handleScannedCode = async (code: string) => {
    const item = items.find(item => item.code === code);
    setPreviewItem(item || null);
    
    if (!item) {
      toast.error("Položka nebola nájdená");
      return;
    }

    const alreadyScanned = scannedItems.some(scannedItem => scannedItem.id === item.id);
    if (alreadyScanned) {
      return;
    }

    let newStatus;
    let success = false;

    switch (mode) {
      case "receiving":
        if (item.status === "waiting") {
          newStatus = "in_stock";
          success = true;
        } else {
          toast.error("Položka nie je v stave 'čaká na dovoz'");
        }
        break;
      case "loading":
        if (item.status === "in_stock") {
          newStatus = "in_transit";
          success = true;
        } else {
          toast.error("Položka nie je v stave 'na sklade'");
        }
        break;
      case "delivery":
        if (item.status === "in_transit") {
          newStatus = "delivered";
          success = true;
        } else {
          toast.error("Položka nie je v stave 'v preprave'");
        }
        break;
    }

    if (success && newStatus) {
      try {
        const updatedItem = { ...item, status: newStatus, updatedAt: new Date() };
        await updateItem(updatedItem, false);
        setScannedItems(prev => {
          playSuccessSound();
          return [updatedItem, ...prev].slice(0, 50);
        });
        toast.success("Položka bola úspešne naskenovaná");
      } catch (error) {
        toast.error("Chyba pri aktualizácii položky");
      }
    }
  };

  const { error } = useScanditScanner(handleScannedCode, isScanning, torchEnabled);

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-red-500">
        Chyba pri inicializácii skenera: {error}
      </div>
    );
  }

  return (
    <Card className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-primary">Skenovanie položiek</h2>
      </div>
      
      <div className="grid gap-6">
        <div className="space-y-4">
          <ScanControls
            mode={mode}
            setMode={setMode}
            isScanning={isScanning}
            onStartScan={() => setIsScanning(true)}
            onStopScan={() => {
              setIsScanning(false);
              setTorchEnabled(false);
            }}
            onToggleTorch={() => setTorchEnabled(!torchEnabled)}
            torchEnabled={torchEnabled}
          />
          
          <div className="relative w-full max-w-2xl mx-auto">
            <div
              id="scandit-view"
              className="w-full aspect-[4/3] rounded-lg border-2 border-border overflow-hidden bg-muted/10"
            />
          </div>

          <ItemPreview item={previewItem} />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Naskenované položky</h3>
          <ScannedItemsList items={scannedItems} />
        </div>
      </div>
    </Card>
  );
};