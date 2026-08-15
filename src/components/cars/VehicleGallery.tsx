import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

interface VehicleGalleryProps {
  images: string[];
  title: string;
}

export const VehicleGallery: React.FC<VehicleGalleryProps> = ({ images, title }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const safeImages = images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80'];

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % safeImages.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  return (
    <div className="space-y-4" id="vehicle-gallery-component">
      
      {/* Primary Display Frame */}
      <div className="relative aspect-[16/10] bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 shadow-xl group">
        <img
          src={safeImages[activeIdx]}
          alt={`${title} - image ${activeIdx + 1}`}
          className="w-full h-full object-cover object-center transition-all duration-300"
        />

        {/* Previous / Next Arrows */}
        {safeImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-neutral-950/80 text-white flex items-center justify-center opacity-80 hover:opacity-100 hover:bg-red-600 transition-all border border-neutral-800"
              title="Previous Image"
              id="gallery-prev-btn"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-neutral-950/80 text-white flex items-center justify-center opacity-80 hover:opacity-100 hover:bg-red-600 transition-all border border-neutral-800"
              title="Next Image"
              id="gallery-next-btn"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Fullscreen Expand Button */}
        <button
          onClick={() => setFullscreen(true)}
          className="absolute top-3 right-3 p-2 rounded-lg bg-neutral-950/80 hover:bg-neutral-900 text-white border border-neutral-800 opacity-80 hover:opacity-100 transition-all"
          title="Fullscreen View"
          id="gallery-fullscreen-btn"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-3 right-3 bg-neutral-950/90 text-neutral-300 text-xs font-bold px-2.5 py-1 rounded backdrop-blur-md border border-neutral-800">
          {activeIdx + 1} / {safeImages.length}
        </div>
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              id={`gallery-thumb-${idx}`}
              className={`aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all ${
                activeIdx === idx
                  ? 'border-red-600 scale-95 shadow-lg shadow-red-600/30'
                  : 'border-neutral-800 opacity-60 hover:opacity-100 hover:border-neutral-600'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal Lightbox */}
      {fullscreen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-neutral-900 hover:bg-red-600 text-white transition-colors"
            id="close-lightbox-btn"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center">
            <img
              src={safeImages[activeIdx]}
              alt={title}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {safeImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 w-12 h-12 rounded-full bg-neutral-900/80 hover:bg-red-600 text-white flex items-center justify-center border border-neutral-700"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 w-12 h-12 rounded-full bg-neutral-900/80 hover:bg-red-600 text-white flex items-center justify-center border border-neutral-700"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
