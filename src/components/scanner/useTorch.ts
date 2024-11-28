interface TorchCapabilities extends MediaTrackCapabilities {
  torch?: boolean;
}

export const useTorch = (mediaStream: MediaStream | null) => {
  const toggleTorch = async (torchEnabled: boolean): Promise<boolean> => {
    if (!mediaStream) return false;
    
    const track = mediaStream.getVideoTracks()[0];
    const capabilities = track.getCapabilities() as TorchCapabilities;
    
    if (!capabilities.torch) {
      console.log('Torch not supported on this device');
      return false;
    }

    try {
      await track.applyConstraints({
        advanced: [{
          torch: !torchEnabled
        }] as MediaTrackConstraints['advanced']
      });
      return true;
    } catch (err) {
      console.error('Error toggling torch:', err);
      return false;
    }
  };

  return { toggleTorch };
};