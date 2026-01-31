import React, { useEffect, useState } from 'react';
import { Bell, Wallet, Users, Calendar, ArrowUpRight, ArrowDownLeft, MoreHorizontal, ChevronRight, Activity } from 'lucide-react';
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
    const qEvents = query(
        collection(db, "events"),
        where("status", "!=", "completed"),
        orderBy("date", "asc"), // Requires index? If fails, remove orderBy or add index
        limit(3)
    );

    // Note: If orderBy fails due to missing index, we might need to handle it.
    // For now, let's keep it simple or use a simple query.
    const unsubEvents = onSnapshot(collection(db, "events"), (snapshot) => {
        const events = snapshot.docs.map(d => ({id: d.id, ...d.data()}))
                        .filter((e: any) => e.status !== 'completed')
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
    { label: 'Anggota', icon: Users, path: '/members' },
    { label: 'Keuangan', icon: Wallet, path: '/finance' },
    { label: 'Proker', icon: Calendar, path: '/events' },
    { label: 'Laporan', icon: Activity, path: '/reports' },
    // { label: 'Galeri', icon: Image, path: '/gallery' },
    // { label: 'Verif', icon: CheckCircle, path: '/verification' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-8 px-6 pb-32 space-y-8 animate-fade-in relative z-10">

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-[#111111] tracking-tight">
              Hey, {user?.displayName?.split(' ')[0] || 'Member'}!
            </h1>
            <p className="text-slate-500 font-medium mt-1">Good morning! 👋</p>
          </div>
          <div 
            onClick={() => navigate('/notifications')}
            className="relative cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-200">
               {user?.photoURL ? (
                 <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                    {user?.displayName?.[0] || 'K'}
                 </div>
               )}
            </div>
            <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-[#F8F9FA]"></div>
          </div>
        </div>

        {/* Hero / Balance Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-slate-500 font-semibold text-sm">Total Kas Klub</p>
            <span className="text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-bold">+2.5%</span>
          </div>
          <h2 className="text-[42px] font-black text-[#111111] leading-none tracking-tight">
            Rp {stats.balance.toLocaleString('id-ID')}
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
            <button
                onClick={() => navigate('/finance')}
                className="flex-1 bg-white h-16 rounded-[24px] flex items-center justify-center gap-3 shadow-sm border border-slate-100 active:scale-95 transition-all group"
            >
                <div className="w-10 h-10 rounded-full bg-[#111111] flex items-center justify-center text-white group-hover:rotate-45 transition-transform">
                    <ArrowUpRight className="w-5 h-5" />
                </div>
                <span className="font-bold text-[#111111]">Cek Kas</span>
            </button>
            <button
                onClick={() => navigate('/payment')}
                className="flex-1 bg-white h-16 rounded-[24px] flex items-center justify-center gap-3 shadow-sm border border-slate-100 active:scale-95 transition-all group"
            >
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#111111] group-hover:rotate-45 transition-transform">
                    <ArrowDownLeft className="w-5 h-5" />
                </div>
                <span className="font-bold text-[#111111]">Bayar</span>
            </button>
        </div>

        {/* Stacked Cards Layout */}
        <div className="relative pt-4">

            {/* Mint Card (Top Layer) */}
            <div className="bg-[#D0F0EA] rounded-[40px] p-8 pb-12 relative z-20 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl text-[#0F3930]">Menu Cepat</h3>
                    <button onClick={() => navigate('/structure')} className="bg-white/40 hover:bg-white/60 w-10 h-10 rounded-full flex items-center justify-center text-[#0F3930] transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    {menuItems.map((item, idx) => (
                        <div key={idx} onClick={() => navigate(item.path)} className="flex flex-col items-center gap-2 cursor-pointer group active:scale-95 transition-transform">
                            <div className="w-14 h-14 rounded-[20px] bg-[#0F3930] text-[#D0F0EA] flex items-center justify-center shadow-sm">
                                <item.icon className="w-6 h-6" strokeWidth={2} />
                            </div>
                            <span className="text-[11px] font-bold text-[#0F3930]">{item.label}</span>
                        </div>
                    ))}
                </div>

                {/* Extra Stats in Mint Card */}
                <div className="mt-8 bg-[#0F3930]/5 rounded-3xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0F3930] font-bold">
                            {stats.memberCount}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#0F3930] opacity-60">TOTAL ANGGOTA</p>
                            <p className="text-sm font-bold text-[#0F3930]">Aktif Bergabung</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#0F3930] opacity-40" />
                </div>
            </div>

            {/* Black Card (Bottom Layer) */}
            <div className="bg-[#111111] rounded-[40px] p-8 pt-16 -mt-10 relative z-10 text-white min-h-[300px]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl">Agenda Klub</h3>
                    <button onClick={() => navigate('/events')} className="text-white/40 text-sm hover:text-white transition-colors">View All</button>
                </div>

                <div className="space-y-4">
                    {recentEvents.length > 0 ? recentEvents.map((event, idx) => (
                         <div key={idx} className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-[18px] bg-white/10 flex items-center justify-center text-white font-bold group-hover:bg-[#D0F0EA] group-hover:text-[#111111] transition-colors">
                                {event.title ? event.title[0] : 'E'}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-lg">{event.title}</h4>
                                <p className="text-white/40 text-xs font-medium">{event.date} • {event.location || 'TBA'}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
                                <ChevronRight className="w-4 h-4 text-white/40" />
                            </div>
                         </div>
                    )) : (
                        <div className="text-center py-8 text-white/30 text-sm">
                            Belum ada agenda
                        </div>
                    )}
                </div>

                {/* Visual spacer at bottom to account for nav bar overlap if needed */}
                <div className="h-12"></div>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
