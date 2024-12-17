import * as SDCCore from '@scandit/web-datacapture-core';
import * as SDCBarcode from '@scandit/web-datacapture-barcode';
import { useEffect, useRef } from 'react';
import { toast } from "sonner";

// Hardcoded license key for development
const SCANDIT_LICENSE_KEY = "AbvELRLKNvXhiDrQAK2tIF159zc1d8IRYwpEXWB2/dO2LcKNRtB+LbYeYw/5BiVq8W4QCpXrJW3FI/acz5U8p3CYVNqeCvxoZFVzGWJpQJQcB5UGVVUBcX+kR/dh1yB/HFqBZPdvj1KkKKQzI1o+5e1LvGUxwY5fNaBOYzwPGxJNp5wZ5iYEVmUKnQr2tGxeG8p/ykB7qrkkV0BFKLD1bwa/3gpl8ETyYr4WwZ5SVLaaC+8Qj3HhGhruBs5BDNIf81LvpQMEGO2HZxAQEYH+Zv4US3oWl5kGmX5+0g88cHdl3y9A4hqBqGXwVGhwPXpH3p8FZTuQnjqYlhzc3JBCtQmqX1tk4Hy9qvHqokg5bm2I0L0O43qYcHHBXhgRKc8B3J7nw4LBwcdL0gYsqyJaHh1E36ky3/eh+hTHhvQGzkYlhwRZqUgwuNQDh4GgXHvgvZvqWFPGrEFbjkD/0h6lR8XPcXrHKZUDwFwlQ+jWkzKNGZ0srJHqxzDk0Z3ZkYXRhY2FwdHVyZS13ZWItcHJlc2V0dGluZ3M=";

export const ScanditView = () => {
  const viewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function initializeScanner() {
      try {
        await SDCCore.configure({
          licenseKey: SCANDIT_LICENSE_KEY,
          moduleLoaders: [SDCBarcode.barcodeCaptureLoader()]
        });

        const context = await SDCCore.DataCaptureContext.create();
        const camera = SDCCore.Camera.default;
        await context.setFrameSource(camera);

        const settings = new SDCBarcode.BarcodeCaptureSettings();
        settings.enableSymbologies([
          SDCBarcode.Symbology.Code128,
          SDCBarcode.Symbology.Code39,
          SDCBarcode.Symbology.QR,
          SDCBarcode.Symbology.EAN8,
          SDCBarcode.Symbology.EAN13UPCA
        ]);

        const barcodeCapture = SDCBarcode.BarcodeCapture.forContext(context, settings);
        barcodeCapture.isEnabled = false;

        barcodeCapture.addListener({
          didScan: async (mode: any, session: { newlyRecognizedBarcodes: Array<{ data: string; symbology: any }> }) => {
            barcodeCapture.isEnabled = false;
            const barcode = session.newlyRecognizedBarcodes[0];
            
            // Show result using toast instead of alert
            toast.success(`Scanned: ${barcode.data}`);
            
            barcodeCapture.isEnabled = true;
          },
        });

        if (viewRef.current) {
          const view = await SDCCore.DataCaptureView.forContext(context);
          view.connectToElement(viewRef.current);
          view.addControl(new SDCCore.CameraSwitchControl());

          const barcodeCaptureOverlay = await SDCBarcode.BarcodeCaptureOverlay.withBarcodeCapture(barcodeCapture);
          barcodeCaptureOverlay.viewfinder = new SDCCore.RectangularViewfinder(
            SDCCore.RectangularViewfinderStyle.Square,
            SDCCore.RectangularViewfinderLineStyle.Light,
          );

          await camera.switchToDesiredState(SDCCore.FrameSourceState.On);
          barcodeCapture.isEnabled = true;
        }

        // Cleanup function
        return () => {
          barcodeCapture.isEnabled = false;
          camera.switchToDesiredState(SDCCore.FrameSourceState.Off);
          context.dispose();
        };
      } catch (error) {
        console.error('Error initializing scanner:', error);
        toast.error('Failed to initialize scanner');
      }
    }

    initializeScanner();
  }, []);

  return (
    <div 
      ref={viewRef} 
      className="w-full aspect-video rounded-lg overflow-hidden bg-black"
    />
  );
};