import { Button } from "../ui/button";
import { Camera, CameraOff } from "lucide-react";

interface ScannerUIProps {
  isScanning: boolean;
  mode: "receiving" | "loading" | "delivery";
  scanStatus: "none" | "success" | "error";
  onModeChange: (mode: "receiving" | "loading" | "delivery") => void;
  onScanningToggle: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const ScannerUI = ({
  isScanning,
  mode,
  scanStatus,
  onModeChange,
  onScanningToggle,
  videoRef,
}: ScannerUIProps) => {
  const getModeLabel = (mode: typeof ScannerUIProps.prototype.mode) => {
    switch (mode) {
      case "receiving": return "Naskladnenie";
      case "loading": return "Naloženie";
      case "delivery": return "Doručenie";
    }
  };

  const getScannerBorderColor = () => {
    switch (scanStatus) {
      case "success": return "border-green-500";
      case "error": return "border-red-500";
      default: return "border-gray-200";
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-[#212490]">Skenovanie položiek</h2>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {["receiving", "loading", "delivery"].map((m) => (
            <Button
              key={m}
              onClick={() => onModeChange(m as typeof mode)}
              variant={mode === m ? "default" : "outline"}
            >
              {getModeLabel(m as typeof mode)}
            </Button>
          ))}
        </div>
        <div className="flex justify-center">
          <Button
            onClick={onScanningToggle}
            className="w-full sm:w-auto"
          >
            {isScanning ? (
              <>
                <CameraOff className="mr-2 h-4 w-4" />
                Stop Scanning
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Start Scanning
              </>
            )}
          </Button>
        </div>
        <div className="relative aspect-video max-w-md mx-auto">
          <video
            ref={videoRef}
            className={`w-full h-full object-cover rounded-lg border-4 transition-colors ${getScannerBorderColor()}`}
            autoPlay
            playsInline
          />
        </div>
      </div>
    </div>
  );
};