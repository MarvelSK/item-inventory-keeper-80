import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";

export const ScanditKeyInput = () => {
  const [key, setKey] = useState(() => localStorage.getItem("scanditKey") || "");

  const handleSave = () => {
    if (!key.trim()) {
      toast.error("Please enter a valid Scandit API key");
      return;
    }
    localStorage.setItem("scanditKey", key.trim());
    toast.success("Scandit API key saved successfully");
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col space-y-2">
        <label htmlFor="scanditKey" className="text-sm font-medium">
          Scandit API Key
        </label>
        <div className="flex space-x-2">
          <Input
            id="scanditKey"
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter your Scandit API key"
            className="flex-1"
          />
          <Button onClick={handleSave}>Save Key</Button>
        </div>
      </div>
      {!key && (
        <p className="text-sm text-muted-foreground">
          Please enter your Scandit API key to use the scanner
        </p>
      )}
    </div>
  );
};