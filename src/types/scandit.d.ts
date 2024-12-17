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
    connectToElement(element: HTMLElement): void;
    addControl(control: any): void;
  }

  export class CameraSwitchControl {}

  export class RectangularViewfinder {
    constructor(style: RectangularViewfinderStyle, lineStyle: RectangularViewfinderLineStyle);
  }

  export enum RectangularViewfinderStyle {
    Square = 'square',
  }

  export enum RectangularViewfinderLineStyle {
    Light = 'light',
  }

  export enum FrameSourceState {
    On = 'on',
    Off = 'off',
  }

  export function configure(options: { licenseKey: string; moduleLoaders: any[] }): Promise<void>;
}

declare module '@scandit/web-datacapture-barcode' {
  import { DataCaptureContext, DataCaptureView } from '@scandit/web-datacapture-core';

  export class BarcodeCaptureSettings {
    enableSymbologies(symbologies: Symbology[]): void;
  }

  export class BarcodeCapture {
    static forContext(context: DataCaptureContext, settings: BarcodeCaptureSettings): BarcodeCapture;
    isEnabled: boolean;
    dispose(): void;
    addListener(listener: {
      didScan: (mode: any, session: { newlyRecognizedBarcodes: Array<{ data: string }> }) => void;
    }): void;
  }

  export class BarcodeCaptureOverlay {
    static withBarcodeCapture(capture: BarcodeCapture): Promise<BarcodeCaptureOverlay>;
    viewfinder: any;
  }

  export enum Symbology {
    QR = 'qr',
    EAN13UPCA = 'ean13-upca',
    EAN8 = 'ean8',
    Code128 = 'code128',
    Code39 = 'code39',
  }

  export function barcodeCaptureLoader(): any;
}