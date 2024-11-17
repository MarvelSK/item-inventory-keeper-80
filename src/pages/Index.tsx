import { useState } from "react";
import { Header } from "@/components/Header";
import { ManualEntry } from "@/components/ManualEntry";
import { Scanner } from "@/components/Scanner";
import { InventoryList } from "@/components/InventoryList";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"manual" | "scanner" | "inventory">("inventory");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center space-x-4 mb-8">
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

        <div className="max-w-7xl mx-auto">
          {activeTab === "manual" && <ManualEntry />}
          {activeTab === "scanner" && <Scanner />}
          {activeTab === "inventory" && <InventoryList />}
        </div>
      </main>
    </div>
  );
};

export default Index;