export interface Item {
  id: string;
  code: string;
  customer: string;
  description?: string | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  status: 'waiting' | 'in_stock' | 'in_transit' | 'delivered';
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
  postponed?: boolean | null;
  postponeReason?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Customer {
  id: string;
  name: string;
  tags: Tag[];
  deleted: boolean;
}

// Alias Label to Tag for backward compatibility
export type Label = Tag;

// Database type for items as they come from Supabase
export interface DbItem {
  id: string;
  code: string;
  customer: string;
  description: string | null;
  length: number | null;
  width: number | null;
  height: number | null;
  status: string;
  tags: Json;
  created_at: string;
  updated_at: string;
  deleted: boolean;
  postponed: boolean | null;
  postpone_reason: string | null;
  created_by: string | null;
  updated_by: string | null;
}

// Helper type for JSON data
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];