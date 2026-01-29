import React, { useEffect, useState } from 'react';
import { Bell, Wallet, Users, Calendar, ArrowUpRight, LogOut } from 'lucide-react';
import { Card, SectionHeader, Button } from '../components/UI';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  
  const [stats, setStats] = useState({
    balance: 0,
    memberCount: 0,
    upcomingEvents: 0
  });

  useEffect(() => {
    // Fetch Finance Balance
    const unsubTrans = onSnapshot(collection(db, "transactions"), (snapshot) => {
      let bal = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.type === 'income') bal += data.amount;
        else bal -= data.amount;
      });
      setStats(prev => ({ ...prev, balance: bal }));
    });

    // Fetch Member Count
    const unsubMembers = onSnapshot(collection(db, "users"), (snapshot) => {
      setStats(prev => ({ ...prev, memberCount: snapshot.size }));
    });

    // Fetch Upcoming Events
    const unsubEvents = onSnapshot(query(collection(db, "events"), where("status", "!=", "completed")), (snapshot) => {
      setStats(prev => ({ ...prev, upcomingEvents: snapshot.size }));
    });

    return () => {
      unsubTrans();
      unsubMembers();
      unsubEvents();
    };
  }, []);

  const handleLogout = () => {
    signOut(auth);
    navigate('/login');
  };

  return (
    <div className="pt-4 px-4 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
             {user?.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover"/> : <span className="text-white font-bold text-xl">KT</span>}
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Selamat Datang 👋</p>
            <h1 className="text-xl font-bold text-slate-900 truncate max-w-[150px]">{user?.displayName || 'Anggota'}</h1>
          </div>
        </div>
        <div className="flex gap-2">
            <Button variant="ghost" className="rounded-full border border-slate-100 w-12 h-12 !p-0 flex items-center justify-center">
                <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="rounded-full border border-red-100 bg-red-50 text-red-500 w-12 h-12 !p-0 flex items-center justify-center">
                <LogOut className="w-5 h-5" />
            </Button>
        </div>
      </div>

      {/* Hero Card / Saldo */}
      <div className="bg-slate-900 rounded-[32px] p-6 text-white shadow-xl shadow-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <div className="relative z-10">
          <p className="text-slate-400 font-medium mb-1">Total Kas Organisasi</p>
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

      {/* Quick Menu */}
      <div>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Anggota', icon: <Users className="w-6 h-6" />, path: '/members', color: 'bg-blue-50 text-blue-600' },
            { label: 'Keuangan', icon: <Wallet className="w-6 h-6" />, path: '/finance', color: 'bg-green-50 text-green-600' },
            { label: 'Kegiatan', icon: <Calendar className="w-6 h-6" />, path: '/events', color: 'bg-orange-50 text-orange-600' },
            { label: 'Laporan', icon: <ArrowUpRight className="w-6 h-6" />, path: '/reports', color: 'bg-purple-50 text-purple-600' },
          ].map((item, idx) => (
            <div key={idx} onClick={() => navigate(item.path)} className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center ${item.color} group-active:scale-95 transition-transform`}>
                {item.icon}
              </div>
              <span className="text-xs font-semibold text-slate-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div>
        <SectionHeader title="Statistik Singkat" />
        <div className="grid grid-cols-2 gap-4">
           <Card className="flex flex-col items-center justify-center text-center !py-8 bg-orange-50 border-orange-100">
               <h3 className="text-3xl font-bold text-slate-900 mb-1">{stats.upcomingEvents}</h3>
               <p className="text-xs font-semibold text-slate-500 uppercase">Agenda Aktif</p>
           </Card>
           <Card className="flex flex-col items-center justify-center text-center !py-8 bg-blue-50 border-blue-100">
               <h3 className="text-3xl font-bold text-slate-900 mb-1">{stats.memberCount}</h3>
               <p className="text-xs font-semibold text-slate-500 uppercase">Total Anggota</p>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;