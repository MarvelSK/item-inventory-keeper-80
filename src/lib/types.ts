export interface Item {
  id: string;
  code: string;
  quantity: number;
  company: string;
  customer: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
}

export interface Company {
  id: string;
  name: string;
  deleted: boolean;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Customer {
  id: string;
  name: string;
  labels: Label[];
  deleted: boolean;
}