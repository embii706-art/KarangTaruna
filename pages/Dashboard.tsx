import React, { useEffect, useState } from 'react';
import { Bell, Wallet, Users, Calendar, ArrowUpRight, ArrowDownLeft, MoreHorizontal, ChevronRight, Activity, TrendingUp, Sparkles, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { collection, onSnapshot, query, where, limit, orderBy } from 'firebase/firestore';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  
  const [stats, setStats] = useState({
    balance: 0,
    memberCount: 0,
    upcomingEvents: 0
  });

  const [recentEvents, setRecentEvents] = useState<any[]>([]);

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

    // Events - Fetch upcoming
    // Simplify query to avoid index issues for now
    const unsubEvents = onSnapshot(collection(db, "events"), (snapshot) => {
        const events = snapshot.docs.map(d => ({id: d.id, ...d.data()}))
                        .filter((e: any) => e.status !== 'completed')
                        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .slice(0, 3);
        setStats(prev => ({ ...prev, upcomingEvents: events.length }));
        setRecentEvents(events);
    });

    return () => {
      unsubTrans();
      unsubMembers();
      unsubEvents();
    };
  }, [user]);

  const menuItems = [
    { label: 'Anggota', icon: Users, path: '/members', color: 'text-blue-400 bg-blue-500/10' },
    { label: 'Keuangan', icon: Wallet, path: '/finance', color: 'text-emerald-400 bg-emerald-500/10' },
    { label: 'Proker', icon: Calendar, path: '/events', color: 'text-purple-400 bg-purple-500/10' },
    { label: 'Laporan', icon: Activity, path: '/reports', color: 'text-orange-400 bg-orange-500/10' },
  ];

  return (
    <div className="pt-8 px-6 pb-32 space-y-8 animate-fade-in relative z-10">

        {/* Decorative Background Mesh */}
        <div className="fixed top-0 left-0 w-full h-[500px] mesh-gradient opacity-30 pointer-events-none -z-10 blur-3xl"></div>

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-slate-400 font-medium text-sm mb-1">Selamat Pagi,</p>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              {user?.displayName?.split(' ')[0] || 'Member'} <span className="animate-pulse">👋</span>
            </h1>
          </div>
          <div 
            onClick={() => navigate('/notifications')}
            className="relative cursor-pointer group glass rounded-full p-2.5 hover:bg-white/10 transition-all active:scale-95"
          >
            <Bell className="w-6 h-6 text-white" />
            <div className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]"></div>
          </div>
        </div>

        {/* Hero / Balance Section (Glass Credit Card Style) */}
        <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[32px] blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
            <div className="glass-card rounded-[32px] p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>

                <div className="flex justify-between items-start mb-8">
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                        <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/20 backdrop-blur-sm">
                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-300">+2.5%</span>
                    </div>
                </div>

                <div>
                    <p className="text-slate-400 font-medium text-sm mb-1 tracking-wider uppercase">Total Kas Klub</p>
                    <h2 className="text-4xl font-bold text-white tracking-tight text-gradient">
                        Rp {stats.balance.toLocaleString('id-ID')}
                    </h2>
                </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
            <button
                onClick={() => navigate('/finance')}
                className="glass hover:bg-white/10 h-16 rounded-[24px] flex items-center justify-center gap-3 active:scale-95 transition-all group border border-white/5"
            >
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] group-hover:scale-110 transition-transform">
                    <ArrowUpRight className="w-5 h-5" />
                </div>
                <span className="font-bold text-slate-200">Cek Kas</span>
            </button>
            <button
                onClick={() => navigate('/payment')}
                className="glass hover:bg-white/10 h-16 rounded-[24px] flex items-center justify-center gap-3 active:scale-95 transition-all group border border-white/5"
            >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-900 group-hover:scale-110 transition-transform">
                    <ArrowDownLeft className="w-5 h-5" />
                </div>
                <span className="font-bold text-slate-200">Bayar</span>
            </button>
        </div>

        {/* Quick Menu */}
        <div>
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Menu Cepat</h3>
                <button onClick={() => navigate('/structure')} className="text-slate-400 text-sm hover:text-white transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
             </div>
             <div className="grid grid-cols-4 gap-4">
                {menuItems.map((item, idx) => (
                    <div key={idx} onClick={() => navigate(item.path)} className="flex flex-col items-center gap-3 cursor-pointer group active:scale-95 transition-transform">
                        <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center glass border border-white/5 group-hover:border-white/20 transition-all ${item.color}`}>
                            <item.icon className="w-7 h-7" strokeWidth={1.5} />
                        </div>
                        <span className="text-[11px] font-medium text-slate-400 group-hover:text-white transition-colors">{item.label}</span>
                    </div>
                ))}
             </div>
        </div>

        {/* Recent Activity / Events */}
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Agenda Terdekat</h3>
                <button onClick={() => navigate('/events')} className="text-indigo-400 text-sm font-medium hover:text-indigo-300 transition-colors">Lihat Semua</button>
            </div>

            <div className="space-y-3">
                {recentEvents.length > 0 ? recentEvents.map((event, idx) => (
                        <div key={idx} className="glass p-4 rounded-[24px] flex items-center gap-4 group hover:bg-white/5 transition-colors border border-white/5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-300 font-bold group-hover:scale-105 transition-transform border border-white/5">
                            {new Date(event.date).getDate()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-200 truncate">{event.title}</h4>
                            <p className="text-slate-500 text-xs font-medium truncate mt-0.5">{event.description || 'Tidak ada deskripsi'}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                        </div>
                )) : (
                    <div className="glass p-8 rounded-[24px] text-center border border-white/5 border-dashed">
                        <p className="text-slate-500 text-sm">Belum ada agenda aktif</p>
                    </div>
                )}
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pb-4">
            <div className="glass p-5 rounded-[24px] border border-white/5">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 mb-3">
                    <Users className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-white">{stats.memberCount}</h3>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">Anggota Aktif</p>
            </div>
            <div className="glass p-5 rounded-[24px] border border-white/5">
                 <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-3">
                    <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-white">Top</h3>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">Performa Klub</p>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;