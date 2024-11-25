import { Button } from "../../ui/button";
import { Upload } from "lucide-react";
import { Input } from "../../ui/input";
import { useRef } from "react";
import { importInventory, importCompanies, importCustomers } from "@/lib/inventory";
import { toast } from "sonner";
import { parseHtmlTable } from "@/lib/services/htmlParserService";
import { Item, Company, Customer } from "@/lib/types";

export const ImportSection = () => {
  const inventoryFileRef = useRef<HTMLInputElement>(null);
  const companiesFileRef = useRef<HTMLInputElement>(null);
  const customersFileRef = useRef<HTMLInputElement>(null);

  const handleImport = async (type: 'inventory' | 'companies' | 'customers', file: File) => {
    try {
      if (file.type === 'text/html') {
        const text = await file.text();
        const { rows } = parseHtmlTable(text);
        
        switch (type) {
          case 'inventory':
            const items: Item[] = rows.map((row): Item => ({
              id: Math.random().toString(36).substr(2, 9),
              code: row.code || row.kód || '',
              quantity: parseInt(row.quantity || row.množstvo || '0'),
              company: row.company || row.spoločnosť || '',
              customer: row.customer || row.zákazník || '',
              createdAt: new Date(),
              updatedAt: new Date(),
              deleted: false
            }));
            await importInventory(items);
            toast.success("Inventár bol úspešne importovaný z HTML");
            break;
          case 'companies':
            const companies: Company[] = rows.map((row): Company => ({
              id: Math.random().toString(36).substr(2, 9),
              name: row.name || row.meno || '',
              deleted: false
            }));
            await importCompanies(companies);
            toast.success("Spoločnosti boli úspešne importované z HTML");
            break;
          case 'customers':
            const customers: Customer[] = rows.map((row): Customer => ({
              id: Math.random().toString(36).substr(2, 9),
              name: row.name || row.meno || '',
              companyId: row.companyId || row.spoločnosťId || '',
              deleted: false
            }));
            await importCustomers(customers);
            toast.success("Zákazníci boli úspešne importovaní z HTML");
            break;
        }
      } else if (file.type === 'text/csv') {
        switch (type) {
          case 'inventory':
            await importInventory(file);
            toast.success("Inventár bol úspešne importovaný");
            break;
          case 'companies':
            await importCompanies(file);
            toast.success("Spoločnosti boli úspešne importované");
            break;
          case 'customers':
            await importCustomers(file);
            toast.success("Zákazníci boli úspešne importovaní");
            break;
        }
      } else {
        throw new Error('Unsupported file type. Please use HTML or CSV files.');
      }
      
      window.location.reload();
    } catch (error) {
      toast.error(`Chyba pri importovaní: ${error}`);
    }
  };

  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <Button
          variant="outline"
          className="w-full hover:text-[#47acc9]"
          onClick={() => inventoryFileRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Inventár
        </Button>
        <Input
          type="file"
          ref={inventoryFileRef}
          className="hidden"
          accept=".csv,.html"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImport('inventory', file);
          }}
        />
      </div>
      <div className="flex-1">
        <Button
          variant="outline"
          className="w-full hover:text-[#47acc9]"
          onClick={() => companiesFileRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Spoločnosti
        </Button>
        <Input
          type="file"
          ref={companiesFileRef}
          className="hidden"
          accept=".csv,.html"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImport('companies', file);
          }}
        />
      </div>
      <div className="flex-1">
        <Button
          variant="outline"
          className="w-full hover:text-[#47acc9]"
          onClick={() => customersFileRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Zákazníci
        </Button>
        <Input
          type="file"
          ref={customersFileRef}
          className="hidden"
          accept=".csv,.html"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImport('customers', file);
          }}
        />
      </div>
    </div>
  );
};