import React from 'react';
import { Recycle } from 'lucide-react';

const WasteBank: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
            <Recycle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Bank Sampah</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">Fitur ini sedang dalam pengembangan. Segera hadir untuk lingkungan yang lebih bersih!</p>
        <div className="mt-8 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-mono text-slate-500">
            Status: Coming Soon
        </div>
    </div>
  );
};

export default WasteBank;