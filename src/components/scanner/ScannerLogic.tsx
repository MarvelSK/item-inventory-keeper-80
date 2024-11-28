import { useState } from "react";
import { useItems } from "@/hooks/useItems";
import { Item } from "@/lib/types";
import { ScanMode, ScanStatus } from "./types";
import { toast } from "sonner";

export const useScannerLogic = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [mode, setMode] = useState<ScanMode>("receiving");
  const [scanStatus, setScanStatus] = useState<ScanStatus>("none");
  const [canScan, setCanScan] = useState(true);
  const [scannedItem, setScannedItem] = useState<Item | null>(null);
  const { items, updateItem } = useItems();

  const handleScannedCode = async (code: string) => {
    if (!canScan) return;
    
    setCanScan(false);
    setTimeout(() => setCanScan(true), 3000);

    const item = items.find(item => item.code === code);
    setScannedItem(item || null);
    
    if (!item) {
      setScanStatus("error");
      toast.error("Item not found");
      setTimeout(() => setScanStatus("none"), 1000);
      return;
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
        const updatedItem = { 
          ...item, 
          status: newStatus, 
          updatedAt: new Date().toISOString() 
        };
        await updateItem(updatedItem, false);
        setScannedItem(updatedItem);
        setScanStatus("success");
        toast.success("Item status updated successfully");
      } catch (error) {
        setScanStatus("error");
        toast.error("Failed to update item status");
      }
    } else {
      setScanStatus("error");
      toast.error("Invalid status transition for current mode");
    }

    setTimeout(() => setScanStatus("none"), 1000);
  };

  return {
    isScanning,
    setIsScanning,
    mode,
    setMode,
    scanStatus,
    scannedItem,
    handleScannedCode,
  };
};