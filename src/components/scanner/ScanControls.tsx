import { Button } from "../ui/button";
import { Camera, CameraOff, Flashlight, FlashlightOff } from "lucide-react";
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
  onToggleTorch,
  torchEnabled,
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
      <div className="flex flex-wrap gap-2 justify-center">
        {["receiving", "loading", "delivery"].map((m) => (
          <Button
            key={m}
            onClick={() => setMode(m as ScanMode)}
            variant={mode === m ? "default" : "outline"}
            size="lg"
            className="min-w-[120px]"
          >
            {getModeLabel(m as ScanMode)}
          </Button>
        ))}
      </div>
      
      <div className="flex justify-center gap-3">
        <Button
          onClick={isScanning ? onStopScan : onStartScan}
          size="lg"
          variant={isScanning ? "destructive" : "default"}
          className="min-w-[200px]"
        >
          {isScanning ? (
            <>
              <CameraOff className="mr-2 h-5 w-5" />
              Zastaviť skenovanie
            </>
          ) : (
            <>
              <Camera className="mr-2 h-5 w-5" />
              Spustiť skenovanie
            </>
          )}
        </Button>
        
        {isScanning && (
          <Button
            onClick={onToggleTorch}
            variant="outline"
            size="lg"
            className="min-w-[160px]"
          >
            {torchEnabled ? (
              <>
                <FlashlightOff className="mr-2 h-5 w-5" />
                Vypnúť blesk
              </>
            ) : (
              <>
                <Flashlight className="mr-2 h-5 w-5" />
                Zapnúť blesk
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};