export interface Item {
  id: string;
  code: string;
  quantity: number;
  company: string;
  customer: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
}

export interface Customer {
  id: string;
  name: string;
}