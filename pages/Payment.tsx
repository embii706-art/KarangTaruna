import React from 'react';
import { ArrowLeft, Wallet, CreditCard, Clock, ChevronRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../components/UI';

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

      <div className="p-4 space-y-6">
        {/* Bill Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[32px] p-6 text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
             <p className="text-white/70 font-medium mb-1">Tagihan Bulan Ini</p>
             <h2 className="text-4xl font-bold mb-6">Rp 15.000</h2>

             <div className="flex items-center gap-2 text-sm bg-white/10 p-3 rounded-xl backdrop-blur-md">
                <Clock className="w-4 h-4" />
                <span>Jatuh Tempo: <strong>25 Feb 2025</strong></span>
             </div>
        </div>

        {/* Payment Methods (Disabled / Coming Soon) */}
        <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Metode Pembayaran</h3>
            <div className="space-y-3 opacity-60 pointer-events-none grayscale">
                <Card className="flex items-center justify-between !p-4 border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <CreditCard className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Transfer Bank / QRIS</h4>
                            <p className="text-xs text-slate-500">Otomatis verifikasi</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                </Card>

                <Card className="flex items-center justify-between !p-4 border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                            <Wallet className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Tunai ke Bendahara</h4>
                            <p className="text-xs text-slate-500">Konfirmasi manual</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                </Card>
            </div>
        </div>

        {/* Coming Soon State */}
        <div className="text-center py-8 bg-slate-100 dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800">
             <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Lock className="w-8 h-8 text-slate-400" />
             </div>
             <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Fitur Segera Hadir</h3>
             <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto px-4">
                 Sistem pembayaran digital sedang dalam tahap pengembangan. Silakan hubungi bendahara untuk pembayaran manual.
             </p>
             <Button className="mt-6 w-auto !px-8" variant="secondary" onClick={() => navigate('/dashboard')}>
                 Kembali ke Dashboard
             </Button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
