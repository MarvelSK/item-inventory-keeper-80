import { useState } from "react";
import { useItems } from "@/hooks/useItems";
import { useCustomers } from "@/hooks/useCustomers";
import { ScanControls } from "./scanner/ScanControls";
import { useQuaggaScanner } from "@/hooks/useQuaggaScanner";
import { ScannedItemsList } from "./scanner/ScannedItemsList";
import { Item } from "@/lib/types";
import { playSuccessSound } from "@/lib/sounds";
import { ScanMode } from "./scanner/types";

export const Scanner = () => {
  const { items, updateItem } = useItems();
  const { customers } = useCustomers();
  const [scannedItems, setScannedItems] = useState<Item[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [mode, setMode] = useState<ScanMode>("receiving");
  const [torchEnabled, setTorchEnabled] = useState(false);

  const handleScannedCode = async (code: string) => {
    const item = items.find(item => item.code === code);
    
    if (!item) {
      setScanStatus("error");
      setTimeout(() => setScanStatus("none"), 1000);
      return;
    }

    let newStatus;
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
        const updatedItem = { ...item, status: newStatus, updatedAt: new Date() };
        await updateItem(updatedItem, false);
        setScannedItems(prev => {
          const exists = prev.some(existingItem => existingItem.id === item.id);
          if (exists) return prev;
          playSuccessSound();
          return [updatedItem, ...prev].slice(0, 50);
        });
        setScanStatus("success");
      } catch (error) {
        setScanStatus("error");
      }
    } else {
      setScanStatus("error");
    }

    setTimeout(() => setScanStatus("none"), 1000);
  };

  const { videoRef, scanStatus, setScanStatus } = useQuaggaScanner(
    handleScannedCode,
    isScanning
  );

  const startScanning = () => {
    setIsScanning(true);
  };

  const stopScanning = () => {
    setIsScanning(false);
    setTorchEnabled(false);
  };

  const toggleTorch = () => {
    setTorchEnabled(!torchEnabled);
  };

  const getScannerBorderColor = () => {
    switch (scanStatus) {
      case "success": return "border-success";
      case "error": return "border-destructive";
      default: return "border-border";
    }
  };

  return (
    <div className="bg-card p-4 md:p-6 rounded-lg shadow-sm dark:shadow-none space-y-4 mb-8">
      <h2 className="text-xl font-semibold text-primary">Skenovanie položiek</h2>
      
      <div className="grid grid-rows-[auto_1fr] gap-4">
        <div className="space-y-4">
          <ScanControls
            mode={mode}
            setMode={setMode}
            isScanning={isScanning}
            onStartScan={startScanning}
            onStopScan={stopScanning}
            onToggleTorch={toggleTorch}
            torchEnabled={torchEnabled}
          />
          
          <div className="relative aspect-[16/9] w-full max-w-3xl mx-auto">
            <div
              ref={videoRef}
              className={`w-full h-full rounded-lg border-4 transition-colors ${getScannerBorderColor()}`}
            />
            {/* Focus rectangle overlay */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 border-2 border-primary pointer-events-none">
              <div className="absolute left-0 top-0 w-4 h-4 border-l-2 border-t-2 border-primary"></div>
              <div className="absolute right-0 top-0 w-4 h-4 border-r-2 border-t-2 border-primary"></div>
              <div className="absolute left-0 bottom-0 w-4 h-4 border-l-2 border-b-2 border-primary"></div>
              <div className="absolute right-0 bottom-0 w-4 h-4 border-r-2 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Naskenované položky</h3>
          <ScannedItemsList items={scannedItems} />
        </div>
      </div>
    </div>
  );
};