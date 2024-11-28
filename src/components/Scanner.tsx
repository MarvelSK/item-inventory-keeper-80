import { useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { useItems } from "@/hooks/useItems";
import { ItemPreview } from "./scanner/ItemPreview";
import { ScanControls } from "./scanner/ScanControls";
import { useScanner } from "@/hooks/useScanner";
import { useTorch } from "@/hooks/useTorch";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Flashlight, FlashlightOff, SwitchCamera } from "lucide-react";

export const Scanner = () => {
  const navigate = useNavigate();
  const { items, updateItem: originalUpdateItem } = useItems();
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
    handleScannedCode,
    facingMode,
    setFacingMode
  } = useScanner(items, updateItem);

  const { toggleTorch } = useTorch(mediaStream, torchEnabled, setTorchEnabled);

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
    if (codeReader.current) {
      codeReader.current.stopStreams();
    }
    setIsScanning(false);
    setTorchEnabled(false);
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === "environment" ? "user" : "environment");
  };

  const getScannerBorderColor = () => {
    switch (scanStatus) {
      case "success": return "border-success/50";
      case "error": return "border-destructive/50";
      default: return "border-transparent";
    }
  };

  return (
    <div className="fixed inset-0 bg-black">
      <div className="relative h-full flex flex-col">
        {/* Scanned Item Preview */}
        <div className="absolute top-0 left-0 right-0 p-4 z-10 pointer-events-none">
          <div className="pointer-events-auto">
            <ItemPreview item={scannedItem} />
          </div>
        </div>

        {/* Camera View */}
        <div className="relative flex-1">
          <video
            ref={videoRef}
            className={`w-full h-full object-cover transition-colors ${getScannerBorderColor()}`}
            autoPlay
            playsInline
            muted
          />
          
          {/* Scanner Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="h-full flex flex-col">
              {/* Top Bar */}
              <div className="p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
                <button
                  onClick={() => navigate(-1)}
                  className="w-10 h-10 flex items-center justify-center text-white bg-black/20 rounded-full backdrop-blur-sm pointer-events-auto"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-white font-medium">Skenovanie</h2>
                <div className="flex gap-2">
                  <button
                    onClick={toggleCamera}
                    className="w-10 h-10 flex items-center justify-center text-white bg-black/20 rounded-full backdrop-blur-sm pointer-events-auto"
                  >
                    <SwitchCamera className="w-6 h-6" />
                  </button>
                  <button
                    onClick={toggleTorch}
                    className="w-10 h-10 flex items-center justify-center text-white bg-black/20 rounded-full backdrop-blur-sm pointer-events-auto"
                  >
                    {torchEnabled ? <FlashlightOff className="w-6 h-6" /> : <Flashlight className="w-6 h-6" />}
                  </button>
                </div>
              </div>
              
              {/* Center Scanner Frame */}
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-[280px] aspect-square relative">
                  <div className="absolute inset-0 border-2 border-white/30 rounded-2xl" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-[2px] bg-white/50" />
                  </div>
                </div>
              </div>
              
              {/* Bottom Controls */}
              <div className="p-6 bg-gradient-to-t from-black/50 to-transparent pointer-events-auto">
                <ScanControls
                  mode={mode}
                  setMode={setMode}
                  isScanning={isScanning}
                  onStartScan={startScanning}
                  onStopScan={stopScanning}
                  onToggleTorch={toggleTorch}
                  torchEnabled={torchEnabled}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};