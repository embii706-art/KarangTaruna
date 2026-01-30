import React, { useEffect, useState } from 'react';
import { ArrowLeft, UserCheck, Check, X as XIcon, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Member, MemberRole } from '../types';
import { Card, Button } from '../components/UI';

const Verification: React.FC = () => {
  const navigate = useNavigate();
  const [pendingMembers, setPendingMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial dummy data for visual testing before Firebase population
  const [useMock, setUseMock] = useState(true);

  useEffect(() => {
    const fetchPendingMembers = async () => {
      try {
        setLoading(true);
        // Firestore query
        const q = query(collection(db, "members"), where("status", "==", "pending"));
        const snapshot = await getDocs(q);

        if (snapshot.empty && useMock) {
            // Mock data if no real data found
            setPendingMembers([
                { id: '1', name: 'Budi Santoso', email: 'budi@example.com', role: MemberRole.MEMBER, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi', joinedAt: new Date().toISOString(), status: 'pending' },
                { id: '2', name: 'Siti Aminah', email: 'siti@example.com', role: MemberRole.MEMBER, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti', joinedAt: new Date().toISOString(), status: 'pending' }
            ]);
        } else {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
            setPendingMembers(data);
        }
      } catch (error) {
        console.error("Error fetching pending members:", error);
        // Fallback to mock on error
        if (useMock) {
             setPendingMembers([
                { id: '1', name: 'Budi Santoso', email: 'budi@example.com', role: MemberRole.MEMBER, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi', joinedAt: new Date().toISOString(), status: 'pending' },
                { id: '2', name: 'Siti Aminah', email: 'siti@example.com', role: MemberRole.MEMBER, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti', joinedAt: new Date().toISOString(), status: 'pending' }
            ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPendingMembers();
  }, [useMock]);

  const handleApprove = async (id: string) => {
    try {
        // Optimistic update
        setPendingMembers(prev => prev.filter(m => m.id !== id));

        // Firestore update (only executes if not mock data or handle properly)
        // In a real scenario, check if the ID exists in DB
        // await updateDoc(doc(db, "members", id), { status: 'active' });
        console.log(`Approved member ${id}`);
    } catch (error) {
        console.error("Error approving member:", error);
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menolak member ini?")) return;
    try {
        // Optimistic update
        setPendingMembers(prev => prev.filter(m => m.id !== id));

        // Firestore delete
        // await deleteDoc(doc(db, "members", id));
        console.log(`Rejected member ${id}`);
    } catch (error) {
        console.error("Error rejecting member:", error);
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
             <div className="text-center py-10 text-slate-400">Loading...</div>
        ) : pendingMembers.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
                <UserCheck className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Tidak ada permintaan verifikasi baru.</p>
            </div>
        ) : (
            pendingMembers.map((member) => (
                <Card key={member.id} className="!p-4 border-slate-200 dark:border-slate-800 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full bg-slate-100" />
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">{member.name}</h3>
                            <p className="text-sm text-slate-500">{member.email || 'No Email'}</p>
                            <span className="text-xs text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-full mt-1 inline-block">
                                Menunggu Verifikasi
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-2">
                        <Button
                            className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 border-none"
                            variant="secondary"
                            onClick={() => handleReject(member.id)}
                        >
                            <XIcon className="w-4 h-4 mr-2" /> Tolak
                        </Button>
                        <Button
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white border-none"
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
