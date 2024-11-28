import { AddItemForm } from "./manual-entry/AddItemForm";

export const ManualEntry = () => {
  return (
    <div className="bg-card dark:bg-card/40 p-4 md:p-6 rounded-lg shadow-sm dark:shadow-none dark:border dark:border-border">
      <h2 className="text-xl font-semibold mb-4 text-primary dark:text-primary/90">Pridať novú položku</h2>
      <AddItemForm />
    </div>
  );
};