import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, collection, getDocs, query, limit } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { Input, Button } from '../components/UI';
import { MemberRole } from '../types';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Determine Role (First user = SUPER_ADMIN, others = MEMBER)
      const q = query(collection(db, "users"), limit(1));
      const querySnapshot = await getDocs(q);
      const isFirstUser = querySnapshot.empty;
      const assignedRole = isFirstUser ? MemberRole.SUPER_ADMIN : MemberRole.MEMBER;

      // 2. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 3. Update Auth Profile
      await updateProfile(user, {
        displayName: formData.name,
        photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`
      });

      // 4. Create User Document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        name: formData.name,
        email: formData.email,
        role: assignedRole,
        avatar: user.photoURL,
        joinedAt: new Date().toISOString(),
        status: 'active'
      });

      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Gagal mendaftar. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col justify-center animate-fade-in">
       <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Buat Akun</h1>
        <p className="text-slate-500">Bergabung dengan Karang Taruna.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4"/> {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
            <Input 
                icon={<User className="w-5 h-5"/>} 
                placeholder="Nama Anda" 
                required 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
            />
        </div>
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
            <Input 
                icon={<Mail className="w-5 h-5"/>} 
                placeholder="nama@email.com" 
                type="email" 
                required 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
            />
        </div>
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <Input 
                icon={<Lock className="w-5 h-5"/>} 
                placeholder="••••••••" 
                type="password" 
                required 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
            />
        </div>

        <Button className="w-full mt-4" type="submit" disabled={loading}>
          {loading ? 'Memproses...' : 'Daftar Akun'} <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      <p className="text-center mt-8 text-slate-500 text-sm">
        Sudah punya akun? <Link to="/login" className="font-bold text-slate-900">Masuk</Link>
      </p>
    </div>
  );
};

export default Register;