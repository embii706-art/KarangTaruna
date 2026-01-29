import React, { useEffect, useState } from 'react';
import { Bell, Wallet, Users, Calendar, ArrowUpRight, Clock, MapPin, Heart, Flag } from 'lucide-react';
import { Card, SectionHeader, Button } from '../components/UI';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { getTheme, AppTheme } from '../services/themeService';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const theme = getTheme();
  
  const [stats, setStats] = useState({
    balance: 0,
    memberCount: 0,
    upcomingEvents: 0
  });

  useEffect(() => {
    // Firestore Listeners
    const unsubTrans = onSnapshot(collection(db, "transactions"), (snapshot) => {
      let bal = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.type === 'income') bal += data.amount;
        else bal -= data.amount;
      });
      setStats(prev => ({ ...prev, balance: bal }));
    });

    const unsubMembers = onSnapshot(collection(db, "users"), (snapshot) => {
      setStats(prev => ({ ...prev, memberCount: snapshot.size }));
    });

    const unsubEvents = onSnapshot(query(collection(db, "events"), where("status", "!=", "completed")), (snapshot) => {
      setStats(prev => ({ ...prev, upcomingEvents: snapshot.size }));
    });

    return () => {
      unsubTrans();
      unsubMembers();
      unsubEvents();
    };
  }, []);

  // Generate Falling Particles based on theme
  const renderParticles = () => {
    if (theme.name === 'default') return null;
    
    const particles = [];
    const count = 10;
    const emoji = theme.assets.decoration;
    
    for (let i = 0; i < count; i++) {
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 5 + Math.random() * 5;
        particles.push(
            <div 
                key={i} 
                className="falling-item text-xl opacity-60"
                style={{
                    left: `${left}%`,
                    animationDelay: `${delay}s`,
                    animationDuration: `${duration}s`
                }}
            >
                {emoji}
            </div>
        );
    }
    return <div className="fixed inset-0 pointer-events-none overflow-hidden h-screen z-0">{particles}</div>;
  };

  const SeasonalWidget: React.FC = () => {
      if (theme.name === 'ramadan') {
          return (
              <div className="bg-gradient-to-r from-emerald-600 to-teal-800 rounded-[28px] p-5 text-white shadow-lg mb-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-20 transform translate-x-4 -translate-y-4">
                      <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C9.5 2 7.2 3 5.4 4.6C7.6 6.3 9 9 9 12C9 15 7.6 17.7 5.4 19.4C7.2 21 9.5 22 12 22C17.5 22 22 17.5 22 12S17.5 2 12 2Z" /></svg>
                  </div>
                  <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                          <div>
                              <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider mb-1">Ramadhan Kareem</p>
                              <h3 className="text-2xl font-bold">Waktunya Berbagi</h3>
                          </div>
                          <span className="text-3xl">🕌</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl flex items-center gap-3">
                              <Clock className="w-5 h-5 text-emerald-200" />
                              <div>
                                  <p className="text-[10px] text-emerald-200 uppercase">Maghrib</p>
                                  <p className="font-bold">17:54</p>
                              </div>
                          </div>
                          <button onClick={() => navigate('/finance')} className="bg-white text-emerald-800 p-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors">
                              <Heart className="w-4 h-4 fill-emerald-800" /> Donasi
                          </button>
                      </div>
                  </div>
              </div>
          );
      }
      
      if (theme.name === 'independence') {
        return (
            <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-[28px] p-5 text-white shadow-lg mb-6 relative overflow-hidden">
                <div className="absolute -right-4 top-0 opacity-20 text-9xl font-black">79</div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <Flag className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-red-100">Dirgahayu Indonesia</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 leading-tight">Semangat Kemerdekaan!</h3>
                    <div className="flex gap-3">
                        <Button variant="secondary" className="!py-2 !px-4 !text-xs h-10 bg-white text-red-600 hover:bg-red-50">Daftar Lomba</Button>
                        <Button variant="outline" className="!py-2 !px-4 !text-xs h-10 border-white/30 text-white hover:bg-white/10">Jadwal Upacara</Button>
                    </div>
                </div>
            </div>
        );
      }

      if (theme.name === 'new_year') {
         return (
            <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-[28px] p-5 text-white shadow-lg mb-6 relative overflow-hidden border border-white/10">
                 <div className="relative z-10 text-center py-2">
                     <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Welcome</p>
                     <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500">2026</h3>
                     <p className="text-sm text-slate-300 mt-2 mb-4">Mulai lembaran baru dengan semangat baru.</p>
                     <Button className="w-full bg-white text-indigo-900 hover:bg-indigo-50">Buat Resolusi Organisasi</Button>
                 </div>
            </div>
         );
      }

      // Default Greeting
      return null;
  };

  return (
    <div className={`min-h-screen ${theme.colors.background} transition-colors duration-500`}>
      {renderParticles()}
      
      <div className="pt-4 px-4 space-y-6 animate-fade-in relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 cursor-pointer group p-1 rounded-2xl hover:bg-black/5 transition-colors"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border-2 ${theme.name === 'default' ? 'border-slate-200' : 'border-white/50'}`}>
               {user?.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover"/> : <span className="text-xs font-bold">KT</span>}
            </div>
            <div>
              <p className={`text-sm font-medium ${theme.name !== 'default' ? 'text-slate-500' : 'text-slate-500'}`}>Halo, {user?.displayName?.split(' ')[0]}</p>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-1">
                 {theme.name === 'independence' ? 'Merdeka! 🇮🇩' : theme.name === 'ramadan' ? 'Marhaban 🌙' : 'Dashboard'}
              </h1>
            </div>
          </div>
          <Button variant="ghost" className="rounded-full border border-slate-200 w-12 h-12 !p-0 flex items-center justify-center bg-white shadow-sm">
            <Bell className="w-5 h-5 text-slate-700" />
          </Button>
        </div>

        {/* Seasonal Widget (Conditional) */}
        <SeasonalWidget />

        {/* Standard Hero Card / Saldo */}
        {theme.name === 'default' && (
            <div className={`${theme.colors.cardBg} rounded-[32px] p-6 text-white shadow-xl relative overflow-hidden transition-colors duration-500`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="relative z-10">
                <p className="text-white/60 font-medium mb-1">Total Kas Organisasi</p>
                <h2 className="text-4xl font-bold mb-6">Rp {(stats.balance / 1000).toFixed(0)}rb</h2>
                
                <div className="flex gap-3">
                    <button 
                    onClick={() => navigate('/finance')}
                    className="flex-1 bg-white text-slate-900 py-3 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-colors"
                    >
                    Cek Detail
                    </button>
                    <button className="flex-1 bg-white/10 text-white py-3 rounded-2xl font-bold text-sm backdrop-blur-md hover:bg-white/20 transition-colors border border-white/10">
                    Bayar Iuran
                    </button>
                </div>
                </div>
            </div>
        )}

        {/* Quick Menu */}
        <div className="bg-white/60 backdrop-blur-xl p-4 rounded-[32px] border border-white/50 shadow-sm">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Anggota', icon: <Users className="w-6 h-6" />, path: '/members', color: 'bg-blue-50 text-blue-600' },
              { label: 'Keuangan', icon: <Wallet className="w-6 h-6" />, path: '/finance', color: 'bg-green-50 text-green-600' },
              { label: 'Kegiatan', icon: <Calendar className="w-6 h-6" />, path: '/events', color: 'bg-orange-50 text-orange-600' },
              { label: 'Laporan', icon: <ArrowUpRight className="w-6 h-6" />, path: '/reports', color: 'bg-purple-50 text-purple-600' },
            ].map((item, idx) => (
              <div key={idx} onClick={() => navigate(item.path)} className="flex flex-col items-center gap-2 cursor-pointer group">
                <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center ${item.color} group-active:scale-95 transition-transform shadow-sm`}>
                  {item.icon}
                </div>
                <span className="text-xs font-semibold text-slate-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="pb-24">
          <SectionHeader title="Statistik Singkat" />
          <div className="grid grid-cols-2 gap-4">
             <Card className="flex flex-col items-center justify-center text-center !py-8 bg-white border-slate-100">
                 <h3 className={`text-3xl font-bold mb-1 ${theme.colors.accent}`}>{stats.upcomingEvents}</h3>
                 <p className="text-xs font-semibold text-slate-500 uppercase">Agenda Aktif</p>
             </Card>
             <Card className="flex flex-col items-center justify-center text-center !py-8 bg-white border-slate-100">
                 <h3 className={`text-3xl font-bold mb-1 ${theme.colors.accent}`}>{stats.memberCount}</h3>
                 <p className="text-xs font-semibold text-slate-500 uppercase">Total Anggota</p>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;