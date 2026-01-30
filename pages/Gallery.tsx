import React, { useState } from 'react';
import { ArrowLeft, Image as ImageIcon, ZoomIn, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Mock data for gallery
  // In a real app, this would come from Firestore/Storage
  const images = [
    { id: 1, url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop', title: 'Rapat Tahunan' },
    { id: 2, url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop', title: 'Kegiatan Bakti Sosial' },
    { id: 3, url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2232&auto=format&fit=crop', title: 'Acara Keakraban' },
    { id: 4, url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop', title: 'Kerja Bakti' },
    { id: 5, url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069&auto=format&fit=crop', title: 'Malam Tirakatan' },
    { id: 6, url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2070&auto=format&fit=crop', title: 'Lomba 17an' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col relative">
      {/* Header */}
      <div className="px-4 pt-6 pb-2 flex items-center gap-4 sticky top-0 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-sm z-20">
        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-all active:scale-95">
          <ArrowLeft className="w-6 h-6 text-slate-900 dark:text-white" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
           <ImageIcon className="w-5 h-5"/> Galeri Kegiatan
        </h1>
      </div>

      {/* Grid */}
      <div className="p-4 grid grid-cols-2 gap-3 pb-24">
        {images.map((img) => (
            <div
                key={img.id}
                className="relative group rounded-2xl overflow-hidden aspect-square cursor-pointer shadow-sm hover:shadow-md transition-all"
                onClick={() => setSelectedImage(img.url)}
            >
                <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <ZoomIn className="text-white w-8 h-8" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs font-medium truncate">{img.title}</p>
                </div>
            </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedImage(null)}>
            <button className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                <X className="w-6 h-6" />
            </button>
            <img
                src={selectedImage}
                alt="Full View"
                className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain"
                onClick={(e) => e.stopPropagation()}
            />
        </div>
      )}
    </div>
  );
};

export default Gallery;
