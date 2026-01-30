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
import Voting from './pages/Voting';
import WasteBank from './pages/WasteBank';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

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
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-950 max-w-md mx-auto relative shadow-2xl shadow-slate-200 dark:shadow-black overflow-hidden min-w-[320px] transition-colors duration-300">
      <div className={`h-full overflow-y-auto no-scrollbar ${!hideNav ? 'pb-28' : ''}`}>
        {children}
      </div>
      
      {/* Bottom Navigation */}
      {!hideNav && (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[400px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-100 dark:border-slate-800 pb-2 pt-2 px-2 flex justify-between items-center z-40 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50">
            {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
                <Link 
                key={item.path} 
                to={item.path} 
                className="flex flex-col items-center justify-center p-2 rounded-xl relative group flex-1 transition-all duration-300"
                >
                <div className={`transition-all duration-300 p-2 rounded-xl ${isActive ? 'bg-slate-100 dark:bg-slate-800 translate-y-0' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                    <item.icon 
                        className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-slate-900 dark:text-white fill-slate-900 dark:fill-white' : 'text-slate-400 dark:text-slate-500'}`}
                        strokeWidth={isActive ? 2 : 2.5}
                    />
                </div>
                </Link>
            );
            })}
        </nav>
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
          <Route path="/voting" element={<Voting />} />
          <Route path="/waste-bank" element={<WasteBank />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;