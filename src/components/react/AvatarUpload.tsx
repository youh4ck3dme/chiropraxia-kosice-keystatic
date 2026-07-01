import React, { useState, useRef } from 'react';

/**
 * AvatarUpload Component
 * 
 * A functional, modern square avatar upload with preview.
 * Responsive sizing: 120x120px on mobile, 160x160px on desktop.
 */
export const AvatarUpload: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
        alert('Prosím vyberte platný obrázok (PNG, JPG, WebP).');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        onClick={handleClick}
        className={`
          relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300
          w-[120px] h-[120px] sm:w-[160px] sm:h-[160px]
          flex items-center justify-center
          ${preview 
            ? 'border-transparent shadow-lg scale-[1.02]' 
            : 'border-slate-300 bg-white/20 hover:border-blue-400 hover:bg-white/30'
          }
        `}
      >
        {preview ? (
          <img 
            src={preview} 
            alt="Avatar náhľad" 
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
          />
        ) : (
          <div className="flex flex-col items-center text-center px-4">
            <svg 
              className="w-10 h-10 mb-2 text-slate-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
              Pridať fotku
            </span>
          </div>
        )}
        
        {/* Overlay on hover when image is present */}
        {preview && (
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-xs font-bold uppercase tracking-widest">
              Zmeniť
            </span>
          </div>
        )}
      </div>

      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      
      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
        Max. 5MB (PNG, JPG, WebP)
      </p>
    </div>
  );
};

export default AvatarUpload;
