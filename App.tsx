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
import Voting from './pages/Voting';
import WasteBank from './pages/WasteBank';

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
    <div className="min-h-screen bg-[#F8F9FA] max-w-md mx-auto relative shadow-2xl shadow-slate-200 overflow-hidden min-w-[320px]">
      <div className={`h-full overflow-y-auto no-scrollbar ${!hideNav ? 'pb-24' : ''}`}>
        {children}
      </div>
      
      {/* Bottom Navigation */}
      {!hideNav && (
        <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-100 pb-safe pt-2 px-6 flex justify-between items-center z-40 rounded-t-[32px] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
            {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
                <Link 
                key={item.path} 
                to={item.path} 
                className="flex flex-col items-center justify-center p-3 gap-1 relative group flex-1"
                >
                <div className={`transition-all duration-300 ${isActive ? '-translate-y-1' : ''}`}>
                    <item.icon 
                        className={`w-6 h-6 transition-colors duration-300 ${isActive ? 'text-slate-900 fill-slate-900' : 'text-slate-300'}`}
                        strokeWidth={isActive ? 2 : 2.5}
                    />
                </div>
                {isActive && (
                    <span className="absolute bottom-1 w-1 h-1 bg-slate-900 rounded-full animate-fade-in"></span>
                )}
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