import { useEffect, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { useItems } from "@/hooks/useItems";
import { useCustomers } from "@/hooks/useCustomers";
import { ScanControls } from "./scanner/ScanControls";
import { useScanner } from "@/hooks/useScanner";
import { useTorch } from "@/hooks/useTorch";
import { ScannedItemsList } from "./scanner/ScannedItemsList";
import { Item } from "@/lib/types";
import { playSuccessSound } from "@/lib/sounds";

export const Scanner = () => {
  const { items, updateItem } = useItems();
  const { customers } = useCustomers();
  const [scannedItems, setScannedItems] = useState<Item[]>([]);
  
  const {
    isScanning,
    setIsScanning,
    mode,
    setMode,
    scanStatus,
    torchEnabled,
    setTorchEnabled,
    videoRef,
    codeReader,
    mediaStream,
    handleScannedCode
  } = useScanner(items, async (item: Item, showToast?: boolean) => {
    await updateItem(item, showToast);
    setScannedItems(prev => {
      const exists = prev.some(existingItem => existingItem.id === item.id);
      if (exists) return prev;
      playSuccessSound();
      return [item, ...prev].slice(0, 50);
    });
  });

  const { toggleTorch } = useTorch(mediaStream, torchEnabled, setTorchEnabled);

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();
    if (codeReader.current.hints) {
      codeReader.current.hints.set(2, true);
      codeReader.current.hints.set(3, true);
      codeReader.current.hints.set(6, true);
    }
    
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
    }
  }, [mode]);

  const startScanning = async () => {
    try {
      if (!videoRef.current) return;

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      const backCamera = videoDevices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('rear')
      );

      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: backCamera ? { exact: backCamera.deviceId } : undefined,
          facingMode: backCamera ? undefined : "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
          aspectRatio: { ideal: 1.7777777778 }
        }
      };

      mediaStream.current = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = mediaStream.current;
      
      setIsScanning(true);

      await codeReader.current?.decodeFromVideoDevice(
        backCamera?.deviceId || undefined,
        videoRef.current,
        (result, error) => {
          if (result) {
            handleScannedCode(result.getText());
          }
          if (error && !(error instanceof TypeError)) {
            console.error("Scanning error:", error);
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
            <video
              ref={videoRef}
              className={`w-full h-full object-cover rounded-lg border-4 transition-colors ${getScannerBorderColor()}`}
              autoPlay
              playsInline
            />
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