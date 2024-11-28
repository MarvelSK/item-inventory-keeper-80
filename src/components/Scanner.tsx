import { useEffect, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { useItems } from "@/hooks/useItems";
import { useScanner } from "@/hooks/useScanner";
import { useTorch } from "@/hooks/useTorch";
import { Item } from "@/lib/types";
import { ScannerLayout } from "./scanner/ScannerLayout";

export const Scanner = () => {
  const { items, updateItem: originalUpdateItem } = useItems();
  const [scanHistory, setScanHistory] = useState<Item[]>([]);
  
  const updateItem = async (item: any, showToast?: boolean) => {
    await originalUpdateItem(item, showToast);
  };
  
  const {
    isScanning,
    setIsScanning,
    mode,
    setMode,
    scanStatus,
    scannedItem,
    torchEnabled,
    setTorchEnabled,
    videoRef,
    codeReader,
    mediaStream,
    handleScannedCode: originalHandleScannedCode,
    facingMode,
    setFacingMode
  } = useScanner(items, updateItem);

  const { toggleTorch } = useTorch(mediaStream, torchEnabled, setTorchEnabled);

  const handleScannedCode = async (code: string) => {
    await originalHandleScannedCode(code);
    if (scannedItem) {
      setScanHistory(prev => [scannedItem, ...prev]);
    }
  };

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();
    startScanning();
    return () => {
      stopScanning();
    };
  }, []);

  useEffect(() => {
    if (isScanning) {
      stopScanning();
      startScanning();
    }
  }, [mode, facingMode]);

  const startScanning = async () => {
    try {
      if (!videoRef.current) return;

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
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
    codeReader.current?.reset();
    setIsScanning(false);
    setTorchEnabled(false);
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === "environment" ? "user" : "environment");
  };

  return (
    <ScannerLayout
      videoRef={videoRef}
      isScanning={isScanning}
      mode={mode}
      setMode={setMode}
      scanStatus={scanStatus}
      scannedItem={scannedItem}
      torchEnabled={torchEnabled}
      toggleTorch={toggleTorch}
      toggleCamera={toggleCamera}
      startScanning={startScanning}
      stopScanning={stopScanning}
      scanHistory={scanHistory}
    />
  );
};