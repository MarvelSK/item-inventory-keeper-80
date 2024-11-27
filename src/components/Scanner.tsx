import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { useItems } from "@/hooks/useItems";
import { useCustomers } from "@/hooks/useCustomers";
import { handleScanResult } from "@/lib/scanHandlers";
import { ScannerUI } from "./scanner/ScannerUI";

type ScanMode = "receiving" | "loading" | "delivery";
type ScanStatus = "none" | "success" | "error";

export const Scanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [mode, setMode] = useState<ScanMode>("receiving");
  const [scanStatus, setScanStatus] = useState<ScanStatus>("none");
  const [canScan, setCanScan] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader>();
  const mediaStream = useRef<MediaStream | null>(null);
  const { items, updateItem } = useItems();
  const { customers } = useCustomers();
  const lastScannedCode = useRef<string | null>(null);

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();
    return () => {
      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleScannedCode = async (code: string) => {
    if (!canScan || lastScannedCode.current === code) return;
    
    setCanScan(false);
    setTimeout(() => setCanScan(true), 1000);
    
    lastScannedCode.current = code;
    setTimeout(() => {
      if (lastScannedCode.current === code) {
        lastScannedCode.current = null;
      }
    }, 3000);

    const item = items.find(item => item.code === code);
    const customer = customers.find(c => c.id === item?.customer);
    
    const result = await handleScanResult(item, mode, customer, updateItem);
    setScanStatus(result.status);
    setTimeout(() => setScanStatus("none"), 1000);
  };

  const startScanning = async () => {
    try {
      if (!videoRef.current) return;

      const constraints = {
        video: { facingMode: "environment" }
      };

      mediaStream.current = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = mediaStream.current;
      
      setIsScanning(true);

      await codeReader.current?.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result, error) => {
          if (result) {
            handleScannedCode(result.getText());
          }
          if (error && !(error instanceof TypeError)) {
            console.error(error);
          }
        }
      );
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopScanning = () => {
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => track.stop());
      mediaStream.current = null;
    }
    setIsScanning(false);
  };

  return (
    <ScannerUI
      isScanning={isScanning}
      mode={mode}
      scanStatus={scanStatus}
      onModeChange={setMode}
      onScanningToggle={isScanning ? stopScanning : startScanning}
      videoRef={videoRef}
    />
  );
};