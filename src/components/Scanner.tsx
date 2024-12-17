import { useEffect, useRef, useState } from 'react';
import { toast } from "sonner";

declare global {
  interface Window {
    ScanbotSDK: any;
  }
}

const LICENSE_KEY = "NUy20xKMMFxgxA3AmeMFxW0eXkySTG" +
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeScanner = async () => {
      try {
        if (!containerRef.current) {
          throw new Error('Scanner container not found');
        }

        setIsLoading(true);
        setError(null);

        // Load SDK script
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/scanbot-web-sdk@5.1.3/bundle/ScanbotSDK.min.js';
        script.async = true;

        const loadPromise = new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Scanbot SDK script'));
        });

        document.head.appendChild(script);
        await loadPromise;

        if (!isMounted) return;

        // Initialize SDK
        const sdk = await window.ScanbotSDK.initialize({
          licenseKey: LICENSE_KEY,
          engine: '/assets/scanbot-sdk/',
        });

        if (!isMounted) return;

        // Create barcode scanner
        const scanner = await sdk.createBarcodeScanner({
          containerId: containerRef.current.id,
          style: {
            window: {
              borderColor: '#0D9488',
            },
          },
          onBarcodesDetected: (result: any) => {
            if (result.barcodes.length > 0) {
              const barcode = result.barcodes[0];
              toast.success(`Scanned: ${barcode.text} (${barcode.format})`);
            }
          },
          preferredCamera: 'camera2',
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

        if (!isMounted) return;

        scannerRef.current = scanner;
        await scanner.startScanning();
        setIsLoading(false);
      } catch (error: any) {
        console.error('Scanner initialization failed:', error);
        if (isMounted) {
          setError(error?.message || 'Failed to initialize scanner');
          setIsLoading(false);
          toast.error(`Scanner error: ${error?.message || 'Unknown error'}`);
        }
      }
    };

    const uniqueId = `scanner-container-${Math.random().toString(36).substr(2, 9)}`;
    if (containerRef.current) {
      containerRef.current.id = uniqueId;
      initializeScanner();
    }

    return () => {
      isMounted = false;
      if (scannerRef.current) {
        try {
          scannerRef.current.dispose();
        } catch (error) {
          console.error('Error disposing scanner:', error);
        }
        scannerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div 
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