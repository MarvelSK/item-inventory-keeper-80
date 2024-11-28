import { useEffect, useRef } from "react";
import { BarcodeScanner } from "react-barcode-scanner";
import { ScanStatus } from "./types";

interface ScannerCameraProps {
  isScanning: boolean;
  onScan: (code: string) => void;
  scanStatus: ScanStatus;
}

export const ScannerCamera = ({ isScanning, onScan, scanStatus }: ScannerCameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const getScannerBorderColor = () => {
    switch (scanStatus) {
      case "success": return "border-success";
      case "error": return "border-destructive";
      default: return "border-border";
    }
  };

  const handleScan = (result: any) => {
    if (result?.getText()) {
      onScan(result.getText());
    }
  };

  return (
    <div className="relative aspect-video max-w-md mx-auto">
      {isScanning ? (
        <BarcodeScanner onResult={handleScan}>
          <video
            ref={videoRef}
            className={`w-full h-full object-cover rounded-lg border-4 transition-colors ${getScannerBorderColor()}`}
            autoPlay
            playsInline
          />
        </BarcodeScanner>
      ) : (
        <div className={`w-full h-full rounded-lg border-4 ${getScannerBorderColor()} bg-muted flex items-center justify-center`}>
          <p className="text-muted-foreground">Camera is off</p>
        </div>
      )}
    </div>
  );
};