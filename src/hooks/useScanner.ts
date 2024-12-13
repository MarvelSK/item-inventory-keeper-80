import { useState, useRef } from 'react';
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Item } from "@/lib/types";
import { ScanMode, ScanStatus } from "@/components/scanner/types";
import { playSuccessSound } from '@/lib/sounds';

export const useScanner = (
  items: Item[],
  updateItem: (item: Item, showToast?: boolean) => Promise<void>
) => {
  const [isScanning, setIsScanning] = useState(false);
  const [mode, setMode] = useState<ScanMode>("receiving");
  const [scanStatus, setScanStatus] = useState<ScanStatus>("none");
  const [canScan, setCanScan] = useState(true);
  const [scannedItem, setScannedItem] = useState<Item | null>(null);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader>();
  const mediaStream = useRef<MediaStream | null>(null);

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
        playSuccessSound(); // Play sound on successful scan
      } catch (error) {
        setScanStatus("error");
      }
    } else {
      setScanStatus("error");
    }

    setTimeout(() => setScanStatus("none"), 1000);
  };

  return {
    isScanning,
    setIsScanning,
    mode,
    setMode,
    scanStatus,
    setScanStatus,
    canScan,
    setCanScan,
    scannedItem,
    setScannedItem,
    torchEnabled,
    setTorchEnabled,
    videoRef,
    codeReader,
    mediaStream,
    handleScannedCode
  };
};