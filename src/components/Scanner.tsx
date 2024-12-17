import { useEffect, useRef, useState } from 'react';
import { toast } from "sonner";

// Add type declaration for ScanbotSDK on window
declare global {
  interface Window {
    ScanbotSDK: any; // Using 'any' for now, but we could create proper types if needed
  }
}

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

// Load Scanbot SDK script
const loadScanbotSDK = async () => {
  try {
    // Create a new script element
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/scanbot-web-sdk@5.1.3/bundle/ScanbotSDK.min.js';
    script.async = true;
    
    const loadPromise = new Promise<typeof window.ScanbotSDK>((resolve, reject) => {
      script.onload = () => resolve(window.ScanbotSDK);
      script.onerror = () => reject(new Error('Failed to load Scanbot SDK script'));
    });
    
    // Append the script to head
    document.head.appendChild(script);
    return await loadPromise;
  } catch (error) {
    console.error('Failed to load Scanbot SDK script:', error);
    throw error;
  }
};

const Scanner = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeScanner = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Loading Scanbot SDK...');
        const ScanbotSDK = await loadScanbotSDK();
        
        console.log('Initializing SDK...');
        const sdk = await ScanbotSDK.initialize({
          licenseKey: LICENSE_KEY,
        });

        console.log('SDK initialized successfully');

        if (!containerRef.current) {
          throw new Error('Scanner container not found');
        }

        // Create barcode scanner
        console.log('Creating barcode scanner...');
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

        console.log('Barcode scanner created successfully');
        scannerRef.current = scanner;
        
        // Start the scanner
        await scanner.startScanning();
        console.log('Scanner started successfully');
        setIsLoading(false);
      } catch (error: any) {
        console.error('Failed to initialize scanner:', error);
        const errorMessage = error?.message || 'Unknown error occurred';
        setError(errorMessage);
        toast.error(`Scanner initialization failed: ${errorMessage}`);
        setIsLoading(false);
      }
    };

    if (containerRef.current) {
      initializeScanner();
    }

    // Cleanup function
    return () => {
      if (scannerRef.current) {
        console.log('Disposing scanner...');
        scannerRef.current.dispose();
        scannerRef.current = null;
      }
      
      // Remove all Scanbot SDK scripts safely
      const scripts = document.querySelectorAll('script[src*="scanbot-web-sdk"]');
      scripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div 
        id="scanner-container" 
        ref={containerRef}
        className="w-full h-[80vh] bg-black rounded-lg overflow-hidden relative"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Initializing camera...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white text-center p-4">
              <p className="text-red-400 mb-2">Scanner Error</p>
              <p className="text-sm">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scanner;