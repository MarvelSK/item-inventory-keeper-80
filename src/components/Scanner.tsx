import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { toast } from "sonner";
import { Camera, CameraOff } from "lucide-react";

type ScanMode = "qr" | "barcode";

export const Scanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [mode, setMode] = useState<ScanMode>("qr");
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader>();
  const mediaStream = useRef<MediaStream | null>(null);

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();
    return () => {
      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      if (!videoRef.current) return;

      const constraints = {
        video: { facingMode: "environment" }
      };

      mediaStream.current = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = mediaStream.current;
      
      setIsScanning(true);

      const result = await codeReader.current?.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result, error) => {
          if (result) {
            toast.success(`Code scanned: ${result.text}`);
          }
          if (error && !(error instanceof TypeError)) {
            console.error(error);
          }
        }
      );

      if (result) {
        toast.success(`Code scanned: ${result.text}`);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Failed to access camera. Please check permissions.");
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
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex justify-center gap-2">
            <Button
              variant={mode === "qr" ? "default" : "outline"}
              onClick={() => setMode("qr")}
              className="w-full sm:w-auto"
            >
              QR Code
            </Button>
            <Button
              variant={mode === "barcode" ? "default" : "outline"}
              onClick={() => setMode("barcode")}
              className="w-full sm:w-auto"
            >
              Barcode
            </Button>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={isScanning ? stopScanning : startScanning}
              className="w-full sm:w-auto"
            >
              {isScanning ? (
                <>
                  <CameraOff className="mr-2 h-4 w-4" />
                  Stop Scanning
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  Start Scanning
                </>
              )}
            </Button>
          </div>
          <div className="relative aspect-video max-w-md mx-auto">
            <video
              ref={videoRef}
              className="w-full h-full object-cover rounded-lg"
              autoPlay
              playsInline
            />
          </div>
        </div>
      </Card>
    </div>
  );
};