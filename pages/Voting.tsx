import React, { useEffect, useState } from 'react';
import { Vote, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../components/UI';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';

interface Candidate {
  id: string;
  name: string;
  vision: string;
  role: string; // Added role
  photoURL?: string;
}

const Voting: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "candidates"), orderBy("id", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Candidate));

      // Fallback if empty (for demo/dev purposes if DB is empty)
      if (data.length === 0) {
        setCandidates([
            { id: '1', name: 'Budi Santoso', role: 'Ketua Umum', vision: 'Meningkatkan partisipasi pemuda dalam kegiatan sosial.' },
            { id: '2', name: 'Siti Aminah', role: 'Wakil Ketua', vision: 'Memajukan UMKM pemuda desa.' },
        ]);
      } else {
        setCandidates(data);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching candidates:", error);
      setLoading(false);
       // Fallback on error
       setCandidates([
        { id: '1', name: 'Budi Santoso', role: 'Ketua Umum', vision: 'Meningkatkan partisipasi pemuda dalam kegiatan sosial.' },
        { id: '2', name: 'Siti Aminah', role: 'Wakil Ketua', vision: 'Memajukan UMKM pemuda desa.' },
      ]);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
      return (
          <div className="flex justify-center items-center h-[50vh]">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
      );
  }

  return (
    <div className="pt-4 px-4 pb-24 animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">E-Voting</h1>
        <p className="text-slate-500 dark:text-slate-400">Pilih Kandidat Pengurus Periode 2025-2026</p>
      </div>

      <div className="space-y-4">
        {candidates.map((c) => (
            <div key={c.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                <div className="flex justify-between items-start mb-3 relative z-10">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-lg overflow-hidden border-2 border-indigo-50 dark:border-indigo-800">
                        {c.photoURL ? <img src={c.photoURL} alt={c.name} className="w-full h-full object-cover" /> : c.name.charAt(0)}
                    </div>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs px-2 py-1 rounded-lg font-medium">Kandidat #{c.id}</span>
                </div>

                <div className="relative z-10">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{c.name}</h3>
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-2">{c.role}</p>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl mb-4">
                        <p className="text-sm text-slate-500 dark:text-slate-400 italic">"{c.vision}"</p>
                    </div>

                    <Button className="w-full justify-center">
                        <Vote className="w-4 h-4 mr-2" /> Pilih {c.name.split(' ')[0]}
                    </Button>
                </div>

                {/* Decorative bg */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-full -mr-10 -mt-10 blur-2xl transition-all group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30"></div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Voting;