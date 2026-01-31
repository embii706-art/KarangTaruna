import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Image as ImageIcon, ZoomIn, X, Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../services/firebase';

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  uploadedAt: any;
  uploadedBy: string;
}

const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Query gallery sorted by newest first
    const q = query(collection(db, 'gallery'), orderBy('uploadedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryImage));
      setImages(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching gallery:", error);
      // Even on error, we stop loading. We DO NOT show mock data.
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !auth.currentUser) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Karteji');

    try {
      // 1. Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dbxktcwug/upload`,
        { method: 'POST', body: formData }
      );

      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      const photoURL = data.secure_url;

      // 2. Save to Firestore
      await addDoc(collection(db, 'gallery'), {
        url: photoURL,
        title: file.name,
        uploadedBy: auth.currentUser.uid,
        uploadedAt: serverTimestamp()
      });

    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Gagal mengupload foto. Pastikan koneksi internet lancar.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col relative">
      {/* Header */}
      <div className="px-4 pt-6 pb-2 flex items-center justify-between sticky top-0 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-sm z-20">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-all active:scale-95">
            <ArrowLeft className="w-6 h-6 text-slate-900 dark:text-white" />
            </button>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5"/> Galeri
            </h1>
        </div>

        {/* Upload Button */}
        <div>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg active:scale-95 transition-all disabled:opacity-70"
            >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Plus className="w-4 h-4"/>}
                <span className="hidden sm:inline">Upload</span>
            </button>
        </div>
      </div>

      {/* Grid */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pb-24">
        {loading ? (
            // Skeleton Loading
            [...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"/>
            ))
        ) : images.length === 0 ? (
            <div className="col-span-full text-center py-20 text-slate-400">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50"/>
                <p>Belum ada foto.</p>
            </div>
        ) : (
            images.map((img) => (
                <div
                    key={img.id}
                    className="relative group rounded-2xl overflow-hidden aspect-square cursor-pointer shadow-sm hover:shadow-md transition-all bg-slate-200"
                    onClick={() => setSelectedImage(img.url)}
                >
                    <img
                        src={img.url}
                        alt={img.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <ZoomIn className="text-white w-8 h-8" />
                    </div>
                </div>
            ))
        )}
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
