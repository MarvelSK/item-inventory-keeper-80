import { useEffect, useRef, useState } from "react";
import Quagga from "quagga";
import { ScanStatus } from "@/components/scanner/types";

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
              deviceId: "environment",
              width: { ideal: 640 },
              height: { ideal: 480 },
              aspectRatio: { ideal: 1.333333 }, // 4:3 aspect ratio
              advanced: [
                {
                  zoom: 1.0 // Disable zoom to prevent camera switching
                }
              ]
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
            patchSize: "medium",
            halfSample: true
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