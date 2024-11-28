import { useEffect, useRef, useState } from "react";
import { useItems } from "@/hooks/useItems";
import { useCustomers } from "@/hooks/useCustomers";
import { Item } from "@/lib/types";
import { ItemPreview } from "./scanner/ItemPreview";
import { ScanControls } from "./scanner/ScanControls";
import { ScanMode, ScanStatus } from "./scanner/types";
import { BarcodeDetector } from "@/lib/types";

declare global {
  interface Window {
    BarcodeDetector?: {
      new(): BarcodeDetector;
    };
  }
}

export const Scanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [mode, setMode] = useState<ScanMode>("receiving");
  const [scanStatus, setScanStatus] = useState<ScanStatus>("none");
  const [canScan, setCanScan] = useState(true);
  const [scannedItem, setScannedItem] = useState<Item | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const { items, updateItem } = useItems();
  const { customers } = useCustomers();
  const detector = useRef<BarcodeDetector | null>(null);
  const animationFrame = useRef<number>();

  useEffect(() => {
    if (window.BarcodeDetector) {
      detector.current = new window.BarcodeDetector();
    }
    
    return () => {
      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach(track => track.stop());
      }
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  const handleScannedCode = async (code: string) => {
    if (!canScan) return;
    
    setCanScan(false);
    setTimeout(() => setCanScan(true), 3000);

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

  const scanFrame = async () => {
    if (!videoRef.current || !detector.current) return;

    try {
      const barcodes = await detector.current.detect(videoRef.current);
      for (const barcode of barcodes) {
        if (barcode.rawValue) {
          await handleScannedCode(barcode.rawValue);
          return;
        }
      }
    } catch (error) {
      console.error("Barcode detection error:", error);
    }

    if (isScanning) {
      animationFrame.current = requestAnimationFrame(scanFrame);
    }
  };

  const startScanning = async () => {
    try {
      if (!videoRef.current) return;
      if (!window.BarcodeDetector) {
        console.error("Barcode detection not supported");
        return;
      }

      const constraints = {
        video: {
          facingMode: { exact: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      mediaStream.current = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = mediaStream.current;
      setIsScanning(true);
      animationFrame.current = requestAnimationFrame(scanFrame);
    } catch (error) {
      console.error("Error accessing camera:", error);
      // If exact environment mode fails, try without exact constraint
      try {
        const fallbackConstraints = {
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
        mediaStream.current = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
        videoRef.current!.srcObject = mediaStream.current;
        setIsScanning(true);
        animationFrame.current = requestAnimationFrame(scanFrame);
      } catch (fallbackError) {
        console.error("Error accessing camera with fallback:", fallbackError);
      }
    }
  };

  const stopScanning = () => {
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => track.stop());
      mediaStream.current = null;
    }
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
    setIsScanning(false);
  };

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