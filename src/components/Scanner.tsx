import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { findItemByCode, updateItemQuantity } from "@/lib/inventory";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Plus, Minus } from "lucide-react";
import { Item } from "@/lib/types";

export const Scanner = () => {
  const [scanning, setScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const [currentQuantity, setCurrentQuantity] = useState<number | null>(null);

  useEffect(() => {
    if (!scanning) {
      const newScanner = new Html5QrcodeScanner(
        "reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          videoConstraints: {
            facingMode: { exact: "environment" }
          }
        },
        false
      );
      setScanner(newScanner);
      newScanner.render(onScanSuccess, onScanFailure);
    }

    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [scanning]);

  const onScanSuccess = async (decodedText: string) => {
    console.log("Scanned code:", decodedText);
    setScanning(true);
    setScannedCode(decodedText);
    const item = await findItemByCode(decodedText);
    
    if (!item) {
      toast.error("Položka nebola nájdená v systéme");
      setTimeout(() => {
        setScanning(false);
        setScannedCode(null);
        setCurrentQuantity(null);
      }, 2000);
    } else {
      setCurrentQuantity(item.quantity);
      toast.success("Položka nájdená, môžete upraviť množstvo");
    }
  };

  const onScanFailure = (error: any) => {
    console.warn(`Code scan error = ${error}`);
  };

  const handleQuantityChange = async (change: number) => {
    if (scannedCode && currentQuantity !== null) {
      const newQuantity = currentQuantity + change;
      const updatedItem = await updateItemQuantity(scannedCode, newQuantity);
      if (updatedItem) {
        setCurrentQuantity(updatedItem.quantity);
        toast.success(`Množstvo upravené na ${updatedItem.quantity}`);
      }
    }
  };

  const resetScanner = () => {
    setScanning(false);
    setScannedCode(null);
    setCurrentQuantity(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Skenovať položky</h2>
      <div id="reader" className="w-full max-w-sm mx-auto"></div>
      
      {scannedCode && currentQuantity !== null && (
        <div className="mt-4 space-y-4">
          <div className="text-center">
            <p className="font-medium">Kód: {scannedCode}</p>
            <p className="text-lg font-semibold mt-2">
              Aktuálne množstvo: {currentQuantity}
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => handleQuantityChange(-1)}
              className="bg-destructive text-white py-2 px-4 rounded-md hover:bg-destructive/90 transition-colors"
            >
              <Minus className="h-4 w-4 mr-2" />
              -1
            </Button>
            <Button
              onClick={() => handleQuantityChange(1)}
              className="bg-success text-white py-2 px-4 rounded-md hover:bg-success/90 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              +1
            </Button>
          </div>
          <div className="text-center mt-4">
            <Button
              variant="outline"
              onClick={resetScanner}
              className="text-gray-600 hover:text-gray-800"
            >
              Skenovať ďalší kód
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
