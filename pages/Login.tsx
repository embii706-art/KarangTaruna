import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { Input, Button } from '../components/UI';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError('Email atau password salah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col justify-center animate-fade-in">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="w-24 h-24 mb-4">
          <img 
            src="/logo.svg"
            alt="KARTEJI Logo" 
            className="w-full h-full object-contain"
            onError={(e) => {
               e.currentTarget.style.display = 'none';
               e.currentTarget.parentElement!.innerHTML = '<div class="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-bold text-xl">KT</div>';
            }}
          />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Selamat Datang</h1>
        <p className="text-slate-500">Silakan masuk ke aplikasi KARTEJI.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4"/> {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
            <Input 
                icon={<Mail className="w-5 h-5"/>} 
                placeholder="nama@email.com" 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
        </div>
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <Input 
                icon={<Lock className="w-5 h-5"/>} 
                placeholder="••••••••" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
        </div>
        
        <div className="flex justify-end">
            <Link to="#" className="text-sm font-bold text-indigo-600">Lupa Password?</Link>
        </div>

        <Button className="w-full mt-4" type="submit" disabled={loading}>
          {loading ? 'Memproses...' : 'Masuk'} <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      <p className="text-center mt-8 text-slate-500 text-sm">
        Belum punya akun? <Link to="/register" className="font-bold text-slate-900">Daftar Sekarang</Link>
      </p>
    </div>
  );
};

export default Login;