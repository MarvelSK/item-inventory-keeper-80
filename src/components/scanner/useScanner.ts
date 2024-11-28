import { useState, useRef } from 'react';
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Item } from "@/lib/types";
import { ScanMode, ScanStatus } from "./types";
import { useTorch } from './useTorch';

export const useScanner = (onScan: (code: string) => void) => {
  const [isScanning, setIsScanning] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader>();
  const mediaStream = useRef<MediaStream | null>(null);
  
  const { toggleTorch } = useTorch(mediaStream.current);

  const handleTorchToggle = async () => {
    const success = await toggleTorch(torchEnabled);
    if (success) {
      setTorchEnabled(!torchEnabled);
    }
  };

  const startScanning = async () => {
    try {
      if (!videoRef.current) return;

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: "environment",
          advanced: [{
            torch: torchEnabled
          }] as MediaTrackConstraints['advanced']
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
            onScan(result.getText());
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
    setTorchEnabled(false);
  };

  return {
    isScanning,
    torchEnabled,
    videoRef,
    startScanning,
    stopScanning,
    handleTorchToggle
  };
};