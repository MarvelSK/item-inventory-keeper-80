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
  const scannedBarcodes = useRef<Set<string>>(new Set());

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

        // Enable all supported symbologies
        settings.enableSymbologies([
          Symbology.QR,
          Symbology.EAN13UPCA,
          Symbology.EAN8,
          Symbology.CODE128,
          Symbology.CODE39,
        ]);

        // Create barcode tracking instance
        barcodeTracking.current = BarcodeTracking.forContext(context.current, settings);

        // Create data capture view
        view.current = await DataCaptureView.forContext(context.current);

        // Add tracking overlay
        const overlay = await BarcodeTrackingBasicOverlay.withBarcodeTracking(barcodeTracking.current);

        // Handle tracked barcodes
        barcodeTracking.current.addListener({
          didUpdateSession: (_, session) => {
            session.trackedBarcodes.forEach((trackedBarcode) => {
              if (trackedBarcode.barcode && !scannedBarcodes.current.has(trackedBarcode.barcode.data)) {
                scannedBarcodes.current.add(trackedBarcode.barcode.data);
                onScan(trackedBarcode.barcode.data);
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
      scannedBarcodes.current.clear(); // Clear scanned barcodes when starting new scan session
    }

    return () => {
      if (barcodeTracking.current) {
        barcodeTracking.current.dispose();
      }
      if (context.current) {
        context.current.dispose();
      }
      scannedBarcodes.current.clear();
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