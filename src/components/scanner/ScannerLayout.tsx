import { Item } from "@/lib/types";
import { ScanHistory } from "./ScanHistory";
import { ScanControls } from "./ScanControls";
import { ItemPreview } from "./ItemPreview";
import { ArrowLeft, Flashlight, FlashlightOff, SwitchCamera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScanMode } from "./types";

interface ScannerLayoutProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isScanning: boolean;
  mode: ScanMode;
  setMode: (mode: ScanMode) => void;
  scanStatus: string;
  scannedItem: Item | null;
  torchEnabled: boolean;
  toggleTorch: () => void;
  toggleCamera: () => void;
  startScanning: () => void;
  stopScanning: () => void;
  scanHistory: Item[];
}

export const ScannerLayout = ({
  videoRef,
  isScanning,
  mode,
  setMode,
  scanStatus,
  scannedItem,
  torchEnabled,
  toggleTorch,
  toggleCamera,
  startScanning,
  stopScanning,
  scanHistory,
}: ScannerLayoutProps) => {
  const navigate = useNavigate();

  const getScannerBorderColor = () => {
    switch (scanStatus) {
      case "success": return "border-success/50";
      case "error": return "border-destructive/50";
      default: return "border-transparent";
    }
  };

  return (
    <div className="fixed inset-0 bg-black">
      <div className="relative h-full flex flex-col">
        {/* Top Half - Scanner */}
        <div className="h-1/2 relative">
          {/* Camera Feed */}
          <video
            ref={videoRef}
            className={`w-full h-full object-cover transition-colors ${getScannerBorderColor()}`}
            autoPlay
            playsInline
            muted
          />
          
          {/* Scanner Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="h-full flex flex-col">
              {/* Top Bar */}
              <div className="p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
                <button
                  onClick={() => navigate(-1)}
                  className="w-10 h-10 flex items-center justify-center text-white bg-black/20 rounded-full backdrop-blur-sm pointer-events-auto"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-white font-medium">Skenovanie</h2>
                <div className="flex gap-2">
                  <button
                    onClick={toggleCamera}
                    className="w-10 h-10 flex items-center justify-center text-white bg-black/20 rounded-full backdrop-blur-sm pointer-events-auto"
                  >
                    <SwitchCamera className="w-6 h-6" />
                  </button>
                  <button
                    onClick={toggleTorch}
                    className="w-10 h-10 flex items-center justify-center text-white bg-black/20 rounded-full backdrop-blur-sm pointer-events-auto"
                  >
                    {torchEnabled ? <FlashlightOff className="w-6 h-6" /> : <Flashlight className="w-6 h-6" />}
                  </button>
                </div>
              </div>
              
              {/* Center Scanner Frame */}
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-[280px] aspect-square relative">
                  <div className="absolute inset-0 border-2 border-white/30 rounded-2xl" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-[2px] bg-white/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scanned Item Preview */}
          <div className="absolute top-16 left-0 right-0 p-4 z-10 pointer-events-none">
            <div className="pointer-events-auto">
              <ItemPreview item={scannedItem} />
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent pointer-events-auto">
            <ScanControls
              mode={mode}
              setMode={setMode}
              isScanning={isScanning}
              onStartScan={startScanning}
              onStopScan={stopScanning}
              onToggleTorch={toggleTorch}
              torchEnabled={torchEnabled}
            />
          </div>
        </div>

        {/* Bottom Half - Scan History */}
        <div className="h-1/2 bg-black/90">
          <ScanHistory items={scanHistory} />
        </div>
      </div>
    </div>
  );
};