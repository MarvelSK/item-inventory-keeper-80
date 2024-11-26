import { Button } from "../../ui/button";
import { Upload } from "lucide-react";
import { Input } from "../../ui/input";
import { useRef } from "react";
import { importAll } from "@/lib/services/backupService";
import { toast } from "sonner";

export const ImportSection = () => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = async (file: File) => {
    try {
      await importAll(file);
      toast.success("Systém bol úspešne importovaný");
      window.location.reload();
    } catch (error) {
      toast.error(`Chyba pri importovaní: ${error}`);
    }
  };

  return (
    <div>
      <Button
        variant="outline"
        className="w-full hover:text-[#47acc9]"
        onClick={() => fileRef.current?.click()}
      >
        <Upload className="mr-2 h-4 w-4" />
        Importovať celý systém
      </Button>
      <Input
        type="file"
        ref={fileRef}
        className="hidden"
        accept=".json"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImport(file);
        }}
      />
    </div>
  );
};