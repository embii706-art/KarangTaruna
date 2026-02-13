import React from 'react';
import { ArrowLeft, Wallet, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/UI';

const Payment: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col relative">
      {/* Header */}
      <div className="px-4 pt-6 pb-2 flex items-center gap-4 sticky top-0 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-sm z-20">
        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-all active:scale-95">
          <ArrowLeft className="w-6 h-6 text-slate-900 dark:text-white" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
           <Wallet className="w-5 h-5"/> Pembayaran Iuran
        </h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6">

        {/* Coming Soon State */}
        <div className="text-center">
             <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                 <Lock className="w-10 h-10 text-indigo-500" />
             </div>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Fitur Segera Hadir</h2>
             <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-8 leading-relaxed">
                 Sistem pembayaran digital sedang dalam tahap pengembangan. Silakan hubungi bendahara untuk pembayaran manual.
             </p>
             <Button className="w-full max-w-xs mx-auto" onClick={() => navigate('/dashboard')}>
                 Kembali ke Dashboard
             </Button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
