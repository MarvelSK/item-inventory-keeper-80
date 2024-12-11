import { MutableRefObject, useCallback } from "react";

export const useTorch = (
  mediaStream: MutableRefObject<MediaStream | null>,
  torchEnabled: boolean,
  setTorchEnabled: (enabled: boolean) => void
) => {
  const toggleTorch = useCallback(async () => {
    if (!mediaStream.current) return;

    const track = mediaStream.current.getVideoTracks()[0];
    if (!track) return;

    try {
      if ('imageCaptureEnabled' in track) {
        await track.applyConstraints({
          advanced: [{ manual_torch: !torchEnabled }]
        });
      }
      setTorchEnabled(!torchEnabled);
    } catch (err) {
      console.warn('Torch control not supported:', err);
    }
  }, [mediaStream, torchEnabled, setTorchEnabled]);

  return { toggleTorch };
};