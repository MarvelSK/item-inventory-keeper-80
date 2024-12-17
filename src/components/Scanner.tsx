import * as SDCCore from '@scandit/web-datacapture-core';
import * as SDCBarcode from '@scandit/web-datacapture-barcode';
import { useEffect } from 'react';

// Using the license key from Supabase secrets
const licenseKey = "AQtTEp4aKk5gKz9um5ATcK0gs1KcFHJzYmE4Y2IxZmVkLTg4YWUtNDU2Mi1hOTdkLTVlNGQxZDc0NWYzMXhJU1BsV2dLT1BMbkJlbW5UaWh4R2l1cUplY3RJb1hIOUoxUHBqS0JKWHFjR2pJeXhLSTJsbXpqb1BSaXRQZ3VSend4RDRJbnl0TUZvYnI4U0h2WXBDdWk5QUVqanRZdnhwR0FUTWlxL0k4VVdIYkVzRkpYNU5ZcS9yZkhxUnlZbXN6d1ZjN1ZETzl4ZHpsRWtLZmNYY1ZJY0tGUUlqY2JjQT09";

const Scanner = () => {
  useEffect(() => {
    async function runScanner() {
      await SDCCore.configure({
        licenseKey: licenseKey,
        libraryLocation: '/engine',
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
        SDCBarcode.Symbology.UPCE,
        SDCBarcode.Symbology.EAN13UPCA
      ]);

      const symbologySetting = settings.settingsForSymbology(SDCBarcode.Symbology.Code39);
      symbologySetting.activeSymbolCounts = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

      const barcodeCapture = await SDCBarcode.BarcodeCapture.forContext(context, settings);
      await barcodeCapture.setEnabled(false);

      barcodeCapture.addListener({
        didScan: async (mode: any, session: any) => {
          await mode.setEnabled(false);
          const barcode = session.newlyRecognizedBarcodes[0];
          console.log('Scanned barcode:', barcode); // Debug log
          const symbology = new SDCBarcode.SymbologyDescription(barcode.symbology);
          const barcodeData = typeof barcode.data === 'object' ? JSON.stringify(barcode.data) : String(barcode.data);
          showResult(barcodeData, symbology.readableName);
          await mode.setEnabled(true);
        },
      });

      const view = await SDCCore.DataCaptureView.forContext(context);
      view.connectToElement(document.getElementById("data-capture-view"));
      view.addControl(new SDCCore.CameraSwitchControl());

      const barcodeCaptureOverlay =
        await SDCBarcode.BarcodeCaptureOverlay.withBarcodeCaptureForViewWithStyle(
          barcodeCapture,
          view,
          SDCBarcode.BarcodeCaptureOverlayStyle.Frame
        );

      const viewfinder = new SDCCore.RectangularViewfinder(
        SDCCore.RectangularViewfinderStyle.Square,
        SDCCore.RectangularViewfinderLineStyle.Light
      );

      await barcodeCaptureOverlay.setViewfinder(viewfinder);

      await camera.switchToDesiredState(SDCCore.FrameSourceState.On);
      await barcodeCapture.setEnabled(true);

      // Cleanup function
      return () => {
        barcodeCapture.setEnabled(false);
        context.dispose();
      };
    }

    function showResult(data: string, symbology: string) {
      alert(`Scanned: ${data} (${symbology})`);
    }

    runScanner().catch((error) => {
      console.error(error);
      alert(error);
    });
  }, []);

  return (
    <div id="data-capture-view"></div>
  );
};

export default Scanner;