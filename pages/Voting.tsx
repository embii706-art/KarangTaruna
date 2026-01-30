import React from 'react';
import { Vote, CheckCircle } from 'lucide-react';
import { Button } from '../components/UI';

const Voting: React.FC = () => {
  const candidates = [
    { id: 1, name: 'Budi Santoso', vision: 'Meningkatkan partisipasi pemuda dalam kegiatan sosial.' },
    { id: 2, name: 'Siti Aminah', vision: 'Memajukan UMKM pemuda desa.' },
  ];

  return (
    <div className="pt-4 px-4 pb-24 animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">E-Voting</h1>
        <p className="text-slate-500 dark:text-slate-400">Pilih Ketua Karang Taruna Periode 2025-2026</p>
      </div>

      <div className="space-y-4">
        {candidates.map((c) => (
            <div key={c.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-lg">
                        {c.name.charAt(0)}
                    </div>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs px-2 py-1 rounded-lg">Kandidat #{c.id}</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{c.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">"{c.vision}"</p>
                <Button className="w-full justify-center">
                    <Vote className="w-4 h-4 mr-2" /> Pilih Kandidat
                </Button>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Voting;