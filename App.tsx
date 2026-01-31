import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, Wallet, Calendar, PieChart } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';
import { ThemeProvider } from './services/themeService';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Finance from './pages/Finance';
import Events from './pages/Events';
import Reports from './pages/Reports';
import Splash from './pages/Splash';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Structure from './pages/Structure';
import WasteBank from './pages/WasteBank';
import Notifications from './pages/Notifications';
import Payment from './pages/Payment';
import Gallery from './pages/Gallery';
import Verification from './pages/Verification';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Auth Protection
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const publicPaths = ['/', '/login', '/register'];
      if (!user && !publicPaths.includes(location.pathname)) {
        navigate('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate, location.pathname]);

  // Hide navigation on auth pages and Profile page
  const hideNav = ['/', '/login', '/register', '/profile'].includes(location.pathname);

  const navItems = [
    { label: 'Home', icon: Home, path: '/dashboard' },
    { label: 'Anggota', icon: Users, path: '/members' },
    { label: 'Keuangan', icon: Wallet, path: '/finance' },
    { label: 'Proker', icon: Calendar, path: '/events' },
    { label: 'Laporan', icon: PieChart, path: '/reports' },
  ];

  if (loading) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 max-w-md mx-auto relative shadow-2xl shadow-black overflow-hidden min-w-[320px]">
      <div className={`h-full overflow-y-auto no-scrollbar ${!hideNav ? 'pb-28' : ''}`}>
        {children}
      </div>
      
      {/* Floating Glass Dock Navigation */}
      {!hideNav && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-sm z-50">
            <nav className="glass-card rounded-[24px] px-2 py-3 flex justify-between items-center shadow-lg shadow-indigo-500/10 border border-white/10">
                {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link
                    key={item.path}
                    to={item.path}
                    className="flex flex-col items-center justify-center p-2 relative group flex-1"
                    >
                    <div className={`relative z-10 p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'text-slate-400 hover:text-white'}`}>
                        <item.icon
                            className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                            strokeWidth={isActive ? 2.5 : 2}
                        />
                    </div>
                    {isActive && (
                        <span className="absolute -bottom-1 w-1 h-1 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_8px_#818cf8]"></span>
                    )}
                    </Link>
                );
                })}
            </nav>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/members" element={<Members />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/events" element={<Events />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/structure" element={<Structure />} />
            <Route path="/waste-bank" element={<WasteBank />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/verification" element={<Verification />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;