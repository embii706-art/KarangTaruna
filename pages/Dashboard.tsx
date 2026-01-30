import React, { useEffect, useState } from 'react';
import { Bell, Wallet, Users, Calendar, ArrowUpRight, Clock, MapPin, Heart, Flag, Image as ImageIcon, UserCheck } from 'lucide-react';
import { Card, SectionHeader, Button } from '../components/UI';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useTheme } from '../services/themeService';
import { Season, AppTheme } from '../types';
import RamadanWidget from '../components/RamadanWidget';
import { Recycle, Sun, Moon, Network } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const { theme, season, toggleTheme } = useTheme();
  
  const [stats, setStats] = useState({
    balance: 0,
    memberCount: 0,
    upcomingEvents: 0
  });

  useEffect(() => {
    if (!user) return;

    // Firestore Listeners
    const unsubTrans = onSnapshot(collection(db, "transactions"), (snapshot) => {
      let bal = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.type === 'income') bal += data.amount;
        else bal -= data.amount;
      });
      setStats(prev => ({ ...prev, balance: bal }));
    }, (error) => {
      console.error("Error fetching transactions:", error);
    });

    const unsubMembers = onSnapshot(collection(db, "users"), (snapshot) => {
      setStats(prev => ({ ...prev, memberCount: snapshot.size }));
    }, (error) => {
      console.error("Error fetching members:", error);
    });

    const unsubEvents = onSnapshot(query(collection(db, "events"), where("status", "!=", "completed")), (snapshot) => {
      setStats(prev => ({ ...prev, upcomingEvents: snapshot.size }));
    }, (error) => {
      console.error("Error fetching events:", error);
    });

    return () => {
      unsubTrans();
      unsubMembers();
      unsubEvents();
    };
  }, [user]);

  return (
    <div className={`pt-4 px-4 space-y-6 animate-fade-in relative z-10 pb-24`}>
        {/* Header */}
        <div className="flex justify-between items-center">
          <div 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 cursor-pointer group p-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border-2 border-slate-200 dark:border-slate-700">
               {user?.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover"/> : <span className="text-xs font-bold text-slate-500">KT</span>}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Halo, {user?.displayName?.split(' ')[0]}</p>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1">
                 {season === Season.INDEPENDENCE ? 'Merdeka! 🇮🇩' : season === Season.RAMADAN ? 'Marhaban 🌙' : 'KARTEJI'}
              </h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={toggleTheme} variant="ghost" className="rounded-full border border-slate-200 dark:border-slate-700 w-12 h-12 !p-0 flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm">
                {theme === AppTheme.DARK ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </Button>
            <Button onClick={() => navigate('/notifications')} variant="ghost" className="rounded-full border border-slate-200 dark:border-slate-700 w-12 h-12 !p-0 flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm relative">
                <Bell className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-800"></span>
            </Button>
          </div>
        </div>

        {/* Seasonal Widget */}
        <RamadanWidget />

        {/* Standard Hero Card / Saldo */}
        <div className="bg-slate-900 dark:bg-indigo-900 rounded-[32px] p-6 text-white shadow-xl relative overflow-hidden transition-colors duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="relative z-10">
                <p className="text-white/60 font-medium mb-1">Total Kas KARTEJI</p>
                <h2 className="text-4xl font-bold mb-6">Rp {(stats.balance / 1000).toFixed(0)}rb</h2>
                
                <div className="flex gap-3">
                    <button 
                    onClick={() => navigate('/finance')}
                    className="flex-1 bg-white text-slate-900 py-3 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all active:scale-95"
                    >
                    Cek Detail
                    </button>
                    <button
                    onClick={() => navigate('/payment')}
                    className="flex-1 bg-white/10 text-white py-3 rounded-2xl font-bold text-sm backdrop-blur-md hover:bg-white/20 transition-all active:scale-95 border border-white/10"
                    >
                    Bayar Iuran
                    </button>
                </div>
                </div>
            </div>

        {/* Quick Menu */}
        <div className="bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-4 rounded-[32px] border border-white/50 dark:border-slate-800 shadow-sm">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Anggota', icon: <Users className="w-6 h-6" />, path: '/members', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
              { label: 'Keuangan', icon: <Wallet className="w-6 h-6" />, path: '/finance', color: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
              { label: 'Kegiatan', icon: <Calendar className="w-6 h-6" />, path: '/events', color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
              { label: 'Laporan', icon: <ArrowUpRight className="w-6 h-6" />, path: '/reports', color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
              { label: 'Struktur', icon: <Network className="w-6 h-6" />, path: '/structure', color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' },
              { label: 'Bank Sampah', icon: <Recycle className="w-6 h-6" />, path: '/waste-bank', color: 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400' },
              { label: 'Galeri', icon: <ImageIcon className="w-6 h-6" />, path: '/gallery', color: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' },
              { label: 'Verifikasi', icon: <UserCheck className="w-6 h-6" />, path: '/verification', color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400' },
            ].map((item, idx) => (
              <div key={idx} onClick={() => navigate(item.path)} className="flex flex-col items-center gap-2 cursor-pointer group transition-transform active:scale-95">
                <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center ${item.color} shadow-sm transition-colors`}>
                  {item.icon}
                </div>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 text-center leading-tight">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="pb-24">
          <SectionHeader title="Statistik Singkat" />
          <div className="grid grid-cols-2 gap-4">
             <Card className="flex flex-col items-center justify-center text-center !py-8 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800">
                 <h3 className="text-3xl font-bold mb-1 text-slate-900 dark:text-white">{stats.upcomingEvents}</h3>
                 <p className="text-xs font-semibold text-slate-500 uppercase">Agenda Aktif</p>
             </Card>
             <Card className="flex flex-col items-center justify-center text-center !py-8 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800">
                 <h3 className="text-3xl font-bold mb-1 text-slate-900 dark:text-white">{stats.memberCount}</h3>
                 <p className="text-xs font-semibold text-slate-500 uppercase">Total Anggota</p>
             </Card>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;