import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { INITIAL_PHOTOS } from '../../data/osData';
import { PhotoItem } from '../../types/os';
import { ArrowLeft, Trash2, Check, Sparkles, Image as ImageIcon } from 'lucide-react';
import { sounds } from '../../utils/sound';

export const GalleryApp: React.FC = () => {
  const { updateSettings, registerBackHandler } = useOS();
  const [photos, setPhotos] = useState<PhotoItem[]>(() => {
    try {
      const saved = localStorage.getItem('testos_photos');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PHOTOS;
  });

  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [isSetSuccess, setIsSetSuccess] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('testos_photos', JSON.stringify(photos));
    } catch {}
  }, [photos]);

  useEffect(() => {
    return registerBackHandler(() => {
      if (selectedPhoto) {
        setSelectedPhoto(null);
        return true;
      }
      return false;
    });
  }, [selectedPhoto, registerBackHandler]);

  const handleSetWallpaper = (url: string) => {
    sounds.notification();
    updateSettings({ wallpaper: url });
    setIsSetSuccess(true);
    setTimeout(() => setIsSetSuccess(false), 2000);
  };

  const handleDeletePhoto = (id: string) => {
    sounds.haptic();
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    setSelectedPhoto(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white select-none overflow-hidden">
      {!selectedPhoto ? (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-400" />
              <h1 className="text-base font-bold">Photos & Moments</h1>
            </div>
            <span className="text-xs text-white/50">{photos.length} items</span>
          </div>

          {/* Photo Grid */}
          <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-2.5 no-scrollbar">
            {photos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => {
                  sounds.click();
                  setSelectedPhoto(photo);
                }}
                className="aspect-square rounded-2xl overflow-hidden relative cursor-pointer group border border-white/10 hover:border-white/30 transition-all shadow-md"
              >
                <img
                  src={photo.url}
                  alt={photo.caption || 'Captured photo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex items-end">
                  <span className="text-[11px] text-white truncate font-medium">
                    {photo.caption || photo.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // LIGHTBOX FULL VIEW
        <div className="flex-1 flex flex-col bg-black">
          {/* Header */}
          <div className="p-4 flex items-center justify-between z-10 bg-black/60 backdrop-blur-md border-b border-white/10">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" /> Photos
            </button>
            <span className="text-xs text-white/60">{selectedPhoto.date}</span>
            <button
              onClick={() => handleDeletePhoto(selectedPhoto.id)}
              className="p-1.5 rounded-lg text-white/60 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete photo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Image */}
          <div className="flex-1 flex items-center justify-center p-2 overflow-hidden">
            <img
              src={selectedPhoto.url}
              alt="Full view"
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
            />
          </div>

          {/* Footer controls: Set as wallpaper */}
          <div className="p-4 bg-black/80 backdrop-blur-md border-t border-white/10 flex items-center justify-between">
            <div className="text-xs text-white/60 truncate max-w-[150px]">
              {selectedPhoto.caption || 'Photo'}
            </div>

            <button
              onClick={() => handleSetWallpaper(selectedPhoto.url)}
              disabled={isSetSuccess}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md ${
                isSetSuccess
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/15 hover:bg-white/25 text-white active:scale-95'
              }`}
            >
              {isSetSuccess ? (
                <>
                  <Check className="w-4 h-4" /> Wallpaper Applied!
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" /> Set as Wallpaper
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
