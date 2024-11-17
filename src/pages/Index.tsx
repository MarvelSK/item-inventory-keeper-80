import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ManualEntry } from "@/components/ManualEntry";
import { Scanner } from "@/components/Scanner";
import { InventoryList } from "@/components/InventoryList";
import { backupInventory, wipeInventory, importInventory } from "@/lib/inventory";
import { Button } from "@/components/ui/button";
import { DatabaseBackup, Import, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"manual" | "scanner" | "inventory">("inventory");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackupAndWipe = () => {
    backupInventory();
    wipeInventory();
    toast.success("Inventár zálohovaný a vymazaný");
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await importInventory(file);
        toast.success("Dáta úspešne importované");
      } catch (error) {
        toast.error("Chyba pri importovaní dát");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("manual")}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === "manual"
                  ? "bg-[#212490] text-white"
                  : "bg-white text-gray-600 hover:bg-[#47acc9] hover:text-white"
              }`}
            >
              Manuálne pridanie
            </button>
            <button
              onClick={() => setActiveTab("scanner")}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === "scanner"
                  ? "bg-[#212490] text-white"
                  : "bg-white text-gray-600 hover:bg-[#47acc9] hover:text-white"
              }`}
            >
              Skener
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === "inventory"
                  ? "bg-[#212490] text-white"
                  : "bg-white text-gray-600 hover:bg-[#47acc9] hover:text-white"
              }`}
            >
              Inventár
            </button>
          </div>

          <div className="flex space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".csv"
              className="hidden"
            />
            <Button
              variant="outline"
              className="hover:text-[#47acc9]"
              onClick={() => fileInputRef.current?.click()}
            >
              <Import className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button
              variant="outline"
              className="hover:text-[#47acc9]"
              onClick={() => backupInventory()}
            >
              <DatabaseBackup className="h-4 w-4 mr-2" />
              Záloha
            </Button>
            <Button
              variant="outline"
              className="hover:text-destructive"
              onClick={handleBackupAndWipe}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Vymazať všetko
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {activeTab === "manual" && <ManualEntry />}
          {activeTab === "scanner" && <Scanner />}
          {activeTab === "inventory" && <InventoryList />}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;