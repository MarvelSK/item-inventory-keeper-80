import { useEffect, useRef } from 'react';
import { toast } from "sonner";

// Initialize Scanbot SDK with provided license key
const LICENSE_KEY =
"NUy20xKMMFxgxA3AmeMFxW0eXkySTG" +
"68a4yEF6SfRIafsYzpa9xyBvicVMDu" +
"gw0mgohfyR3or1GEGwUcmE463oyi6u" +
"A7mHtTMrlRhPn4mL4aF0hrVmtu2wPz" +
"vKNXT5eYxO/7C+CPwx6acrDGDhVYOV" +
"w7KOcY3STrKgONSEgieOU5LsmqV3ew" +
"RlBUpkxvO/STKK+VpwW5kjxN1pEkbu" +
"OS828ZoGcnogbyzHMgP5gKG0ECb/Y" +
"hcMXBKoJBDTJicMuASTTxR5Pkm+Bdz" +
"OJSw0e9fpNVpoj3IMBiSWxWUiy915T" +
"5ywDiXof+LVUCGxD3rTn++UfEQajUH" +
"KkpH5LyiFGqw==\nU2NhbmJvdFNESw" +
"pjb20ubmV2YS53YXJlaG91c2UKMTcz" +
"NTA4NDc5OQo4Mzg4NjA3CjE5\n";

const Scanner = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    let ScanbotSDK: any;

    const initializeScanner = async () => {
      try {
        // Load the Scanbot SDK
        const SDK = await import('scanbot-web-sdk');
        ScanbotSDK = SDK.default;
        
        // Initialize the SDK with CDN path
        const sdk = await ScanbotSDK.initialize({
          licenseKey: LICENSE_KEY,
          engine: 'https://cdn.jsdelivr.net/npm/scanbot-web-sdk@5.1.3/bundle/',
        });

        // Create barcode scanner
        const scanner = await sdk.createBarcodeScanner({
          containerId: 'scanner-container',
          style: {
            window: {
              borderColor: '#0D9488', // Tailwind teal-600
            },
          },
          onBarcodesDetected: (result: any) => {
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