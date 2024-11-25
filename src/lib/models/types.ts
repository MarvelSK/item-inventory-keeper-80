export interface Item {
  id: string;
  code: string;
  quantity: number;
  company: string;
  customer: string;
  description?: string;
  size?: string;
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