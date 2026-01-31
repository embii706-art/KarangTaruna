import React, { useEffect, useState } from 'react';
import { Bell, Wallet, Users, Calendar, ArrowUpRight, ArrowDownLeft, MoreHorizontal, ChevronRight, Activity, TrendingUp, Sparkles, CreditCard, Search, Folder, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { collection, onSnapshot, query, where, limit, orderBy } from 'firebase/firestore';
import { useTheme } from '../services/themeService';
import { Season } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { season } = useTheme();
  const user = auth.currentUser;
  
  const [stats, setStats] = useState({
    balance: 0,
    memberCount: 0,
    upcomingEvents: 0
  });

  const [searchQuery, setSearchQuery] = useState('');
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
    const unsubEvents = onSnapshot(collection(db, "events"), (snapshot) => {
        const events = snapshot.docs.map(d => ({id: d.id, ...d.data()}))
                        .filter((e: any) => e.status !== 'completed')
                        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .slice(0, 4); // Fetch 4 for grid
        setStats(prev => ({ ...prev, upcomingEvents: events.length }));
        setRecentEvents(events);
    });

    return () => {
      unsubTrans();
      unsubMembers();
      unsubEvents();
    };
  }, [user]);

  return (
    <div className="pt-8 px-6 pb-32 space-y-6 animate-fade-in relative z-10">

        {/* Decorative Background Mesh */}
        <div className={`fixed top-0 left-0 w-full h-[500px] opacity-30 pointer-events-none -z-10 blur-3xl transition-colors duration-1000
            ${season === Season.RAMADAN ? 'bg-emerald-900' : season === Season.INDEPENDENCE ? 'bg-red-900' : 'mesh-gradient'}`}
        ></div>

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Hi {user?.displayName?.split(' ')[0] || 'Member'}!
            </h1>
            <p className="text-slate-400 font-medium text-sm mt-1">Good Morning</p>
          </div>
          <div 
            onClick={() => navigate('/notifications')}
            className="relative cursor-pointer group p-2 rounded-full hover:bg-white/10 transition-all active:scale-95"
          >
            <Bell className="w-6 h-6 text-white" />
            <div className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]"></div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full bg-white/5 border border-white/10 rounded-[20px] py-4 pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:bg-white/10 focus:border-indigo-500/50 transition-all"
            />
        </div>

        {/* Welcome Banner */}
        <div className="glass-card rounded-[32px] p-6 relative overflow-hidden border border-white/10">
            <div className="flex justify-between items-center relative z-10">
                <div className="max-w-[60%]">
                    <h2 className="text-lg font-bold text-white mb-2 leading-tight">Welcome!<br/>Let's schedule your projects</h2>
                </div>
                {/* Illustration Placeholder */}
                <div className={`w-24 h-24 rounded-full flex items-center justify-center relative transition-colors duration-500
                    ${season === Season.RAMADAN ? 'bg-gradient-to-br from-emerald-500/20 to-green-500/20' :
                      season === Season.INDEPENDENCE ? 'bg-gradient-to-br from-red-500/20 to-white/20' :
                      'bg-gradient-to-br from-indigo-500/20 to-purple-500/20'}`}
                >
                    <div className={`absolute inset-0 blur-xl rounded-full opacity-50
                        ${season === Season.RAMADAN ? 'bg-emerald-500/20' :
                          season === Season.INDEPENDENCE ? 'bg-red-500/20' :
                          'bg-indigo-500/20'}`}
                    ></div>
                    <Calendar className={`w-10 h-10 relative z-10
                        ${season === Season.RAMADAN ? 'text-emerald-300' :
                          season === Season.INDEPENDENCE ? 'text-red-300' :
                          'text-indigo-300'}`}
                    />
                </div>
            </div>
        </div>

        {/* Ongoing Projects (Grid) */}
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Ongoing Projects</h3>
                <button onClick={() => navigate('/events')} className="text-indigo-400 text-sm font-medium hover:text-indigo-300 transition-colors">view all</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Finance Card (Always visible as a "Project") */}
                {('Finance Management'.toLowerCase().includes(searchQuery.toLowerCase()) || searchQuery === '') && (
                <div
                    onClick={() => navigate('/finance')}
                    className="bg-[#1e3a8a] rounded-[24px] p-5 relative overflow-hidden cursor-pointer active:scale-95 transition-all shadow-lg shadow-blue-900/20"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="text-xs text-blue-200 font-medium">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        <MoreVertical className="w-4 h-4 text-blue-300" />
                    </div>

                    <div className="mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/30 flex items-center justify-center mb-3 text-white">
                            <Wallet className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-white text-sm">Finance</h4>
                        <p className="text-blue-200 text-xs mt-1">Management</p>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-blue-200">
                            <span>Progress</span>
                            <span>{stats.balance > 0 ? '75%' : '0%'}</span>
                        </div>
                        <div className="w-full h-1 bg-blue-900/50 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400 rounded-full w-3/4"></div>
                        </div>
                    </div>
                </div>
                )}

                {/* Dashboard / Stats Card */}
                {('Dashboard Overview'.toLowerCase().includes(searchQuery.toLowerCase()) || searchQuery === '') && (
                 <div
                    onClick={() => navigate('/reports')}
                    className="bg-white/5 border border-white/5 rounded-[24px] p-5 relative overflow-hidden cursor-pointer active:scale-95 transition-all"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="text-xs text-slate-400 font-medium">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        <MoreVertical className="w-4 h-4 text-slate-500" />
                    </div>

                    <div className="mb-4">
                         <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center mb-3 text-orange-400">
                            <Activity className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-white text-sm">Dashboard</h4>
                        <p className="text-slate-400 text-xs mt-1">Overview</p>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>Progress</span>
                            <span>50%</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-400 rounded-full w-1/2"></div>
                        </div>
                    </div>
                </div>
                )}

                {/* Dynamic Event Cards */}
                {recentEvents
                    .filter(event =>
                        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        'Event'.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((event, idx) => (
                    <div
                        key={idx}
                        onClick={() => navigate('/events')}
                        className="bg-white/5 border border-white/5 rounded-[24px] p-5 relative overflow-hidden cursor-pointer active:scale-95 transition-all"
                    >
                         <div className="flex justify-between items-start mb-6">
                            <div className="text-xs text-slate-400 font-medium">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                            <MoreVertical className="w-4 h-4 text-slate-500" />
                        </div>

                        <div className="mb-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-3 text-purple-400">
                                <Folder className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-white text-sm truncate">{event.title}</h4>
                            <p className="text-slate-400 text-xs mt-1 truncate">Event</p>
                        </div>

                         <div className="space-y-1">
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Progress</span>
                                <span>30%</span>
                            </div>
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-400 rounded-full w-[30%]"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default Dashboard;