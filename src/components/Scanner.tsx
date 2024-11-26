import { useState, useEffect, useRef } from "react";
import { BrowserMultiFormatReader, Result, DecodeHintType } from "@zxing/browser";
import { findItemByCode } from "@/lib/inventory";
import { Button } from "./ui/button";
import { Item } from "@/lib/types";
import { useItems } from "@/hooks/useItems";

type ScanMode = "naskladnenie" | "nalozenie" | "dorucenie";

const STATUS_TRANSITIONS = {
  naskladnenie: {
    from: "waiting",
    to: "in_stock",
  },
  nalozenie: {
    from: "in_stock",
    to: "in_transit",
  },
  dorucenie: {
    from: "in_transit",
    to: "delivered",
  }
} as const;

export const Scanner = () => {
  const [scanning, setScanning] = useState(false);
  const [scanMode, setScanMode] = useState<ScanMode>("naskladnenie");
  const { updateItem } = useItems();
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScanRef = useRef<string>("");
  const scanTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const hints = new Map();
    hints.set(DecodeHintType.TRY_HARDER, true);
    hints.set(DecodeHintType.ASSUME_GS1, true);
    
    readerRef.current = new BrowserMultiFormatReader(hints);

    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
      }
    };
  }, []);

  useEffect(() => {
    if (scanning && videoRef.current && containerRef.current) {
      readerRef.current?.decodeFromConstraints(
        {
          video: { facingMode: "environment" }
        },
        videoRef.current,
        async (result: Result | null, error?: any) => {
          if (result) {
            const code = result.getText();
            
            // Prevent multiple scans of the same code within 1 second
            if (code === lastScanRef.current) {
              return;
            }
            
            lastScanRef.current = code;
            if (scanTimeoutRef.current) {
              clearTimeout(scanTimeoutRef.current);
            }
            
            scanTimeoutRef.current = setTimeout(() => {
              lastScanRef.current = "";
              if (containerRef.current) {
                containerRef.current.style.border = "none";
              }
            }, 1000);

            const item = await findItemByCode(code.trim());
            
            if (!item) {
              if (containerRef.current) {
                containerRef.current.style.border = "4px solid red";
              }
              return;
            }

            const transition = STATUS_TRANSITIONS[scanMode];
            if (item.status !== transition.from) {
              if (containerRef.current) {
                containerRef.current.style.border = "4px solid red";
              }
              return;
            }

            try {
              const updatedItem = {
                ...item,
                status: transition.to,
                updatedAt: new Date()
              };
              await updateItem(updatedItem);
              if (containerRef.current) {
                containerRef.current.style.border = "4px solid green";
              }
            } catch (error) {
              if (containerRef.current) {
                containerRef.current.style.border = "4px solid red";
              }
            }
          }
        }
      );
    } else if (!scanning && readerRef.current) {
      readerRef.current.reset();
      if (containerRef.current) {
        containerRef.current.style.border = "none";
      }
    }
  }, [scanning, scanMode, updateItem]);

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

      <div 
        ref={containerRef}
        className="relative w-full max-w-sm mx-auto transition-all duration-200"
      >
        <Button
          onClick={() => setScanning(!scanning)}
          variant="outline"
          className="mb-4 w-full"
        >
          {scanning ? "Zastaviť skenovanie" : "Spustiť skenovanie"}
        </Button>
        <video
          ref={videoRef}
          className="w-full aspect-square object-cover rounded-lg"
        />
      </div>
    </div>
  );
};