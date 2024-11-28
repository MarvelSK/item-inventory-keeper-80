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
  tags?: Tag[];
  deleted?: boolean;
  created_by?: string;
  updated_by?: string;
}

export interface Customer {
  id: string;
  name: string;
  tags: Tag[];
  deleted: boolean;
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

export interface Json {
  [key: string]: any;
}

export interface DbItem {
  id: string;
  code: string;
  customer: string;
  description?: string;
  length?: number;
  width?: number;
  height?: number;
  status: string;
  tags?: Json;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  deleted: boolean;
  postponed: boolean;
  postpone_reason?: string;
}