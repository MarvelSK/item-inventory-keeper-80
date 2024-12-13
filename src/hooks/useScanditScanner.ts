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
  Symbology,
  BarcodeCapture,
  BarcodeCaptureSettings,
  BarcodeCaptureOverlay,
} from '@scandit/web-datacapture-barcode';

export const useScanditScanner = (
  onScan: (code: string) => void,
  isScanning: boolean,
  torchEnabled: boolean
) => {
  const context = useRef<DataCaptureContext>();
  const view = useRef<DataCaptureView>();
  const barcodeCapture = useRef<BarcodeCapture>();
  const camera = useRef<Camera>();
  const [error, setError] = useState<string | null>(null);
  const scannedBarcodes = useRef<Set<string>>(new Set());

  useEffect(() => {
    const initializeScandit = async () => {
      try {
        const key = localStorage.getItem("scanditKey");
        if (!key) {
          throw new Error('No Scandit license key found');
        }

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

        // Configure barcode capture settings
        const settings = new BarcodeCaptureSettings();
        settings.enableSymbologies([
          Symbology.QR,
          Symbology.EAN13UPCA,
          Symbology.EAN8,
          Symbology.Code128,
          Symbology.Code39,
        ]);

        // Create barcode capture instance
        barcodeCapture.current = BarcodeCapture.forContext(context.current, settings);
        
        // Create data capture view
        view.current = await DataCaptureView.forContext(context.current);
        
        // Add overlay
        await BarcodeCaptureOverlay.withBarcodeCapture(barcodeCapture.current);

        // Handle scanned barcodes
        barcodeCapture.current.addListener({
          didScan: (_, session) => {
            const barcode = session.newlyRecognizedBarcodes[0];
            if (barcode && !scannedBarcodes.current.has(barcode.data)) {
              scannedBarcodes.current.add(barcode.data);
              onScan(barcode.data);
            }
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
      scannedBarcodes.current.clear();
    }

    return () => {
      if (barcodeCapture.current) {
        barcodeCapture.current.dispose();
      }
      if (context.current) {
        context.current.dispose();
      }
      scannedBarcodes.current.clear();
    };
  }, [isScanning, onScan]);

  useEffect(() => {
    if (camera.current && camera.current.desiredTorchState !== undefined) {
      camera.current.desiredTorchState = torchEnabled;
    }
  }, [torchEnabled]);

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

  return { error };
};