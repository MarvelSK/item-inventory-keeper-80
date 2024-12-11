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
          >
            {getModeLabel(m as ScanMode)}
          </Button>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        <Button
          onClick={isScanning ? onStopScan : onStartScan}
          className="w-full sm:w-auto"
        >
          {isScanning ? (
            <>
              <CameraOff className="mr-2 h-4 w-4" />
              Zastaviť skenovanie
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              Spustiť skenovanie
            </>
          )}
        </Button>
        {isScanning && (
          <Button
            onClick={onToggleTorch}
            variant="outline"
            className="w-full sm:w-auto"
          >
            {torchEnabled ? (
              <>
                <FlashlightOff className="mr-2 h-4 w-4" />
                Vypnúť blesk
              </>
            ) : (
              <>
                <Flashlight className="mr-2 h-4 w-4" />
                Zapnúť blesk
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};