export const playSuccessSound = () => {
  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2186/2186-preview.mp3');
  audio.play().catch(() => {}); // Ignore errors if sound can't play
};

export const playErrorSound = () => {
  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3');
  audio.play().catch(() => {}); // Ignore errors if sound can't play
};