import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const Splash: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden animate-fade-in">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/20 animate-bounce-slow">
           <span className="text-4xl font-bold text-slate-900 tracking-tighter">KT</span>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Karang Taruna Hub</h1>
        <p className="text-slate-400 text-sm font-medium">Empowering Youth, Building Future</p>
      </div>

      <div className="absolute bottom-10">
        <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
      </div>
    </div>
  );
};

export default Splash;