import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Button } from "./ui/button";
import { Camera, CameraOff } from "lucide-react";
import { useItems } from "@/hooks/useItems";
import { useCustomers } from "@/hooks/useCustomers";
import { toast } from "sonner";
import { TagBadge } from "./tags/TagBadge";
import { playSuccessSound, playErrorSound } from "@/lib/sounds";

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

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();
    return () => {
      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleScannedCode = async (code: string) => {
    if (!canScan) return;
    
    setCanScan(false);
    setTimeout(() => setCanScan(true), 1000);

    const item = items.find(item => item.code === code);
    if (!item) {
      playErrorSound();
      setScanStatus("error");
      toast.error("Položka nebola nájdená");
      setTimeout(() => setScanStatus("none"), 1000);
      return;
    }

    const customer = customers.find(c => c.id === item.customer);
    let newStatus;
    let success = false;

    switch (mode) {
      case "receiving":
        if (item.status === "waiting") {
          newStatus = "in_stock";
          success = true;
        }
        break;
      case "loading":
        if (item.status === "in_stock") {
          newStatus = "in_transit";
          success = true;
        }
        break;
      case "delivery":
        if (item.status === "in_transit") {
          newStatus = "delivered";
          success = true;
        }
        break;
    }

    if (success && newStatus) {
      try {
        await updateItem({ ...item, status: newStatus, updatedAt: new Date() });
        playSuccessSound();
        setScanStatus("success");
        
        if (customer?.tags && customer.tags.length > 0) {
          toast(
            <div className="space-y-2">
              <p className="font-medium">{customer.name}</p>
              <div className="flex flex-wrap gap-1">
                {customer.tags.map((tag) => (
                  <TagBadge key={tag.id} tag={tag} />
                ))}
              </div>
            </div>,
            {
              duration: 3000,
            }
          );
        }
      } catch (error) {
        playErrorSound();
        setScanStatus("error");
        toast.error("Chyba pri aktualizácii položky");
      }
    } else {
      playErrorSound();
      setScanStatus("error");
      toast.error("Nesprávny stav položky pre túto operáciu");
    }

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

  const getModeLabel = (mode: ScanMode) => {
    switch (mode) {
      case "receiving": return "Naskladnenie";
      case "loading": return "Naloženie";
      case "delivery": return "Doručenie";
    }
  };

  const getScannerBorderColor = () => {
    switch (scanStatus) {
      case "success": return "border-green-500";
      case "error": return "border-red-500";
      default: return "border-gray-200";
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-[#212490]">Skenovanie položiek</h2>
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
            className={`w-full h-full object-cover rounded-lg border-4 transition-colors ${getScannerBorderColor()}`}
            autoPlay
            playsInline
          />
        </div>
      </div>
    </div>
  );
};