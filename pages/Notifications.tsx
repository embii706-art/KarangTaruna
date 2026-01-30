import React, { useEffect, useState } from 'react';
import { ArrowLeft, Bell, Calendar, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Card } from '../components/UI';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'event';
  date: string; // ISO string
  read?: boolean;
}

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Fetch notifications
    const q = query(
        collection(db, "notifications"),
        orderBy("date", "desc"),
        limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
      setNotifications(data);
    }, (error) => {
        console.error("Error fetching notifications:", error);
        // Fallback mock data if Firestore is empty or fails (for demo/verification)
        setNotifications([
            { id: '1', title: 'Rapat Bulanan', message: 'Jangan lupa hadir rapat bulanan besok malam.', type: 'event', date: new Date().toISOString() },
            { id: '2', title: 'Iuran Wajib', message: 'Silakan bayar iuran bulan ini.', type: 'warning', date: new Date(Date.now() - 86400000).toISOString() },
            { id: '3', title: 'Selamat Datang!', message: 'Selamat bergabung di aplikasi KARTEJI.', type: 'success', date: new Date(Date.now() - 172800000).toISOString() }
        ]);
    });

    return () => unsubscribe();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
        case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
        case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
        case 'event': return <Calendar className="w-5 h-5 text-blue-500" />;
        default: return <Info className="w-5 h-5 text-slate-500" />;
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col relative">
      {/* Header */}
      <div className="px-4 pt-6 pb-2 flex items-center gap-4 sticky top-0 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-sm z-20">
        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-all active:scale-95">
          <ArrowLeft className="w-6 h-6 text-slate-900 dark:text-white" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
           <Bell className="w-5 h-5"/> Notifikasi
        </h1>
      </div>

      <div className="p-4 space-y-4 pb-24">
        {notifications.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Belum ada notifikasi.</p>
            </div>
        ) : (
            notifications.map((notif) => (
                <div key={notif.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex gap-4 animate-fade-in">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        notif.type === 'warning' ? 'bg-orange-50 dark:bg-orange-900/20' :
                        notif.type === 'success' ? 'bg-green-50 dark:bg-green-900/20' :
                        notif.type === 'event' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-slate-50 dark:bg-slate-800'
                    }`}>
                        {getIcon(notif.type)}
                    </div>
                    <div>
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">{notif.title}</h3>
                            <span className="text-[10px] text-slate-400">{formatDate(notif.date)}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            {notif.message}
                        </p>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
