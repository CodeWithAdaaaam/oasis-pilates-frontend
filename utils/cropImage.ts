// utils/cropImage.ts
export const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<Blob> => {
  const image = new Image();
  image.src = imageSrc;
  image.crossOrigin = "anonymous"; 
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error("No 2d context");

  // --- CONFIGURATION DU REDIMENSIONNEMENT ---
  const TARGET_SIZE = 400; // Taille finale de la photo de profil (400x400px)
  canvas.width = TARGET_SIZE;
  canvas.height = TARGET_SIZE;

  // On dessine l'image en la redimensionnant vers la cible de 400px
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    TARGET_SIZE,
    TARGET_SIZE
  );

  // --- COMPRESSION JPEG ---
  return new Promise((resolve, reject) => {
    // 0.7 = 70% de qualité. C'est le meilleur compromis poids/qualité.
    // Cela fera passer une image de plusieurs Mo à environ 50-100 Ko.
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('Canvas is empty'));
      resolve(blob);
    }, 'image/jpeg', 0.7); 
  });
};