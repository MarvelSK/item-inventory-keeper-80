import { Card } from "./ui/card";
import { ScanditView } from "./scanner/ScanditView";

export const Scanner = () => {
  return (
    <Card className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-primary">Scanner</h2>
      </div>
      <ScanditView />
    </Card>
  );
};