import { useEffect, useRef, useState } from "react";
import Quagga from "quagga";
import { ScanMode, ScanStatus } from "@/components/scanner/types";
import { Item } from "@/lib/types";

export const useQuaggaScanner = (
  onDetected: (code: string) => void,
  isScanning: boolean
) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const [scanStatus, setScanStatus] = useState<ScanStatus>("none");
  const [canScan, setCanScan] = useState(true);

  useEffect(() => {
    if (isScanning && videoRef.current) {
      Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: videoRef.current,
            constraints: {
              facingMode: "environment",
              width: { min: 1280 },
              height: { min: 720 },
              aspectRatio: { min: 1, max: 2 }
            }
          },
          decoder: {
            readers: [
              "code_128_reader",
              "ean_reader",
              "ean_8_reader",
              "code_39_reader",
              "upc_reader",
              "upc_e_reader"
            ],
            multiple: false,
            debug: {
              drawBoundingBox: true,
              showPattern: true
            }
          },
          locate: true,
          locator: {
            patchSize: "large",
            halfSample: false
          }
        },
        (err) => {
          if (err) {
            console.error("Error initializing Quagga:", err);
            return;
          }
          Quagga.start();
        }
      );

      Quagga.onDetected((result) => {
        if (!canScan) return;
        
        if (result.codeResult.code) {
          setCanScan(false);
          setTimeout(() => setCanScan(true), 4000);
          onDetected(result.codeResult.code);
        }
      });

      return () => {
        Quagga.stop();
      };
    }
  }, [isScanning, canScan, onDetected]);

  return {
    videoRef,
    scanStatus,
    setScanStatus
  };
};