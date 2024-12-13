import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Camera,
  CameraSettings,
  DataCaptureContext,
  DataCaptureView,
  FrameSourceState,
  configure,
} from "@scandit/web-datacapture-core";
import {
  BarcodeCapture,
  BarcodeCaptureOverlay,
  BarcodeCaptureSettings,
  Symbology,
} from "@scandit/web-datacapture-barcode";
import { useItems } from "@/hooks/useItems";
import { ItemPreview } from "./scanner/ItemPreview";
import { findItemByCode } from "@/lib/services/itemService";

export const Scanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [context, setContext] = useState<DataCaptureContext | null>(null);
  const [barcodeCapture, setBarcodeCapture] = useState<BarcodeCapture | null>(null);
  const [camera, setCamera] = useState<Camera | null>(null);
  const [scannedItem, setScannedItem] = useState<any>(null);
  const { updateItem } = useItems();

  useEffect(() => {
    initializeScanner();
    return () => {
      // Cleanup
      if (barcodeCapture) {
        barcodeCapture.isEnabled = false;
        barcodeCapture.dispose();
      }
      if (context) {
        context.dispose();
      }
    };
  }, []);

  const initializeScanner = async () => {
    try {
      // Fetch Scandit key from Supabase
      const { data, error } = await supabase
        .from('scanner_settings')
        .select('scandit_key')
        .limit(1);

      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast.error("Please configure your Scandit license key first");
        setIsInitializing(false);
        return;
      }

      const licenseKey = data[0].scandit_key;

      // Configure license
      await configure(licenseKey);

      // Create data capture context
      const newContext = await DataCaptureContext.create();

      // Create barcode capture settings
      const settings = new BarcodeCaptureSettings();
      settings.enableSymbologies([Symbology.Code128]);

      // Create barcode capture mode
      const newBarcodeCapture = BarcodeCapture.forContext(newContext, settings);

      // Register listener
      newBarcodeCapture.addListener({
        didScan: async (mode, session) => {
          const barcode = session.newlyRecognizedBarcodes[0];
          if (barcode) {
            const code = barcode.data;
            console.log("Barcode scanned:", code);
            
            // Find item by code
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

      // Setup camera
      const newCamera = Camera.default;
      if (newCamera) {
        const cameraSettings = new CameraSettings();
        cameraSettings.preferredResolution = { width: 1280, height: 720 };
        newCamera.applySettings(cameraSettings);
        newContext.setFrameSource(newCamera);
      } else {
        toast.error("No camera available");
      }

      // Create data capture view and add overlay
      const view = await DataCaptureView.forContext(newContext);
      const overlay = await BarcodeCaptureOverlay.withBarcodeCapture(newBarcodeCapture);
      
      // Add the view to the DOM
      const viewElement = document.getElementById('scandit-view');
      if (viewElement) {
        viewElement.replaceChildren(view.htmlElement);
      }

      setContext(newContext);
      setBarcodeCapture(newBarcodeCapture);
      setCamera(newCamera);
      setIsInitializing(false);

    } catch (error) {
      console.error('Error initializing scanner:', error);
      toast.error("Failed to initialize scanner");
      setIsInitializing(false);
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

  if (isInitializing) {
    return (
      <Card className="p-4 md:p-6">
        <div>Initializing scanner...</div>
      </Card>
    );
  }

  return (
    <Card className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-primary">Scanner</h2>
      </div>

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
    </Card>
  );
};