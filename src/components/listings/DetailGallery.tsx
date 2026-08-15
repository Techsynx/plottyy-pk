'use client';

import React, { useState } from 'react';
import { ListingPhoto } from '@/types';
import { PhotoGalleryModal } from './PhotoGalleryModal';
import { Maximize2, Camera } from 'lucide-react';

interface DetailGalleryProps {
  photos: ListingPhoto[];
  title: string;
}

export function DetailGallery({ photos, title }: DetailGalleryProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const displayPhotos = photos.length > 0 ? photos : [
    {
      id: 'default',
      listing_id: 'default',
      storage_path: '',
      url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80',
      alt_text: title,
      sort_order: 0,
      is_cover: true,
    },
  ];

  const handleOpenPhoto = (idx: number) => {
    setActivePhotoIdx(idx);
    setModalOpen(true);
  };

  const cover = displayPhotos[0];
  const sidePhotos = displayPhotos.slice(1, 5);

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden bg-[#F3EFEA] border border-[#E8E3DC] property-card-shadow">
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 aspect-[16/9] md:aspect-[21/9] max-h-[500px]">
          
          {/* Hero Main Photo */}
          <div
            onClick={() => handleOpenPhoto(0)}
            className={`relative cursor-pointer overflow-hidden group ${
              sidePhotos.length > 0 ? 'md:col-span-2' : 'md:col-span-4'
            }`}
          >
            <img
              src={cover.url}
              alt={cover.alt_text || title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur text-white text-xs px-2.5 py-1 rounded-lg flex items-center space-x-1.5 opacity-90">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>View Fullscreen</span>
            </div>
          </div>

          {/* Sub Photos */}
          {sidePhotos.length > 0 && (
            <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2">
              {sidePhotos.map((photo, i) => (
                <div
                  key={photo.id || i}
                  onClick={() => handleOpenPhoto(i + 1)}
                  className="relative cursor-pointer overflow-hidden group h-full bg-[#E8E3DC]"
                >
                  <img
                    src={photo.url}
                    alt={photo.alt_text || `${title} photo ${i + 2}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors"></div>

                  {/* On 4th photo, show "+X more photos" overlay if additional photos exist */}
                  {i === 3 && displayPhotos.length > 5 && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white text-center p-2">
                      <span className="text-xl font-bold">+{displayPhotos.length - 5}</span>
                      <span className="text-xs font-medium">View all photos</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Floating "View All Photos" Button */}
        <button
          onClick={() => handleOpenPhoto(0)}
          className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-[#1F2420] px-3.5 py-2 rounded-xl text-xs font-bold shadow-lg backdrop-blur flex items-center space-x-1.5 transition-all transform hover:scale-105"
        >
          <Camera className="w-4 h-4 text-[#0F6B5C]" />
          <span>Show all {displayPhotos.length} photos</span>
        </button>

      </div>

      {/* Lightbox Modal */}
      <PhotoGalleryModal
        photos={displayPhotos}
        initialIndex={activePhotoIdx}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
