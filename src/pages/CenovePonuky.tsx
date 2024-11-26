import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PriceOffersList } from "@/components/price-offers/PriceOffersList";

const CenovePonuky = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-[#212490]">Cenové Ponuky</h2>
          
          <Tabs defaultValue="slovakia" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="slovakia">Slovensko</TabsTrigger>
              <TabsTrigger value="hungary">Maďarsko</TabsTrigger>
              <TabsTrigger value="romania">Rumunsko</TabsTrigger>
            </TabsList>
            
            <TabsContent value="slovakia">
              <PriceOffersList region="slovakia" />
            </TabsContent>
            
            <TabsContent value="hungary">
              <PriceOffersList region="hungary" />
            </TabsContent>
            
            <TabsContent value="romania">
              <PriceOffersList region="romania" />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CenovePonuky;