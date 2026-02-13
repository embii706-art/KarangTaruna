import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Mail, User, Shield, LogOut, Loader2, IdCard, Globe } from 'lucide-react';
import { auth, db } from '../services/firebase';
import { updateProfile, signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { Button, Input, Card, Modal } from '../components/UI';
import MembershipCard from '../components/MembershipCard';
import { useTranslation } from 'react-i18next';

const Profile: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const changeLanguage = async (lng: string) => {
    i18n.changeLanguage(lng);
    if (user) {
        try {
            await updateDoc(doc(db, "users", user.uid), { language: lng });
        } catch (error) {
            console.error("Failed to save language preference:", error);
        }
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setLoading(true);
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

      // 2. Update Firebase Auth Profile
      await updateProfile(user, { photoURL });

      // 3. Update Firestore User Document
      await updateDoc(doc(db, "users", user.uid), { avatar: photoURL });

      // Force reload to reflect changes
      window.location.reload(); 
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Gagal mengganti foto profil.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white animate-fade-in relative z-50">
      {/* Header */}
      <div className="px-4 pt-6 pb-2 flex items-center gap-4 sticky top-0 bg-white z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-full transition-all active:scale-95">
          <ArrowLeft className="w-6 h-6 text-slate-900" />
        </button>
        <h1 className="text-xl font-bold text-slate-900">Profil Saya</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full bg-slate-100 overflow-hidden border-4 border-slate-50 shadow-xl">
               {user.photoURL ? (
                 <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white text-3xl font-bold">
                    {user.displayName?.charAt(0) || 'U'}
                 </div>
               )}
            </div>
            <button 
              disabled={loading}
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2.5 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900">{user.displayName}</h2>
          <p className="text-slate-500 text-sm">Anggota KARTEJI</p>

          <Button
            variant="outline"
            className="mt-4 !py-2 !px-4 text-sm h-10 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            onClick={() => setShowCard(true)}
          >
            <IdCard className="w-4 h-4" /> Kartu Anggota
          </Button>
        </div>

        {/* Info Cards */}
        <div className="space-y-4">
          <Card className="!p-0 overflow-hidden border border-slate-100">
             <div className="p-4 border-b border-slate-50 flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                   <User className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-xs text-slate-400 font-bold uppercase">Nama Lengkap</p>
                   <p className="text-slate-900 font-medium">{user.displayName}</p>
                </div>
             </div>
             <div className="p-4 border-b border-slate-50 flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                   <Mail className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-xs text-slate-400 font-bold uppercase">Email</p>
                   <p className="text-slate-900 font-medium">{user.email}</p>
                </div>
             </div>
             <div className="p-4 border-b border-slate-50 flex items-center gap-3">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                   <Shield className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-xs text-slate-400 font-bold uppercase">Status Akun</p>
                   <p className="text-green-600 font-bold flex items-center gap-1">
                      Terverifikasi
                   </p>
                </div>
             </div>
             <div className="p-4 flex items-center gap-3">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                   <Globe className="w-5 h-5" />
                </div>
                <div className="flex-1">
                   <p className="text-xs text-slate-400 font-bold uppercase">{t('common.language')}</p>
                   <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => changeLanguage('id')}
                        className={`text-xs px-2 py-1 rounded border ${i18n.language === 'id' ? 'bg-orange-100 border-orange-200 text-orange-700' : 'bg-white border-slate-200 text-slate-600'}`}
                      >
                        Bahasa
                      </button>
                      <button
                        onClick={() => changeLanguage('en')}
                        className={`text-xs px-2 py-1 rounded border ${i18n.language === 'en' ? 'bg-orange-100 border-orange-200 text-orange-700' : 'bg-white border-slate-200 text-slate-600'}`}
                      >
                        English
                      </button>
                   </div>
                </div>
             </div>
          </Card>

          <Button 
            variant="danger" 
            className="w-full justify-center !bg-red-50 !text-red-600 hover:!bg-red-100 border-none"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" /> Keluar Akun
          </Button>
          
          <div className="text-center text-xs text-slate-300 pt-4">
             Version 1.0.0 • KARTEJI Management
          </div>
        </div>
      </div>

      {/* ID Card Modal */}
      <Modal isOpen={showCard} onClose={() => setShowCard(false)} title="Kartu Anggota Digital">
         <div className="flex flex-col items-center gap-4">
             <MembershipCard user={user} />
             <p className="text-xs text-slate-400 text-center max-w-xs">
                 Tunjukkan kartu ini sebagai bukti keanggotaan Karang Taruna yang sah.
             </p>
             <Button className="w-full" onClick={() => setShowCard(false)}>Tutup</Button>
         </div>
      </Modal>
    </div>
  );
};

export default Profile;