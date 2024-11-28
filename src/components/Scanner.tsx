import { ScannerCamera } from "./scanner/ScannerCamera";
import { ItemPreview } from "./scanner/ItemPreview";
import { ScanControls } from "./scanner/ScanControls";
import { useScannerLogic } from "./scanner/ScannerLogic";

export const Scanner = () => {
  const {
    isScanning,
    setIsScanning,
    mode,
    setMode,
    scanStatus,
    scannedItem,
    handleScannedCode,
  } = useScannerLogic();

  return (
    <div className="bg-card p-4 md:p-6 rounded-lg shadow-sm dark:shadow-none">
      <h2 className="text-xl font-semibold mb-4 text-primary">Skenovanie položiek</h2>
      <div className="space-y-4">
        <ScanControls
          mode={mode}
          setMode={setMode}
          isScanning={isScanning}
          onStartScan={() => setIsScanning(true)}
          onStopScan={() => setIsScanning(false)}
        />
        <ScannerCamera
          isScanning={isScanning}
          onScan={handleScannedCode}
          scanStatus={scanStatus}
        />
        <ItemPreview item={scannedItem} />
      </div>
    </div>
  );
};