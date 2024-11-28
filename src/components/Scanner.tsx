import { useEffect, useState } from "react";
import { useItems } from "@/hooks/useItems";
import { Item } from "@/lib/types";
import { ItemPreview } from "./scanner/ItemPreview";
import { ScanControls } from "./scanner/ScanControls";
import { ScanMode, ScanStatus } from "./scanner/types";
import { useScanner } from "./scanner/useScanner";

export const Scanner = () => {
  const [mode, setMode] = useState<ScanMode>("receiving");
  const [scanStatus, setScanStatus] = useState<ScanStatus>("none");
  const [canScan, setCanScan] = useState(true);
  const [scannedItem, setScannedItem] = useState<Item | null>(null);
  const { items, updateItem } = useItems();

  const handleScannedCode = async (code: string) => {
    if (!canScan) return;
    
    setCanScan(false);
    setTimeout(() => setCanScan(true), 4000);

    const item = items.find(item => item.code === code);
    setScannedItem(item || null);
    
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
        setScannedItem(updatedItem);
        setScanStatus("success");
      } catch (error) {
        setScanStatus("error");
      }
    } else {
      setScanStatus("error");
    }

    setTimeout(() => setScanStatus("none"), 1000);
  };

  const {
    isScanning,
    torchEnabled,
    videoRef,
    startScanning,
    stopScanning,
    handleTorchToggle
  } = useScanner(handleScannedCode);

  useEffect(() => {
    if (isScanning) {
      stopScanning();
      startScanning();
      setScannedItem(null);
      setScanStatus("none");
      setCanScan(true);
    }
  }, [mode]);

  const getScannerBorderColor = () => {
    switch (scanStatus) {
      case "success": return "border-success";
      case "error": return "border-destructive";
      default: return "border-border";
    }
  };

  return (
    <div className="bg-card p-4 md:p-6 rounded-lg shadow-sm dark:shadow-none">
      <h2 className="text-xl font-semibold mb-4 text-primary">Skenovanie položiek</h2>
      <div className="space-y-4">
        <ScanControls
          mode={mode}
          setMode={setMode}
          isScanning={isScanning}
          onStartScan={startScanning}
          onStopScan={stopScanning}
          onToggleTorch={handleTorchToggle}
          torchEnabled={torchEnabled}
        />
        <div className="relative aspect-video max-w-md mx-auto">
          <video
            ref={videoRef}
            className={`w-full h-full object-cover rounded-lg border-4 transition-colors ${getScannerBorderColor()}`}
            autoPlay
            playsInline
          />
        </div>
        <ItemPreview item={scannedItem} />
      </div>
    </div>
  );
};