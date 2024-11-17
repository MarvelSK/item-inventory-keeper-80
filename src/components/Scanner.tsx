import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { findItemByCode, updateItemQuantity } from "@/lib/inventory";
import { toast } from "sonner";

export const Scanner = () => {
  const [scanning, setScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);

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

  const onScanSuccess = (decodedText: string) => {
    setScanning(true);
    setScannedCode(decodedText);
    const item = findItemByCode(decodedText);
    
    if (item) {
      toast.success(`Found item: ${decodedText}`);
    } else {
      toast.error("Item not found in system");
    }
    
    setTimeout(() => {
      setScanning(false);
      setScannedCode(null);
    }, 2000);
  };

  const onScanFailure = (error: any) => {
    console.warn(`Code scan error = ${error}`);
  };

  const handleQuantityChange = (change: number) => {
    if (scannedCode) {
      const updatedItem = updateItemQuantity(scannedCode, change);
      if (updatedItem) {
        toast.success(`Quantity updated to ${updatedItem.quantity}`);
      }
      setScanning(false);
      setScannedCode(null);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm max-w-sm mx-auto">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">Skenovať položky</h2>
      <div id="reader" className="w-full"></div>
      
      {scannedCode && (
        <div className="mt-4 space-y-3">
          <p className="text-center text-sm sm:text-base font-medium">Kód: {scannedCode}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="bg-destructive text-white py-1.5 px-3 rounded-md hover:bg-destructive/90 transition-colors text-sm"
            >
              -1
            </button>
            <button
              onClick={() => handleQuantityChange(1)}
              className="bg-success text-white py-1.5 px-3 rounded-md hover:bg-success/90 transition-colors text-sm"
            >
              +1
            </button>
          </div>
        </div>
      )}
    </div>
  );
};