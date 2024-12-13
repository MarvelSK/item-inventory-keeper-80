import { useEffect, useRef, useState } from 'react';
import {
  Camera,
  CameraSettings,
  DataCaptureContext,
  DataCaptureView,
  FrameSourceState,
  configure,
  RectangularViewfinder,
  Color,
  Brush,
} from '@scandit/web-datacapture-core';
import {
  BarcodeCaptureSettings,
  BarcodeCapture,
  Symbology,
  BarcodeCaptureOverlay,
  BarcodeCaptureMode,
  BarcodeTracking,
  BarcodeTrackingSettings,
  BarcodeTrackingBasicOverlay,
} from '@scandit/web-datacapture-barcode';
import { ScanMode } from '@/components/scanner/types';
import { supabase } from '@/integrations/supabase/client';

export const useScanditScanner = (
  onScan: (code: string) => void,
  isScanning: boolean,
  mode: ScanMode,
  torchEnabled: boolean
) => {
  const context = useRef<DataCaptureContext>();
  const view = useRef<DataCaptureView>();
  const barcodeTracking = useRef<BarcodeTracking>();
  const camera = useRef<Camera>();
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

        // Configure barcode tracking settings
        const settings = new BarcodeTrackingSettings();
        settings.enableSymbologies([
          Symbology.QR,
          Symbology.EAN13UPCA,
          Symbology.EAN8,
          Symbology.CODE128,
          Symbology.CODE39,
        ]);

        // Create barcode tracking instance
        barcodeTracking.current = BarcodeTracking.forContext(context.current, settings);

        // Create and customize the tracking overlay
        view.current = await DataCaptureView.forContext(context.current);
        const overlay = await BarcodeTrackingBasicOverlay.withBarcodeTracking(barcodeTracking.current);
        
        // Customize the overlay appearance
        overlay.brush = new Brush(
          Color.fromRGBA(0, 255, 0, 0.2),
          Color.fromRGBA(0, 255, 0, 1),
          2
        );

        // Handle tracked barcodes
        barcodeTracking.current.addListener({
          didUpdateSession: (mode, session) => {
            session.trackedBarcodes.forEach((trackedBarcode) => {
              if (trackedBarcode.barcode) {
                onScan(trackedBarcode.barcode.data as string);
              }
            });
          },
        });

        // Add the view to the DOM
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
      if (barcodeTracking.current) {
        barcodeTracking.current.dispose();
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
      if (barcodeTracking.current) {
        barcodeTracking.current.isEnabled = true;
      }
    } else {
      if (camera.current) {
        camera.current.switchToDesiredState(FrameSourceState.Off);
      }
      if (barcodeTracking.current) {
        barcodeTracking.current.isEnabled = false;
      }
    }
  }, [isScanning]);

  return { error };
};