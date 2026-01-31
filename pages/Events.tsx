import React, { useState, useEffect } from 'react';
import { MapPin, X, Plus, Trash2, Calendar, FileText } from 'lucide-react';
import { Button, Card, Input, Modal } from '../components/UI';
import { EventProposal } from '../types';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../services/firebase';

const Events: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [newEvent, setNewEvent] = useState({
      title: '',
      date: '',
      location: '',
      description: '',
      budget: 0
  });

  const [events, setEvents] = useState<EventProposal[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, "events"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventProposal));
      setEvents(data);
    }, (error) => {
      console.error("Error fetching events:", error);
    });
    return () => unsubscribe();
  }, []);

  const handleSaveEvent = async () => {
    if (!newEvent.title || !newEvent.date) return;

    try {
        await addDoc(collection(db, "events"), {
            ...newEvent,
            status: 'draft',
            createdAt: new Date().toISOString()
        });
        
        setShowModal(false);
        setNewEvent({ title: '', date: '', location: '', description: '', budget: 0 });
    } catch (e) {
        console.error("Error saving event:", e);
    }
  };

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
      const nextStatus = currentStatus === 'draft' ? 'approved' : 'completed';
      if (currentStatus === 'completed') return;
      await updateDoc(doc(db, "events", id), { status: nextStatus });
  };

  const handleDelete = async (id: string) => {
      if(window.confirm("Hapus kegiatan ini?")) {
          await deleteDoc(doc(db, "events", id));
      }
  };

  return (
    <div className="pt-4 px-4 animate-fade-in pb-24">
      <div className="flex justify-between items-center mb-6">
         <h1 className="text-2xl font-bold text-slate-900">Program Kerja</h1>
         <Button onClick={() => setShowModal(true)} variant="primary" className="!px-4">
            <Plus className="w-5 h-5 mr-1" />
            Tambah
         </Button>
      </div>

      <div className="space-y-4">
        {events.length > 0 ? events.map((event) => (
            <Card key={event.id} className="flex flex-col gap-3 !p-4">
                <div className="flex justify-between items-start">
                    <div className="bg-slate-100 rounded-2xl p-3 text-center min-w-[60px]">
                        <span className="block text-xs font-bold text-slate-500 uppercase">
                            {event.date ? new Date(event.date).toLocaleString('default', { month: 'short' }) : '-'}
                        </span>
                        <span className="block text-xl font-bold text-slate-900">
                            {event.date ? new Date(event.date).getDate() : '-'}
                        </span>
                    </div>
                    <div className="flex-1 ml-4">
                        <h3 className="font-bold text-lg text-slate-900">{event.title}</h3>
                        <p className="text-sm text-slate-500 line-clamp-2 mt-1">{event.description || 'Tidak ada deskripsi'}</p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                        <button 
                            onClick={() => handleUpdateStatus(event.id, event.status)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all active:scale-95 ${
                                event.status === 'approved' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 
                                event.status === 'completed' ? 'bg-slate-900 text-white' :
                                'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            }`}
                        >
                            {event.status}
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-4 mt-2 border-t border-slate-50 pt-3">
                    <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {event.location || 'TBA'}
                    </div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1 ml-auto">
                        Budget: Rp {event.budget?.toLocaleString('id-ID') || '0'}
                    </div>
                    <button onClick={() => handleDelete(event.id)} className="text-slate-300 hover:text-red-500 ml-2 transition-all active:scale-95">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </Card>
        )) : (
            <div className="text-center py-20 text-slate-400 text-sm">
                Belum ada program kerja.
            </div>
        )}
      </div>

      {/* Manual Input Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Tambah Kegiatan">
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nama Kegiatan</label>
                  <Input
                    placeholder="Contoh: Kerja Bakti"
                    value={newEvent.title}
                    onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                  />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal</label>
                    <Input
                        type="date"
                        value={newEvent.date}
                        onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Budget (Rp)</label>
                    <Input
                        type="number"
                        placeholder="0"
                        value={newEvent.budget}
                        onChange={e => setNewEvent({...newEvent, budget: Number(e.target.value)})}
                    />
                  </div>
              </div>

              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Lokasi</label>
                  <Input
                    placeholder="Contoh: Lapangan Desa"
                    value={newEvent.location}
                    onChange={e => setNewEvent({...newEvent, location: e.target.value})}
                  />
              </div>

              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi</label>
                  <textarea
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 font-medium focus:ring-2 focus:ring-slate-200 outline-none resize-none h-24"
                    placeholder="Deskripsi singkat kegiatan..."
                    value={newEvent.description}
                    onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                  ></textarea>
              </div>

              <Button className="w-full mt-2" onClick={handleSaveEvent}>Simpan Kegiatan</Button>
          </div>
      </Modal>
    </div>
  );
};

export default Events;