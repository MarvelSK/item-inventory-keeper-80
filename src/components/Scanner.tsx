import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { useItems } from "@/hooks/useItems";
import { useCustomers } from "@/hooks/useCustomers";
import { Item } from "@/lib/types";
import { ItemPreview } from "./scanner/ItemPreview";
import { ScanControls } from "./scanner/ScanControls";
import { ScanMode, ScanStatus } from "./scanner/types";

// Define custom types for torch functionality
type TorchConstraint = {
  torch: boolean;
};

interface ExtendedMediaTrackCapabilities extends MediaTrackCapabilities {
  torch?: boolean;
}

export const Scanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [mode, setMode] = useState<ScanMode>("receiving");
  const [scanStatus, setScanStatus] = useState<ScanStatus>("none");
  const [canScan, setCanScan] = useState(true);
  const [scannedItem, setScannedItem] = useState<Item | null>(null);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader>();
  const mediaStream = useRef<MediaStream | null>(null);
  const { items, updateItem } = useItems();
  const { customers } = useCustomers();

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();
    return () => {
      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (isScanning) {
      stopScanning();
      startScanning();
      setScannedItem(null);
      setScanStatus("none");
      setCanScan(true);
    }
  }, [mode]);

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

  const toggleTorch = async () => {
    if (!mediaStream.current) return;
    
    const track = mediaStream.current.getVideoTracks()[0];
    const capabilities = track.getCapabilities() as ExtendedMediaTrackCapabilities;
    
    if (!capabilities.torch) {
      console.log('Torch not supported on this device');
      return;
    }

    try {
      const constraints: MediaTrackConstraints = {
        advanced: [{ torch: !torchEnabled } as TorchConstraint]
      };
      await track.applyConstraints(constraints);
      setTorchEnabled(!torchEnabled);
    } catch (err) {
      console.error('Error toggling torch:', err);
    }
  };

  const startScanning = async () => {
    try {
      if (!videoRef.current) return;

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: "environment",
          advanced: [{ torch: torchEnabled } as TorchConstraint]
        }
      };

      mediaStream.current = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = mediaStream.current;
      
      setIsScanning(true);

      await codeReader.current?.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result, error) => {
          if (result) {
            handleScannedCode(result.getText());
          }
          if (error && !(error instanceof TypeError)) {
            console.error(error);
          }
        }
      );
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopScanning = () => {
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => track.stop());
      mediaStream.current = null;
    }
    setIsScanning(false);
    setTorchEnabled(false);
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
          onToggleTorch={toggleTorch}
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