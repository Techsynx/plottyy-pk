'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { ListingPhoto } from '@/types';

interface PhotoGalleryModalProps {
  photos: ListingPhoto[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function PhotoGalleryModal({
  photos,
  initialIndex = 0,
  isOpen,
  onClose,
}: PhotoGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrentIndex((prev) => (prev + 1) % photos.length);
      if (e.key === 'ArrowLeft') setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, photos.length, onClose]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between text-white px-2 py-2">
        <div className="text-xs sm:text-sm font-semibold tracking-wide">
          Photo {currentIndex + 1} of {photos.length}
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image Viewport */}
      <div className="relative flex-1 flex items-center justify-center max-w-6xl mx-auto w-full my-auto">
        <img
          src={currentPhoto.url}
          alt={currentPhoto.alt_text || 'Property Photo'}
          className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
        />

        {/* Previous Button */}
        {photos.length > 1 && (
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)}
            className="absolute left-2 sm:left-4 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all transform hover:scale-110"
            aria-label="Previous Photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Button */}
        {photos.length > 1 && (
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % photos.length)}
            className="absolute right-2 sm:right-4 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all transform hover:scale-110"
            aria-label="Next Photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Thumbnails Row */}
      {photos.length > 1 && (
        <div className="max-w-4xl mx-auto w-full overflow-x-auto py-2 flex items-center justify-center space-x-2">
          {photos.map((photo, idx) => (
            <button
              key={photo.id || idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                currentIndex === idx
                  ? 'border-[#D97B4F] scale-105 opacity-100'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={photo.url}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
