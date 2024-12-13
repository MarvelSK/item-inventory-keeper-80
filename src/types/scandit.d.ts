declare module '@scandit/web-datacapture-core' {
  export class Camera {
    static default: Camera;
    desiredTorchState: boolean;
    switchToDesiredState(state: FrameSourceState): Promise<void>;
    applySettings(settings: CameraSettings): Promise<void>;
  }

  export class CameraSettings {
    preferredResolution: { width: number; height: number };
  }

  export class DataCaptureContext {
    static create(): Promise<DataCaptureContext>;
    setFrameSource(camera: Camera): Promise<void>;
    dispose(): void;
  }

  export class DataCaptureView {
    static forContext(context: DataCaptureContext): Promise<DataCaptureView>;
    htmlElement: HTMLElement;
  }

  export enum FrameSourceState {
    On = 'on',
    Off = 'off',
  }

  export function configure(licenseKey: string): Promise<void>;
}

declare module '@scandit/web-datacapture-barcode' {
  import { DataCaptureContext } from '@scandit/web-datacapture-core';

  export class BarcodeTrackingSettings {
    enableSymbologies(symbologies: Symbology[]): void;
  }

  export class BarcodeTracking {
    static forContext(context: DataCaptureContext, settings: BarcodeTrackingSettings): BarcodeTracking;
    isEnabled: boolean;
    dispose(): void;
    addListener(listener: {
      didUpdateSession: (mode: any, session: { trackedBarcodes: Array<{ barcode: { data: string } }> }) => void;
    }): void;
  }

  export class BarcodeTrackingBasicOverlay {
    static withBarcodeTracking(tracking: BarcodeTracking): Promise<BarcodeTrackingBasicOverlay>;
  }

  export enum Symbology {
    QR = 'qr',
    EAN13UPCA = 'ean13-upca',
    EAN8 = 'ean8',
    CODE128 = 'code128',
    CODE39 = 'code39',
  }
}