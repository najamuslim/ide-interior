function forceDownload(blobUrl: string, filename: string) {
  const a = document.createElement("a");
  a.download = filename;
  a.href = blobUrl;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function downloadPhoto(url: string, filename: string) {
  // Detect if running on mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  fetch(url, {
    headers: new Headers({
      Origin: location.origin,
    }),
    mode: "cors",
  })
    .then((response) => response.blob())
    .then((blob) => {
      // Get correct mime type from blob
      const mimeType = blob.type;
      let extension = ".jpg"; // default extension

      // Map mime type to extension
      if (mimeType === "image/png") extension = ".png";
      if (mimeType === "image/jpeg") extension = ".jpg";
      if (mimeType === "image/webp") extension = ".webp";

      // Ensure filename has correct extension
      let finalFilename = filename;
      if (!filename.toLowerCase().endsWith(extension)) {
        // Remove any existing extension
        finalFilename = filename.replace(/\.[^/.]+$/, "");
        // Add correct extension
        finalFilename = `${finalFilename}${extension}`;
      }

      // Create blob URL
      const blobUrl = window.URL.createObjectURL(blob);

      if (isMobile) {
        // For mobile, ensure we're not adding multiple extensions
        finalFilename =
          finalFilename.replace(/\.(jpg|jpeg|png|webp)$/i, "") + extension;
      }

      forceDownload(blobUrl, finalFilename);

      // Clean up blob URL
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
    })
    .catch((e) => console.error("Download error:", e));
}
