'use client';
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

export default function ImageCropper({ image, onCropComplete, onCancel }: any) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropCompleteInternal = useCallback((_area: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const generateCroppedImage = async () => {
    try {
      const canvas = document.createElement('canvas');
      const img = new Image();
      img.src = image;
      await new Promise((res) => (img.onload = res));

      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');

      if (ctx && croppedAreaPixels) {
        const { x, y, width, height }: any = croppedAreaPixels;
        ctx.drawImage(img, x, y, width, height, 0, 0, 400, 400);
        
        // On récupère le Base64
        const base64Image = canvas.toDataURL('image/jpeg', 0.8);
        
        // ✅ On appelle bien le prop envoyé par le Modal
        onCropComplete(base64Image); 
      }
    } catch (e) {
      console.error("Erreur lors du recadrage:", e);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col">
      <div className="relative flex-1">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onCropComplete={onCropCompleteInternal}
          onZoomChange={setZoom}
        />
      </div>
      <div className="p-6 bg-white flex justify-between items-center">
        <input 
          type="range" 
          value={zoom} 
          min={1} 
          max={3} 
          step={0.1} 
          onChange={(e) => setZoom(Number(e.target.value))} 
          className="w-1/2 accent-sage" 
        />
        <div className="flex gap-4">
          <button onClick={onCancel} className="px-6 py-2 text-gray-500 font-bold uppercase text-xs">
            Annuler
          </button>
          <button 
            onClick={generateCroppedImage} 
            className="px-6 py-2 bg-sage text-white rounded-xl font-bold uppercase text-xs"
          >
            Valider le recadrage
          </button>
        </div>
      </div>
    </div>
  );
}