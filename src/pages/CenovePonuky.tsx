import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PriceOffersList } from "@/components/price-offers/PriceOffersList";

const CenovePonuky = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-[#212490]">Cenové Ponuky</h2>
          <PriceOffersList />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CenovePonuky;