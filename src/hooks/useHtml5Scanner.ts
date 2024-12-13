import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { ScanStatus } from "@/components/scanner/types";

export const useHtml5Scanner = (
  onDetected: (code: string) => void,
  isScanning: boolean
) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [scanStatus, setScanStatus] = useState<ScanStatus>("none");

  useEffect(() => {
    if (isScanning && videoRef.current) {
      scannerRef.current = new Html5Qrcode("scanner");
      
      scannerRef.current
        .start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 150 },
            aspectRatio: 1.333333,
          },
          (decodedText) => {
            onDetected(decodedText);
          },
          (errorMessage) => {
            console.log(errorMessage);
          }
        )
        .catch((err) => {
          console.error("Error starting scanner:", err);
        });

      return () => {
        if (scannerRef.current) {
          scannerRef.current
            .stop()
            .catch((err) => console.error("Error stopping scanner:", err));
        }
      };
    }
  }, [isScanning, onDetected]);

  return {
    videoRef,
    scanStatus,
    setScanStatus,
  };
};