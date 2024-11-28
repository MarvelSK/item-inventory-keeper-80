import { useCallback } from 'react';

interface ExtendedMediaTrackCapabilities extends MediaTrackCapabilities {
  torch?: boolean;
}

export const useTorch = (
  mediaStream: React.MutableRefObject<MediaStream | null>,
  torchEnabled: boolean,
  setTorchEnabled: (enabled: boolean) => void
) => {
  const toggleTorch = useCallback(async () => {
    if (!mediaStream.current) return;
    
    const track = mediaStream.current.getVideoTracks()[0];
    const capabilities = track.getCapabilities() as ExtendedMediaTrackCapabilities;
    
    if (!capabilities.torch) {
      console.log('Torch not supported on this device');
      return;
    }

    try {
      await track.applyConstraints({
        advanced: [{ torch: !torchEnabled }]
      });
      setTorchEnabled(!torchEnabled);
    } catch (err) {
      console.error('Error toggling torch:', err);
    }
  }, [mediaStream, torchEnabled, setTorchEnabled]);

  return { toggleTorch };
};