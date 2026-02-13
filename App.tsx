import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Wallet, User, Plus, FileText, ClipboardList } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './services/firebase';
import i18n from './services/i18n';
import { ThemeProvider, useTheme } from './services/themeService';
import { Season } from './types';
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
import SetupWizard from './pages/SetupWizard';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { season } = useTheme();
  const [loading, setLoading] = useState(true);

  // Auth Protection & Global Checks
  useEffect(() => {
    const checkStatus = async (user: any) => {
      const publicPaths = ['/', '/login', '/register', '/setup'];

      if (!user) {
         if (!publicPaths.includes(location.pathname)) {
             navigate('/login');
         }
         setLoading(false);
         return;
      }

      // 1. Load User Language Preference
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().language) {
             i18n.changeLanguage(userDoc.data().language);
        }
      } catch (e) {
        console.error("Error loading user profile:", e);
      }

      // 2. Check System Setup Status
      // Optimization: Could cache this state, but for safety checking every load/auth change
      try {
        const orgSettings = await getDoc(doc(db, "settings", "organization"));
        if (!orgSettings.exists() && location.pathname !== '/setup') {
             navigate('/setup');
        }
      } catch (e) {
        console.error("Error checking setup status:", e);
      }

      setLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
        checkStatus(user);
    });
    return () => unsubscribe();
  }, [navigate, location.pathname]);

  // Hide navigation on auth pages and setup
  const hideNav = ['/', '/login', '/register', '/setup'].includes(location.pathname);

  // Revised Navigation Items
  const navItems = [
    { label: 'Home', icon: Home, path: '/dashboard' },
    { label: 'My Task', icon: ClipboardList, path: '/events' },
    // Center button is handled separately
    { label: 'Payment', icon: Wallet, path: '/finance' },
    { label: 'Profile', icon: User, path: '/profile' },
  ];

  if (loading) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 max-w-md mx-auto relative shadow-2xl shadow-black overflow-hidden min-w-[320px]">
      <div className={`h-full overflow-y-auto no-scrollbar ${!hideNav ? 'pb-40' : ''}`}>
        {children}
      </div>
      
      {/* Floating Dock Navigation */}
      {!hideNav && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-sm z-50">
            <div className="relative">
                {/* Main Bar */}
                <nav className={`glass-card rounded-[24px] px-6 py-4 flex justify-between items-center shadow-lg border border-white/10 relative z-10 transition-shadow duration-500
                    ${season === Season.RAMADAN ? 'shadow-emerald-500/10' : season === Season.INDEPENDENCE ? 'shadow-red-500/10' : 'shadow-indigo-500/10'}`}>

                    {/* Left Items */}
                    <div className="flex gap-8">
                        {navItems.slice(0, 2).map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex flex-col items-center gap-1 transition-colors duration-300
                                        ${isActive ? (season === Season.RAMADAN ? 'text-emerald-400' : season === Season.INDEPENDENCE ? 'text-red-400' : 'text-indigo-400')
                                        : 'text-slate-400 hover:text-slate-200'}`}
                                >
                                    <item.icon
                                        className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`}
                                        strokeWidth={isActive ? 2 : 2}
                                    />
                                    <span className="text-[10px] font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Spacer for Center Button */}
                    <div className="w-12"></div>

                    {/* Right Items */}
                    <div className="flex gap-8">
                        {navItems.slice(2, 4).map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex flex-col items-center gap-1 transition-colors duration-300
                                        ${isActive ? (season === Season.RAMADAN ? 'text-emerald-400' : season === Season.INDEPENDENCE ? 'text-red-400' : 'text-indigo-400')
                                        : 'text-slate-400 hover:text-slate-200'}`}
                                >
                                    <item.icon
                                        className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`}
                                        strokeWidth={isActive ? 2 : 2}
                                    />
                                    <span className="text-[10px] font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Floating Center Button */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-6 z-20">
                    <button
                        onClick={() => navigate('/events')}
                        className="w-14 h-14 bg-[#1e293b] rounded-full flex items-center justify-center text-white shadow-[0_4px_20px_rgba(0,0,0,0.4)] border-4 border-slate-950 active:scale-95 transition-transform"
                    >
                        <Plus className="w-6 h-6" strokeWidth={3} />
                    </button>
                </div>
            </div>
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
            <Route path="/setup" element={<SetupWizard />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;