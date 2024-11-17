import { Boxes } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Boxes className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-gray-900">Warehouse Manager</h1>
          </div>
          <nav className="flex space-x-4">
            <button className="px-4 py-2 text-gray-600 hover:text-primary transition-colors">
              Inventory
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-primary transition-colors">
              Scanner
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};