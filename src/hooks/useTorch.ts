import { MutableRefObject } from "react";

// Extend MediaTrackCapabilities to include torch
declare global {
  interface MediaTrackCapabilities {
    torch?: boolean;
  }
  interface MediaTrackConstraintSet {
    torch?: boolean;
  }
}

export const useTorch = (
  mediaStream: MutableRefObject<MediaStream | null>,
  torchEnabled: boolean,
  setTorchEnabled: (enabled: boolean) => void
) => {
  const toggleTorch = async () => {
    if (!mediaStream.current) return;

    const track = mediaStream.current.getVideoTracks()[0];
    if (!track) return;

    try {
      const capabilities = track.getCapabilities();
      const settings = track.getSettings();

      if (!capabilities.torch) {
        console.log('Torch is not supported on this device');
        return;
      }

      await track.applyConstraints({
        advanced: [{ torch: !torchEnabled }]
      });

      setTorchEnabled(!torchEnabled);
    } catch (err) {
      console.error('Error toggling torch:', err);
    }
  };

  return { toggleTorch };
};