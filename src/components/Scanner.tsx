import { Card } from "./ui/card";
import { useScanditInitialization } from "@/hooks/useScanditInitialization";
import { ScanditKeyInput } from "./scanner/ScanditKeyInput";
import { ScanditView } from "./scanner/ScanditView";

export const Scanner = () => {
  const { isInitializing, hasLicenseKey, context, reinitialize } = useScanditInitialization();

  if (isInitializing) {
    return (
      <Card className="p-4 md:p-6">
        <div>Initializing scanner...</div>
      </Card>
    );
  }

  if (!hasLicenseKey) {
    return (
      <Card className="p-4 md:p-6">
        <h2 className="text-2xl font-semibold text-primary mb-4">Scanner Configuration</h2>
        <ScanditKeyInput onKeyAdded={reinitialize} />
      </Card>
    );
  }

  return (
    <Card className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-primary">Scanner</h2>
      </div>

      {context && <ScanditView context={context} />}
    </Card>
  );
};