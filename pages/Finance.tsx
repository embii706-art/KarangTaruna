import React, { useState, useEffect } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Download, Plus, Trash2 } from 'lucide-react';
import { SectionHeader, Button, Modal, Input, Select } from '../components/UI';
import { Transaction } from '../types';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../services/firebase';

const Finance: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTrx, setNewTrx] = useState<Partial<Transaction>>({
    type: 'income',
    title: '',
    amount: 0,
    category: 'Iuran'
  });

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, "transactions"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
      setTransactions(data);
    }, (error) => {
      console.error("Error fetching transactions:", error);
      // Fallback/Mock Data
      setTransactions([
          { id: '1', title: 'Iuran Bulanan', amount: 500000, type: 'income', date: '2023-10-01', category: 'Iuran' },
          { id: '2', title: 'Beli Snack Rapat', amount: 150000, type: 'expense', date: '2023-10-05', category: 'Konsumsi' },
          { id: '3', title: 'Donasi Anggota', amount: 200000, type: 'income', date: '2023-10-10', category: 'Donasi' },
      ]);
    });
    return () => unsubscribe();
  }, []);

  const totalBalance = transactions.reduce((acc, curr) => curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

  const handleAddTransaction = async () => {
    if (!newTrx.title || !newTrx.amount) return;
    try {
        await addDoc(collection(db, "transactions"), {
            ...newTrx,
            date: new Date().toISOString().split('T')[0],
        });
        setIsModalOpen(false);
        setNewTrx({ type: 'income', title: '', amount: 0, category: 'Iuran' });
    } catch (e) {
        console.error("Error adding transaction", e);
    }
  };

  const handleDelete = async (id: string) => {
      if(window.confirm("Hapus transaksi ini?")) {
          await deleteDoc(doc(db, "transactions", id));
      }
  };

  return (
    <div className="pt-4 px-4 animate-fade-in pb-24">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Keuangan</h1>
            <div className="flex gap-2">
                <Button onClick={() => setIsModalOpen(true)} className="w-10 h-10 !p-0 rounded-full flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                </Button>
            </div>
        </div>

        {/* Balance Card */}
        <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl shadow-slate-300 mb-8 relative overflow-hidden">
             {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
            
            <div className="relative z-10 text-center">
                <p className="text-slate-400 font-medium mb-2">Total Saldo Aktif</p>
                <h2 className="text-4xl font-bold mb-8 tracking-tight">Rp {(totalBalance/1000).toFixed(0)}rb</h2>
                
                <div className="flex gap-4">
                    <div className="flex-1 bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
                        <div className="flex items-center justify-center gap-2 text-green-400 mb-1">
                            <ArrowUpCircle className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase">Pemasukan</span>
                        </div>
                        <p className="font-bold text-lg">Rp {(totalIncome/1000).toFixed(0)}rb</p>
                    </div>
                    <div className="flex-1 bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
                        <div className="flex items-center justify-center gap-2 text-red-400 mb-1">
                            <ArrowDownCircle className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase">Pengeluaran</span>
                        </div>
                        <p className="font-bold text-lg">Rp {(totalExpense/1000).toFixed(0)}rb</p>
                    </div>
                </div>
            </div>
        </div>

        <SectionHeader title="Riwayat Transaksi" />

        <div className="space-y-4">
            {transactions.length > 0 ? (
                transactions.map((trx) => (
                    <div key={trx.id} className="bg-white p-4 rounded-3xl flex items-center justify-between border border-slate-50 shadow-sm group">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${trx.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {trx.type === 'income' ? <ArrowUpCircle className="w-6 h-6" /> : <ArrowDownCircle className="w-6 h-6" />}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">{trx.title}</h4>
                                <p className="text-xs font-medium text-slate-500">{trx.date} • {trx.category}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className={`font-bold ${trx.type === 'income' ? 'text-green-600' : 'text-slate-900'}`}>
                                {trx.type === 'income' ? '+' : '-'} Rp {(trx.amount / 1000).toFixed(0)}rb
                            </div>
                            <button onClick={() => handleDelete(trx.id)} className="p-2 text-slate-300 hover:text-red-500 transition-all active:scale-95">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-10 text-slate-400 text-sm">
                    Belum ada transaksi.
                </div>
            )}
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Transaksi">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Tipe</label>
                    <div className="flex gap-2">
                        <button 
                            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${newTrx.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-slate-50 text-slate-500'}`}
                            onClick={() => setNewTrx({...newTrx, type: 'income'})}
                        >
                            Pemasukan
                        </button>
                        <button 
                             className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${newTrx.type === 'expense' ? 'bg-red-100 text-red-700' : 'bg-slate-50 text-slate-500'}`}
                             onClick={() => setNewTrx({...newTrx, type: 'expense'})}
                        >
                            Pengeluaran
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Judul</label>
                    <Input placeholder="Contoh: Iuran Bulanan" value={newTrx.title} onChange={e => setNewTrx({...newTrx, title: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nominal (Rp)</label>
                    <Input type="number" placeholder="0" value={newTrx.amount} onChange={e => setNewTrx({...newTrx, amount: Number(e.target.value)})} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Kategori</label>
                    <Select value={newTrx.category} onChange={e => setNewTrx({...newTrx, category: e.target.value})}>
                        <option>Iuran</option>
                        <option>Donasi</option>
                        <option>Sponsorship</option>
                        <option>Konsumsi</option>
                        <option>Peralatan</option>
                        <option>Lainnya</option>
                    </Select>
                </div>
                <Button className="w-full mt-4" onClick={handleAddTransaction}>Simpan</Button>
            </div>
        </Modal>
    </div>
  );
};

export default Finance;