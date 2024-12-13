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

  export class BarcodeCaptureSettings {
    enableSymbologies(symbologies: Symbology[]): void;
  }

  export class BarcodeCapture {
    static forContext(context: DataCaptureContext, settings: BarcodeCaptureSettings): BarcodeCapture;
    isEnabled: boolean;
    dispose(): void;
    addListener(listener: {
      didScan: (mode: string, session: { newlyRecognizedBarcodes: Array<{ data: string }> }) => void;
    }): void;
    feedback: {
      success: {
        vibration: boolean;
        sound: boolean;
      };
    };
  }

  export enum Symbology {
    QR = 'qr',
    EAN13UPCA = 'ean13-upca',
    EAN8 = 'ean8',
    CODE128 = 'code128',
    CODE39 = 'code39',
  }

  export class SymbologyDescription {
    static forSymbology(symbology: Symbology): SymbologyDescription;
  }
}