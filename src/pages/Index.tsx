import { useState } from "react";
import { Header } from "@/components/Header";
import { ManualEntry } from "@/components/ManualEntry";
import { Scanner } from "@/components/Scanner";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"manual" | "scanner">("manual");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setActiveTab("manual")}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === "manual"
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Manual Entry
          </button>
          <button
            onClick={() => setActiveTab("scanner")}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === "scanner"
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Scanner
          </button>
        </div>

        <div className="max-w-2xl mx-auto">
          {activeTab === "manual" ? <ManualEntry /> : <Scanner />}
        </div>
      </main>
    </div>
  );
};

export default Index;