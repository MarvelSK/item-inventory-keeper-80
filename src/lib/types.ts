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
  created_by?: string;
  updated_by?: string;
  tags: Tag[];
  deleted: boolean;
}

export interface Customer {
  id: string;
  name: string;
  tags?: Tag[];
  deleted?: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface BarcodeDetector {
  detect(image: HTMLVideoElement): Promise<Array<{ rawValue: string }>>;
}

export interface DbItem {
  id: string;
  code: string;
  description?: string;
  status: "waiting" | "in_stock" | "in_transit" | "delivered";
  created_at: string;
  updated_at: string;
  customer: string;
  height?: number;
  width?: number;
  length?: number;
  postponed: boolean;
  postpone_reason?: string;
  created_by?: string;
  updated_by?: string;
  tags: Tag[];
  deleted: boolean;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]