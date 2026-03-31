export const downloadFile = (url?: string | null) => {
  if (!url) return;
  // Trigger direct download (no preview UI).
  window.location.href = url;
};

