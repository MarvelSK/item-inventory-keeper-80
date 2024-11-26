import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { findItemByCode } from "@/lib/inventory";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Item } from "@/lib/types";
import { useItems } from "@/hooks/useItems";

type ScanMode = "naskladnenie" | "nalozenie" | "dorucenie";

const STATUS_TRANSITIONS = {
  naskladnenie: {
    from: "waiting",
    to: "in_stock",
    message: "Položka naskladnená"
  },
  nalozenie: {
    from: "in_stock",
    to: "in_transit",
    message: "Položka naložená"
  },
  dorucenie: {
    from: "in_transit",
    to: "delivered",
    message: "Položka doručená"
  }
} as const;

export const Scanner = () => {
  const [scanning, setScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const [scannedItem, setScannedItem] = useState<Item | null>(null);
  const [scanMode, setScanMode] = useState<ScanMode>("naskladnenie");
  const { updateItem } = useItems();

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
        setScannedItem(null);
      }, 2000);
      return;
    }

    const transition = STATUS_TRANSITIONS[scanMode];
    if (item.status !== transition.from) {
      toast.error(`Položka musí byť v stave "${transition.from}" pre ${scanMode}`);
      setTimeout(() => {
        setScanning(false);
        setScannedCode(null);
        setScannedItem(null);
      }, 2000);
      return;
    }

    try {
      const updatedItem = {
        ...item,
        status: transition.to,
        updatedAt: new Date()
      };
      await updateItem(updatedItem);
      setScannedItem(updatedItem);
      toast.success(transition.message);
    } catch (error) {
      toast.error("Chyba pri aktualizácii položky");
      setTimeout(() => {
        setScanning(false);
        setScannedCode(null);
        setScannedItem(null);
      }, 2000);
    }
  };

  const onScanFailure = (error: any) => {
    console.warn(`Code scan error = ${error}`);
  };

  const resetScanner = () => {
    setScanning(false);
    setScannedCode(null);
    setScannedItem(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Skenovať položky</h2>
      
      <div className="flex gap-2 mb-4">
        <Button
          variant={scanMode === "naskladnenie" ? "default" : "outline"}
          onClick={() => setScanMode("naskladnenie")}
        >
          Naskladnenie
        </Button>
        <Button
          variant={scanMode === "nalozenie" ? "default" : "outline"}
          onClick={() => setScanMode("nalozenie")}
        >
          Naloženie
        </Button>
        <Button
          variant={scanMode === "dorucenie" ? "default" : "outline"}
          onClick={() => setScanMode("dorucenie")}
        >
          Doručenie
        </Button>
      </div>

      <div id="reader" className="w-full max-w-sm mx-auto"></div>
      
      {scannedCode && scannedItem && (
        <div className="mt-4 space-y-4">
          <div className="text-center">
            <p className="font-medium">Kód: {scannedCode}</p>
            <p className="text-lg font-semibold mt-2">
              Status: {scannedItem.status}
            </p>
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