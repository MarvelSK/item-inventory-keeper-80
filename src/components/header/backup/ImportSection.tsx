import { Button } from "../../ui/button";
import { Upload } from "lucide-react";
import { Input } from "../../ui/input";
import { useRef } from "react";
import { importInventory, importCompanies, importCustomers } from "@/lib/inventory";
import { toast } from "sonner";
import { processHtmlImport } from "@/lib/services/htmlImportService";
import { Item, Company, Customer } from "@/lib/types";

export const ImportSection = () => {
  const inventoryFileRef = useRef<HTMLInputElement>(null);
  const companiesFileRef = useRef<HTMLInputElement>(null);
  const customersFileRef = useRef<HTMLInputElement>(null);
  const htmlFileRef = useRef<HTMLInputElement>(null);

  const handleHtmlImport = async (file: File) => {
    try {
      console.log('Starting HTML import process...');
      const text = await file.text();
      console.log('HTML content loaded, starting processing...');
      
      const items = await processHtmlImport(text);
      
      if (items.length === 0) {
        console.log('No valid items found for import');
        toast.error("Neboli nájdené žiadne dáta na import");
        return;
      }

      console.log('Items prepared for import:', items);
      await importInventory(items);
      toast.success(`Úspešne importovaných ${items.length} položiek z HTML`);
      window.location.reload();
    } catch (error) {
      console.error('HTML import error:', error);
      toast.error(`Chyba pri importovaní HTML: ${error}`);
    }
  };

  const handleImport = async (type: 'inventory' | 'companies' | 'customers', file: File) => {
    try {
      if (file.type === 'text/html') {
        const text = await file.text();
        const items = await processHtmlImport(text);
        
        switch (type) {
          case 'inventory':
            await importInventory(items);
            toast.success("Inventár bol úspešne importovaný z HTML");
            break;
          case 'companies':
            // Convert items to Company type
            const companies: Company[] = items.map(item => ({
              id: item.id,
              name: item.company,
              deleted: false
            }));
            await importCompanies(companies);
            toast.success("Spoločnosti boli úspešne importované z HTML");
            break;
          case 'customers':
            // Convert items to Customer type
            const customers: Customer[] = items.map(item => ({
              id: item.id,
              name: item.customer,
              companyId: item.company,
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
      <div className="flex-1">
        <Button
          variant="outline"
          className="w-full hover:text-[#47acc9]"
          onClick={() => htmlFileRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Import HTML
        </Button>
        <Input
          type="file"
          ref={htmlFileRef}
          className="hidden"
          accept=".html"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleHtmlImport(file);
          }}
        />
      </div>
    </div>
  );
};