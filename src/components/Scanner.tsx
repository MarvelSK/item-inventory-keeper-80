import { useEffect, useRef } from 'react';
import IScanbotSDK from 'scanbot-web-sdk/dist/types/interfaces/IScanbotSDK';
import { toast } from "sonner";

// Initialize Scanbot SDK with a free trial license
const LICENSE_KEY = 'trial';

const Scanner = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    let ScanbotSDK: IScanbotSDK;

    const initializeScanner = async () => {
      try {
        // Load the Scanbot SDK
        ScanbotSDK = await import('scanbot-web-sdk');
        
        // Initialize the SDK
        const sdk = await ScanbotSDK.initialize({
          licenseKey: LICENSE_KEY,
          engine: '/scanbot-web-sdk/',
        });

        // Create barcode scanner
        const scanner = await sdk.createBarcodeScanner({
          containerId: 'scanner-container',
          style: {
            window: {
              borderColor: '#0D9488', // Tailwind teal-600
            },
          },
          onBarcodesDetected: (result) => {
            if (result.barcodes.length > 0) {
              const barcode = result.barcodes[0];
              console.log('Scanned barcode:', barcode);
              toast.success(`Scanned: ${barcode.text} (${barcode.format})`);
            }
          },
          preferredCamera: 'camera2', // Usually the back camera
          barcodeFormats: [
            'CODE_128',
            'CODE_39',
            'EAN_8',
            'EAN_13',
            'UPC_A',
            'UPC_E',
            'QR_CODE',
          ],
        });

        scannerRef.current = scanner;
        
        // Start the scanner
        await scanner.startScanning();
      } catch (error) {
        console.error('Failed to initialize scanner:', error);
        toast.error('Failed to initialize scanner. Please try again.');
      }
    };

    if (containerRef.current) {
      initializeScanner();
    }

    // Cleanup function
    return () => {
      if (scannerRef.current) {
        scannerRef.current.dispose();
      }
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div 
        id="scanner-container" 
        ref={containerRef}
        className="w-full h-[80vh] bg-black rounded-lg overflow-hidden"
      />
    </div>
  );
};

export default Scanner;