import { Button } from "../ui/button";
import { ScanMode } from "./types";

interface ScanControlsProps {
  mode: ScanMode;
  setMode: (mode: ScanMode) => void;
  isScanning: boolean;
  onStartScan: () => void;
  onStopScan: () => void;
  onToggleTorch: () => void;
  torchEnabled: boolean;
}

export const ScanControls = ({
  mode,
  setMode,
  isScanning,
  onStartScan,
  onStopScan,
}: ScanControlsProps) => {
  const getModeLabel = (mode: ScanMode) => {
    switch (mode) {
      case "receiving": return "Naskladnenie";
      case "loading": return "Naloženie";
      case "delivery": return "Doručenie";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        {["receiving", "loading", "delivery"].map((m) => (
          <Button
            key={m}
            onClick={() => setMode(m as ScanMode)}
            variant={mode === m ? "default" : "secondary"}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
              mode === m 
                ? "bg-white text-black" 
                : "bg-black/30 text-white hover:bg-black/40 backdrop-blur-sm"
            }`}
          >
            {getModeLabel(m as ScanMode)}
          </Button>
        ))}
      </div>
      <div className="flex justify-center">
        <Button
          onClick={isScanning ? onStopScan : onStartScan}
          className="w-16 h-16 rounded-full bg-white text-black hover:bg-white/90 transition-colors"
        >
          {isScanning ? "⏹" : "⏺"}
        </Button>
      </div>
    </div>
  );
};