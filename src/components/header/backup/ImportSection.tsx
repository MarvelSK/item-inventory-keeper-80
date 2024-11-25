import { Button } from "../../ui/button";
import { Upload } from "lucide-react";
import { Input } from "../../ui/input";
import { useRef, useState } from "react";
import { importInventory, importCompanies, importCustomers } from "@/lib/inventory";
import { convertPdfToHtml, renderHtmlContent } from "@/lib/services/pdfService";
import { toast } from "sonner";

export const ImportSection = () => {
  const [pdfContent, setPdfContent] = useState<string | null>(null);
  const inventoryFileRef = useRef<HTMLInputElement>(null);
  const companiesFileRef = useRef<HTMLInputElement>(null);
  const customersFileRef = useRef<HTMLInputElement>(null);
  const pdfFileRef = useRef<HTMLInputElement>(null);

  const handleImport = async (type: 'inventory' | 'companies' | 'customers', file: File) => {
    try {
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
      window.location.reload();
    } catch (error) {
      toast.error(`Chyba pri importovaní: ${error}`);
    }
  };

  const handlePdfImport = async (file: File) => {
    try {
      const htmlContent = await convertPdfToHtml(file);
      setPdfContent(htmlContent);
      toast.success("PDF bol úspešne importovaný");
    } catch (error) {
      toast.error(`Chyba pri importovaní PDF: ${error}`);
    }
  };

  return (
    <div className="space-y-4">
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
            accept=".csv"
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
            accept=".csv"
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
            accept=".csv"
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
            onClick={() => pdfFileRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            PDF Import
          </Button>
          <Input
            type="file"
            ref={pdfFileRef}
            className="hidden"
            accept=".pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handlePdfImport(file);
            }}
          />
        </div>
      </div>
      
      {pdfContent && (
        <div className="mt-4 border rounded-lg bg-gray-50 p-4">
          <h3 className="text-lg font-medium mb-4">PDF Preview</h3>
          <div className="pdf-preview max-h-[500px] overflow-y-auto">
            {renderHtmlContent(pdfContent)}
          </div>
        </div>
      )}
    </div>
  );
};