import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Camera,
  CameraSettings,
  DataCaptureContext,
  DataCaptureView,
  FrameSourceState,
} from "@scandit/web-datacapture-core";
import {
  BarcodeCapture,
  BarcodeCaptureOverlay,
  BarcodeCaptureSettings,
  Symbology,
} from "@scandit/web-datacapture-barcode";
import { Button } from "../ui/button";
import { findItemByCode } from "@/lib/services/itemService";
import { ItemPreview } from "./ItemPreview";

interface ScanditViewProps {
  context: DataCaptureContext;
}

export const ScanditView = ({ context }: ScanditViewProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [camera, setCamera] = useState<Camera | null>(null);
  const [barcodeCapture, setBarcodeCapture] = useState<BarcodeCapture | null>(null);
  const [scannedItem, setScannedItem] = useState<any>(null);

  useEffect(() => {
    setupScanner();
    return () => cleanup();
  }, [context]);

  const setupScanner = async () => {
    try {
      // Setup camera
      const newCamera = Camera.default;
      if (newCamera) {
        const cameraSettings = new CameraSettings();
        cameraSettings.preferredResolution = { width: 1280, height: 720 };
        await newCamera.applySettings(cameraSettings);
        await context.setFrameSource(newCamera);
        setCamera(newCamera);
      }

      // Setup barcode capture
      const settings = new BarcodeCaptureSettings();
      settings.enableSymbologies([Symbology.Code128]);
      const newBarcodeCapture = BarcodeCapture.forContext(context, settings);

      newBarcodeCapture.addListener({
        didScan: async (mode, session) => {
          const barcode = session.newlyRecognizedBarcodes[0];
          if (barcode) {
            const code = barcode.data;
            const item = await findItemByCode(code);
            if (item) {
              setScannedItem(item);
              toast.success(`Found item: ${item.code}`);
            } else {
              toast.error(`No item found with code: ${code}`);
            }
          }
        },
      });

      // Setup view and overlay
      const view = await DataCaptureView.forContext(context);
      await BarcodeCaptureOverlay.withBarcodeCapture(newBarcodeCapture);
      
      const viewElement = document.getElementById('scandit-view');
      if (viewElement) {
        viewElement.replaceChildren(view.htmlElement);
      }

      setBarcodeCapture(newBarcodeCapture);
    } catch (error) {
      console.error('Error setting up scanner:', error);
      toast.error("Failed to setup scanner");
    }
  };

  const cleanup = () => {
    if (barcodeCapture) {
      barcodeCapture.isEnabled = false;
      barcodeCapture.dispose();
    }
    if (camera) {
      camera.switchToDesiredState(FrameSourceState.Off);
    }
  };

  const handleStartScanning = async () => {
    if (camera && barcodeCapture) {
      try {
        await camera.switchToDesiredState(FrameSourceState.On);
        barcodeCapture.isEnabled = true;
        setIsScanning(true);
      } catch (error) {
        console.error('Error starting scanner:', error);
        toast.error("Failed to start scanner");
      }
    }
  };

  const handleStopScanning = async () => {
    if (camera && barcodeCapture) {
      try {
        await camera.switchToDesiredState(FrameSourceState.Off);
        barcodeCapture.isEnabled = false;
        setIsScanning(false);
      } catch (error) {
        console.error('Error stopping scanner:', error);
        toast.error("Failed to stop scanner");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        <Button
          onClick={handleStartScanning}
          disabled={isScanning}
        >
          Start Scanning
        </Button>
        <Button
          onClick={handleStopScanning}
          disabled={!isScanning}
          variant="destructive"
        >
          Stop Scanning
        </Button>
      </div>

      <div className="relative w-full max-w-2xl mx-auto">
        <div
          id="scandit-view"
          className="w-full aspect-[4/3] rounded-lg border-2 border-border overflow-hidden bg-muted/10"
        />
      </div>

      {scannedItem && <ItemPreview item={scannedItem} />}
    </div>
  );
};