import { Button } from "../../ui/button";
import { Upload } from "lucide-react";
import { Input } from "../../ui/input";
import { useRef } from "react";
import { parsePDFData } from "@/lib/services/pdfImportService";
import { toast } from "sonner";

export const ImportSection = () => {
  const pdfFileRef = useRef<HTMLInputElement>(null);

  const handlePDFImport = async (file: File) => {
    try {
      await parsePDFData(file);
      window.location.reload();
    } catch (error) {
      toast.error(`Error importing PDF: ${error}`);
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <div className="flex-1 min-w-[150px]">
        <Button
          variant="outline"
          className="w-full hover:text-[#47acc9]"
          onClick={() => pdfFileRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Import PDF
        </Button>
        <Input
          type="file"
          ref={pdfFileRef}
          className="hidden"
          accept=".pdf"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handlePDFImport(file);
          }}
        />
      </div>
    </div>
  );
};