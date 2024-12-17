import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  DataCaptureContext,
  configure,
} from "@scandit/web-datacapture-core";

export const useScanditInitialization = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasLicenseKey, setHasLicenseKey] = useState(false);
  const [context, setContext] = useState<DataCaptureContext | null>(null);

  useEffect(() => {
    initializeScandit();
  }, []);

  const initializeScandit = async () => {
    try {
      const { data, error } = await supabase
        .from('scanner_settings')
        .select('scandit_key')
        .limit(1)
        .single();

      if (error) throw error;
      
      if (!data?.scandit_key) {
        setHasLicenseKey(false);
        setIsInitializing(false);
        return;
      }

      await configure(data.scandit_key);
      const newContext = await DataCaptureContext.create();
      setContext(newContext);
      setHasLicenseKey(true);
      setIsInitializing(false);
    } catch (error) {
      console.error('Error initializing Scandit:', error);
      toast.error("Failed to initialize Scandit");
      setHasLicenseKey(false);
      setIsInitializing(false);
    }
  };

  return {
    isInitializing,
    hasLicenseKey,
    context,
    reinitialize: initializeScandit
  };
};