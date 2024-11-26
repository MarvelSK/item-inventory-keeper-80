import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { toast } from "sonner";
import { Camera, CameraOff } from "lucide-react";
import { useItems } from "@/hooks/useItems";

type ScanMode = "receiving" | "loading" | "delivery";

export const Scanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [mode, setMode] = useState<ScanMode>("receiving");
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader>();
  const mediaStream = useRef<MediaStream | null>(null);
  const { items, updateItem } = useItems();

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();
    return () => {
      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleScannedCode = async (code: string) => {
    const item = items.find(item => item.code === code);
    if (!item) {
      toast.error(`Položka s kódom ${code} nebola nájdená`);
      return;
    }

    let newStatus;
    let message;

    switch (mode) {
      case "receiving":
        if (item.status !== "waiting") {
          toast.error("Položka nie je v stave 'Čaká na dovoz'");
          return;
        }
        newStatus = "in_stock";
        message = "Položka bola naskladnená";
        break;
      case "loading":
        if (item.status !== "in_stock") {
          toast.error("Položka nie je v stave 'Na sklade'");
          return;
        }
        newStatus = "in_transit";
        message = "Položka bola naložená";
        break;
      case "delivery":
        if (item.status !== "in_transit") {
          toast.error("Položka nie je v stave 'V preprave'");
          return;
        }
        newStatus = "delivered";
        message = "Položka bola doručená";
        break;
    }

    try {
      await updateItem({ ...item, status: newStatus, updatedAt: new Date() });
      toast.success(message);
    } catch (error) {
      toast.error("Chyba pri aktualizácii položky");
    }
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

  const getModeLabel = (mode: ScanMode) => {
    switch (mode) {
      case "receiving": return "Naskladnenie";
      case "loading": return "Naloženie";
      case "delivery": return "Doručenie";
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {["receiving", "loading", "delivery"].map((m) => (
              <Button
                key={m}
                onClick={() => setMode(m as ScanMode)}
                variant={mode === m ? "default" : "outline"}
              >
                {getModeLabel(m as ScanMode)}
              </Button>
            ))}
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