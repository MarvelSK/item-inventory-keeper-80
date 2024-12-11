import { useEffect } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import { useItems } from "@/hooks/useItems";
import { useCustomers } from "@/hooks/useCustomers";
import { ItemPreview } from "./scanner/ItemPreview";
import { ScanControls } from "./scanner/ScanControls";
import { useScanner } from "@/hooks/useScanner";
import { useTorch } from "@/hooks/useTorch";

export const Scanner = () => {
  const { items, updateItem } = useItems();
  const { customers } = useCustomers();
  const {
    isScanning,
    setIsScanning,
    mode,
    setMode,
    scanStatus,
    scannedItem,
    torchEnabled,
    setTorchEnabled,
    videoRef,
    codeReader,
    mediaStream,
    handleScannedCode
  } = useScanner(items, updateItem);

  const { toggleTorch } = useTorch(mediaStream, torchEnabled, setTorchEnabled);

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
    }
  }, [mode]);

  const startScanning = async () => {
    try {
      if (!videoRef.current) return;

      // Get list of available video devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      // Try to find a back camera
      const backCamera = videoDevices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('rear')
      );

      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: backCamera ? { exact: backCamera.deviceId } : undefined,
          facingMode: backCamera ? undefined : "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
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