import React, { useEffect, useState } from 'react';
import { ArrowLeft, UserCheck, Check, X as XIcon, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, updateDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Member } from '../types';
import { Card, Button } from '../components/UI';

const Verification: React.FC = () => {
  const navigate = useNavigate();
  const [pendingMembers, setPendingMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Realtime listener for pending members from 'users' collection
    const q = query(collection(db, "users"), where("status", "==", "pending"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
        setPendingMembers(data);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching pending members:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (id: string) => {
    try {
        await updateDoc(doc(db, "users", id), { status: 'active' });
    } catch (error) {
        console.error("Error approving member:", error);
        alert("Gagal memverifikasi member. Cek permissions.");
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menolak member ini? Data akun akan dihapus.")) return;
    try {
        await deleteDoc(doc(db, "users", id));
    } catch (error) {
        console.error("Error rejecting member:", error);
        alert("Gagal menolak member.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col relative">
      {/* Header */}
      <div className="px-4 pt-6 pb-2 flex items-center gap-4 sticky top-0 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-sm z-20">
        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-all active:scale-95">
          <ArrowLeft className="w-6 h-6 text-slate-900 dark:text-white" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
           <UserCheck className="w-5 h-5"/> Verifikasi Member
        </h1>
      </div>

      <div className="p-4 space-y-4 pb-24">
        {loading ? (
             <div className="space-y-4">
                 {[1,2,3].map(i => (
                     <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
                 ))}
             </div>
        ) : pendingMembers.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
                <UserCheck className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Tidak ada permintaan verifikasi baru.</p>
            </div>
        ) : (
            pendingMembers.map((member) => (
                <Card key={member.id} className="!p-4 border-slate-200 dark:border-slate-800 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden flex-shrink-0">
                           {member.avatar ? (
                               <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                           ) : (
                               <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold">
                                   {member.name.charAt(0)}
                               </div>
                           )}
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-slate-900 dark:text-white truncate">{member.name}</h3>
                            <p className="text-sm text-slate-500 truncate">{member.email || 'No Email'}</p>
                            <span className="text-xs text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-full mt-1 inline-block">
                                Menunggu Verifikasi
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-2">
                        <Button
                            className="flex-1 !bg-red-50 !text-red-600 hover:!bg-red-100 dark:!bg-red-900/20 dark:!text-red-400 border-none justify-center"
                            variant="secondary"
                            onClick={() => handleReject(member.id)}
                        >
                            <XIcon className="w-4 h-4 mr-2" /> Tolak
                        </Button>
                        <Button
                            className="flex-1 !bg-green-600 hover:!bg-green-700 text-white border-none justify-center"
                            onClick={() => handleApprove(member.id)}
                        >
                            <Check className="w-4 h-4 mr-2" /> Terima
                        </Button>
                    </div>
                </Card>
            ))
        )}

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex gap-3 items-start mt-6">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                Pastikan data member sudah benar sebelum melakukan verifikasi. Member yang disetujui akan langsung mendapatkan akses penuh.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Verification;
