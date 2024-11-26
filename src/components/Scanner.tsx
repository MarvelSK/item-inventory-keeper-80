import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { findItemByCode } from "@/lib/inventory";
import { Button } from "./ui/button";
import { Item } from "@/lib/types";
import { useItems } from "@/hooks/useItems";

type ScanMode = "naskladnenie" | "nalozenie" | "dorucenie";

const STATUS_TRANSITIONS = {
  naskladnenie: {
    from: "waiting",
    to: "in_stock"
  },
  nalozenie: {
    from: "in_stock",
    to: "in_transit"
  },
  dorucenie: {
    from: "in_transit",
    to: "delivered"
  }
} as const;

export const Scanner = () => {
  const [scanning, setScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const [scannedItem, setScannedItem] = useState<Item | null>(null);
  const [scanMode, setScanMode] = useState<ScanMode>("naskladnenie");
  const [lastScannedTime, setLastScannedTime] = useState(0);
  const [scanResult, setScanResult] = useState<"success" | "error" | null>(null);
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

  // Add styles for scan feedback
  useEffect(() => {
    const qrBox = document.querySelector("#reader__scan_region");
    if (qrBox) {
      if (scanResult === "success") {
        qrBox.classList.add("border-4", "border-green-500");
        qrBox.classList.remove("border-red-500");
      } else if (scanResult === "error") {
        qrBox.classList.add("border-4", "border-red-500");
        qrBox.classList.remove("border-green-500");
      } else {
        qrBox.classList.remove("border-4", "border-green-500", "border-red-500");
      }
      
      // Reset visual feedback after 1 second
      const timeout = setTimeout(() => {
        setScanResult(null);
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [scanResult]);

  const onScanSuccess = async (decodedText: string) => {
    const currentTime = Date.now();
    // Prevent multiple scans within 1 second
    if (currentTime - lastScannedTime < 1000) {
      return;
    }
    setLastScannedTime(currentTime);

    const trimmedCode = decodedText.trim();
    const item = await findItemByCode(trimmedCode);
    
    if (!item) {
      setScanResult("error");
      return;
    }

    const transition = STATUS_TRANSITIONS[scanMode];
    if (item.status !== transition.from) {
      setScanResult("error");
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
      setScanResult("success");
      setScannedCode(trimmedCode);
    } catch (error) {
      setScanResult("error");
    }
  };

  const onScanFailure = (error: any) => {
    console.warn(`Code scan error = ${error}`);
  };

  const resetScanner = () => {
    setScanning(false);
    setScannedCode(null);
    setScannedItem(null);
    setScanResult(null);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm w-full max-w-lg mx-auto">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">Skenovať položky</h2>
      
      <div className="flex flex-col sm:flex-row gap-2 mb-4 items-center justify-center">
        <Button
          variant={scanMode === "naskladnenie" ? "default" : "outline"}
          onClick={() => setScanMode("naskladnenie")}
          className="w-full sm:w-auto text-sm sm:text-base py-2"
        >
          Naskladnenie
        </Button>
        <Button
          variant={scanMode === "nalozenie" ? "default" : "outline"}
          onClick={() => setScanMode("nalozenie")}
          className="w-full sm:w-auto text-sm sm:text-base py-2"
        >
          Naloženie
        </Button>
        <Button
          variant={scanMode === "dorucenie" ? "default" : "outline"}
          onClick={() => setScanMode("dorucenie")}
          className="w-full sm:w-auto text-sm sm:text-base py-2"
        >
          Doručenie
        </Button>
      </div>

      <div id="reader" className="w-full max-w-sm mx-auto"></div>
      
      {scannedCode && scannedItem && (
        <div className="mt-4 space-y-4">
          <div className="text-center">
            <p className="font-medium text-sm sm:text-base">Kód: {scannedCode}</p>
            <p className="text-base sm:text-lg font-semibold mt-2">
              Status: {scannedItem.status}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};