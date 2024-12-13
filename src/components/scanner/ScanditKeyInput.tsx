import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const ScanditKeyInput = () => {
  const [key, setKey] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchScanditKey();
  }, []);

  const fetchScanditKey = async () => {
    try {
      const { data, error } = await supabase
        .from('scanner_settings')
        .select('scandit_key')
        .limit(1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        setKey(data[0].scandit_key);
        localStorage.setItem("scanditKey", data[0].scandit_key);
      }
    } catch (error) {
      console.error('Error fetching Scandit key:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!key.trim()) {
      toast.error("Please enter a valid Scandit API key");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('scanner_settings')
        .select('id')
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('scanner_settings')
          .update({ scandit_key: key.trim() })
          .eq('id', data[0].id);

        if (updateError) throw updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('scanner_settings')
          .insert([{ scandit_key: key.trim() }]);

        if (insertError) throw insertError;
      }

      localStorage.setItem("scanditKey", key.trim());
      toast.success("Scandit API key saved successfully");
    } catch (error) {
      console.error('Error saving Scandit key:', error);
      toast.error("Failed to save Scandit API key");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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