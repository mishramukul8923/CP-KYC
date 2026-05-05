/**
 * Converts a WebP image URL to a PNG Data URL using Canvas.
 * @param {string} url - The URL of the WebP image.
 * @returns {Promise<string>} - A promise that resolves to the PNG Data URL or the original URL if conversion fails or is not a WebP.
 */
export const convertWebpToPng = (url) => {
  return new Promise((resolve) => {
    // If no URL or not a webp, return as is
    if (!url || url === "-" || url === "null") {
      return resolve(url);
    }

    // Check if it's a webp image
    const isWebp = url.toLowerCase().endsWith('.webp') || url.includes('image/webp') || url.includes('.webp?');
    if (!isWebp) {
      return resolve(url);
    }

    const img = new Image();
    img.crossOrigin = "Anonymous"; // Handle CORS issues
    
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch (err) {
        console.warn("Canvas conversion failed, returning original URL:", err);
        resolve(url);
      }
    };

    img.onerror = () => {
      console.warn("Failed to load image for conversion, returning original URL:", url);
      resolve(url);
    };

    img.src = url;
  });
};
