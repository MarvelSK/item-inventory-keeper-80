export interface Item {
  id: string;
  code: string;
  company: string;
  customer: string;
  description?: string;
  length?: number;
  width?: number;
  height?: number;
  status: 'waiting' | 'in_stock' | 'in_transit' | 'delivered';
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
}

export interface Company {
  id: string;
  name: string;
  deleted: boolean;
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