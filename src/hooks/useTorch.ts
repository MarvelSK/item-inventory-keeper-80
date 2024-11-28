import { useCallback } from 'react';

export const useTorch = (
  mediaStream: React.MutableRefObject<MediaStream | null>,
  torchEnabled: boolean,
  setTorchEnabled: (enabled: boolean) => void
) => {
  const toggleTorch = useCallback(async () => {
    if (!mediaStream.current) return;

    const track = mediaStream.current.getVideoTracks()[0];
    if (!track) return;

    try {
      // Check if torch is supported
      const capabilities = track.getCapabilities();
      if (!capabilities.torch) {
        console.log('Torch not supported on this device');
        return;
      }

      // Toggle torch
      const newTorchState = !torchEnabled;
      await track.applyConstraints({
        advanced: [{ torch: newTorchState }]
      });
      setTorchEnabled(newTorchState);
    } catch (err) {
      console.error('Error toggling torch:', err);
    }
  }, [mediaStream, torchEnabled, setTorchEnabled]);

  return { toggleTorch };
};