import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Mail, User, Shield, LogOut, Loader2 } from 'lucide-react';
import { auth, db } from '../services/firebase';
import { updateProfile, signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { Button, Input, Card } from '../components/UI';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
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
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-full">
          <ArrowLeft className="w-6 h-6 text-slate-900" />
        </button>
        <h1 className="text-xl font-bold text-slate-900">Profil Saya</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="