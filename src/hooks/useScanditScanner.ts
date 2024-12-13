import { useEffect, useRef, useState } from 'react';
import {
  Camera,
  CameraSettings,
  DataCaptureContext,
  DataCaptureView,
  FrameSourceState,
  configure,
} from '@scandit/web-datacapture-core';
import {
  BarcodeCaptureSettings,
  BarcodeCapture,
  Symbology,
  SymbologyDescription,
} from '@scandit/web-datacapture-barcode';
import { ScanMode, ScanStatus } from '@/components/scanner/types';
import { supabase } from '@/integrations/supabase/client';

export const useScanditScanner = (
  onScan: (code: string) => void,
  isScanning: boolean,
  mode: ScanMode,
  torchEnabled: boolean
) => {
  const context = useRef<DataCaptureContext>();
  const view = useRef<DataCaptureView>();
  const barcodeCapture = useRef<BarcodeCapture>();
  const camera = useRef<Camera>();
  const [scanStatus, setScanStatus] = useState<ScanStatus>("none");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeScandit = async () => {
      try {
        // Get license key from Supabase Edge Function
        const { data: { key }, error: keyError } = await supabase.functions.invoke('get-scandit-key');
        if (keyError) throw new Error('Failed to get Scandit license key');

        // Configure Scandit license
        await configure(key);

        // Create DataCaptureContext
        context.current = await DataCaptureContext.create();

        // Setup camera
        camera.current = Camera.default;
        if (camera.current) {
          const cameraSettings = new CameraSettings();
          cameraSettings.preferredResolution = { width: 1280, height: 720 };
          camera.current.applySettings(cameraSettings);
          context.current.setFrameSource(camera.current);
        }

        // Configure barcode capture settings based on mode
        const settings = new BarcodeCaptureSettings();
        settings.enableSymbologies([
          Symbology.QR,
          Symbology.EAN13UPCA,
          Symbology.EAN8,
          Symbology.CODE128,
          Symbology.CODE39,
        ]);

        // Create barcode capture instance
        barcodeCapture.current = BarcodeCapture.forContext(context.current, settings);
        barcodeCapture.current.feedback.success = {
          vibration: true,
          sound: true,
        };

        // Handle barcode scanning
        barcodeCapture.current.addListener({
          didScan: (mode, session) => {
            const barcode = session.newlyRecognizedBarcodes[0];
            if (barcode) {
              onScan(barcode.data as string);
            }
          },
        });

        // Create and style the DataCaptureView
        view.current = await DataCaptureView.forContext(context.current);
        const viewElement = document.getElementById('scandit-view');
        if (viewElement) {
          viewElement.replaceChildren(view.current.htmlElement);
        }

      } catch (err) {
        console.error('Error initializing Scandit:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize scanner');
      }
    };

    if (isScanning) {
      initializeScandit();
    }

    return () => {
      if (barcodeCapture.current) {
        barcodeCapture.current.dispose();
      }
      if (context.current) {
        context.current.dispose();
      }
    };
  }, [isScanning]);

  // Handle torch state
  useEffect(() => {
    if (camera.current && camera.current.desiredTorchState !== undefined) {
      camera.current.desiredTorchState = torchEnabled;
    }
  }, [torchEnabled]);

  // Handle scanning state
  useEffect(() => {
    if (camera.current && isScanning) {
      camera.current.switchToDesiredState(FrameSourceState.On);
      if (barcodeCapture.current) {
        barcodeCapture.current.isEnabled = true;
      }
    } else {
      if (camera.current) {
        camera.current.switchToDesiredState(FrameSourceState.Off);
      }
      if (barcodeCapture.current) {
        barcodeCapture.current.isEnabled = false;
      }
    }
  }, [isScanning]);

  return { scanStatus, setScanStatus, error };
};