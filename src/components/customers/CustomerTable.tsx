import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { Customer } from "@/lib/types";
import { LabelBadge } from "../labels/LabelBadge";
import { CustomerActions } from "./CustomerActions";

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

export const CustomerTable = ({ customers, onEdit, onDelete }: CustomerTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center md:text-left">Meno</TableHead>
            <TableHead className="text-center md:text-left">Štítky</TableHead>
            <TableHead className="text-center md:text-left w-[100px]">Akcie</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium text-center md:text-left">{customer.name}</TableCell>
              <TableCell className="text-center md:text-left">
                <div className="flex flex-wrap gap-1 justify-center md:justify-start">
                  {customer.tags?.map((tag) => (
                    <LabelBadge key={tag.id} label={tag} />
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <CustomerActions 
                  customer={customer}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};