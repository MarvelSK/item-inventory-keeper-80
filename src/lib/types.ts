export interface Item {
  id: string;
  code: string;
  description?: string;
  status: "waiting" | "in_stock" | "in_transit" | "delivered";
  createdAt: string;
  updatedAt: string;
  customer?: string;
  height?: number;
  width?: number;
  length?: number;
  postponed: boolean;
  postponeReason?: string;
}

export interface BarcodeDetector {
  detect(image: HTMLVideoElement): Promise<Array<{ rawValue: string }>>;
}
