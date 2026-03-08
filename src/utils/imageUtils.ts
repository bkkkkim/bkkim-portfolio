
/**
 * Converts a File object to a WebP Blob.
 * @param file The input file (image).
 * @param quality Quality of the WebP image (0 to 1). Default is 0.8.
 * @returns A Promise that resolves to a WebP Blob.
 */
export const convertImageToWebP = (file: File, quality = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Conversion to WebP failed'));
          }
        },
        'image/webp',
        quality
      );
      
      URL.revokeObjectURL(img.src);
    };
    
    img.onerror = (err) => {
      URL.revokeObjectURL(img.src);
      reject(err);
    };
  });
};
