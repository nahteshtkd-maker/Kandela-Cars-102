import React, { useState, useRef } from 'react';
import { Upload, X, Star, Loader2, Image as ImageIcon, Link } from 'lucide-react';
import { api } from '../../services/api';

interface ImageUploaderProps {
  images: string[];
  primaryImage: string;
  onChangeImages: (images: string[]) => void;
  onChangePrimary: (primary: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  primaryImage,
  onChangeImages,
  onChangePrimary
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customUrl, setCustomUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (filesList: FileList | null) => {
    if (!filesList || filesList.length === 0) return;
    const filesArray = Array.from(filesList);

    try {
      setUploading(true);
      setError(null);
      const uploadedPaths = await api.uploadImages(filesArray);
      
      const newImagesList = [...images, ...uploadedPaths];
      onChangeImages(newImagesList);

      if (!primaryImage || images.length === 0) {
        onChangePrimary(uploadedPaths[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleRemove = (imgToRemove: string) => {
    const updated = images.filter(img => img !== imgToRemove);
    onChangeImages(updated);
    if (primaryImage === imgToRemove) {
      onChangePrimary(updated[0] || '');
    }
  };

  const handleSetPrimary = (img: string) => {
    onChangePrimary(img);
  };

  const handleAddCustomUrl = () => {
    if (!customUrl.trim()) return;
    const updated = [...images, customUrl.trim()];
    onChangeImages(updated);
    if (!primaryImage) {
      onChangePrimary(customUrl.trim());
    }
    setCustomUrl('');
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-4" id="admin-image-uploader">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase text-neutral-300">
          VEHICLE IMAGES * ({images.length} Added)
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-neutral-400 hover:text-red-400 flex items-center space-x-1"
        >
          <Link className="w-3.5 h-3.5" />
          <span>{showUrlInput ? 'Hide URL input' : 'Add Image URL'}</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-lg">
          {error}
        </div>
      )}

      {/* Optional URL Input */}
      {showUrlInput && (
        <div className="flex items-center space-x-2 bg-neutral-950 p-2 rounded-lg border border-neutral-800">
          <input
            type="url"
            value={customUrl}
            onChange={e => setCustomUrl(e.target.value)}
            placeholder="Paste direct image URL e.g. https://..."
            className="flex-1 bg-transparent text-xs text-white focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddCustomUrl}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded"
          >
            Add URL
          </button>
        </div>
      )}

      {/* Drag & Drop Box */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-neutral-800 hover:border-red-600/60 bg-neutral-950/80 hover:bg-neutral-900 rounded-xl p-6 text-center cursor-pointer transition-all group"
        id="image-dropzone"
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/*"
          className="hidden"
          onChange={e => handleFileSelect(e.target.files)}
        />

        {uploading ? (
          <div className="flex flex-col items-center justify-center space-y-2 py-4">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            <span className="text-xs text-neutral-300 font-bold uppercase">Uploading Images to Server...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-red-500 group-hover:scale-110 transition-all">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                Click to browse or drag & drop car photos here
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                PNG, JPG, WEBP, GIF up to 10MB per image
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Image Thumbnails & Primary Selection */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {images.map((img, idx) => {
            const isPrimary = img === primaryImage || (idx === 0 && !primaryImage);
            return (
              <div
                key={idx}
                className={`relative aspect-[16/10] bg-neutral-950 rounded-lg overflow-hidden border-2 group shadow-md ${
                  isPrimary ? 'border-red-600' : 'border-neutral-800'
                }`}
              >
                <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />

                {/* Primary Badge */}
                {isPrimary && (
                  <div className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">
                    PRIMARY
                  </div>
                )}

                {/* Controls Overlay */}
                <div className="absolute inset-0 bg-neutral-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  {!isPrimary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(img)}
                      className="p-1.5 rounded bg-neutral-900 hover:bg-red-600 text-white text-[10px] font-bold uppercase flex items-center space-x-1"
                      title="Set as Main Cover Image"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>Set Main</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemove(img)}
                    className="p-1.5 rounded bg-neutral-900 hover:bg-red-700 text-white"
                    title="Remove Photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
