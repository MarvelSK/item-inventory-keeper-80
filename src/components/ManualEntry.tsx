import { AddItemForm } from "./manual-entry/AddItemForm";

export const ManualEntry = () => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-[#212490]">Pridať novú položku</h2>
      <AddItemForm />
    </div>
  );
};