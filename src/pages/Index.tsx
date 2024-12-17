import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ManualEntry } from "@/components/ManualEntry";
import Scanner from "@/components/Scanner";
import { InventoryList } from "@/components/InventoryList";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"manual" | "scanner" | "inventory">("inventory");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-nowrap gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab("manual")}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === "manual"
                  ? "bg-primary text-primary-foreground dark:bg-primary/90 dark:text-primary-foreground"
                  : "bg-card text-card-foreground hover:bg-primary/90 hover:text-primary-foreground dark:bg-muted/10 dark:text-muted-foreground dark:hover:bg-primary/80 dark:hover:text-primary-foreground"
              }`}
            >
              Manuálne pridanie
            </button>
            <button
              onClick={() => setActiveTab("scanner")}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === "scanner"
                  ? "bg-primary text-primary-foreground dark:bg-primary/90 dark:text-primary-foreground"
                  : "bg-card text-card-foreground hover:bg-primary/90 hover:text-primary-foreground dark:bg-muted/10 dark:text-muted-foreground dark:hover:bg-primary/80 dark:hover:text-primary-foreground"
              }`}
            >
              Skener
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === "inventory"
                  ? "bg-primary text-primary-foreground dark:bg-primary/90 dark:text-primary-foreground"
                  : "bg-card text-card-foreground hover:bg-primary/90 hover:text-primary-foreground dark:bg-muted/10 dark:text-muted-foreground dark:hover:bg-primary/80 dark:hover:text-primary-foreground"
              }`}
            >
              Inventár
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {activeTab === "manual" && <ManualEntry />}
          {activeTab === "scanner" && <Scanner />}
          {activeTab === "inventory" && (
            <div className="bg-card dark:bg-card/40 p-4 md:p-6 rounded-lg shadow-sm dark:shadow-none dark:border dark:border-border">
              <h2 className="text-xl font-semibold mb-4 text-primary dark:text-primary/90">Inventár položiek</h2>
              <InventoryList />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;