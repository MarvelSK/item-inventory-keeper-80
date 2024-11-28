import { Item } from "@/lib/types";

interface ScanHistoryProps {
  items: Item[];
}

export const ScanHistory = ({ items }: ScanHistoryProps) => {
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-white/70">
        No items scanned yet
      </div>
    );
  }

  return (
    <div className="space-y-2 p-4 h-full overflow-y-auto">
      {items.map((item, index) => (
        <div
          key={`${item.id}-${index}`}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-fade-in"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-white/90">Code: {item.code}</h3>
              <p className="text-sm text-white/70">Status: {item.status}</p>
            </div>
            <span className="text-xs text-white/50">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};