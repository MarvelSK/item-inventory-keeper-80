import { useCallback } from "react";
import { RefObject } from "react";

export const useTorch = (
  mediaStream: RefObject<MediaStream | null>,
  torchEnabled: boolean,
  setTorchEnabled: (enabled: boolean) => void
) => {
  const toggleTorch = useCallback(async () => {
    if (!mediaStream.current) return;

    const track = mediaStream.current.getVideoTracks()[0];
    if (!track) return;

    try {
      // @ts-ignore - torch is a valid constraint but TypeScript doesn't know about it
      await track.applyConstraints({
        advanced: [{ torch: !torchEnabled }]
      });
      setTorchEnabled(!torchEnabled);
    } catch (err) {
      console.error('Error toggling torch:', err);
      setTorchEnabled(false);
    }
  }, [mediaStream, torchEnabled, setTorchEnabled]);

  return { toggleTorch };
};