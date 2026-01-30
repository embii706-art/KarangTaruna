import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, X, Loader2, Plus, Trash2, CheckCircle } from 'lucide-react';
import { Button, Card, Input, Modal } from '../components/UI';
import { EventProposal } from '../types';
import { generateEventIdeas, refineProposal } from '../services/geminiService';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../services/firebase';

const Events: React.FC = () => {
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiStep, setAiStep] = useState<'topic' | 'ideas' | 'refine'>('topic');
  const [topic, setTopic] = useState('');
  const [ideas, setIdeas] = useState<string[]>([]);
  const [selectedIdea, setSelectedIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [proposalResult, setProposalResult] = useState<{description: string, budget: number} | null>(null);

  const [events, setEvents] = useState<EventProposal[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, "events"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventProposal));
      setEvents(data);
    }, (error) => {
      console.error("Error fetching events:", error);
      // Fallback/Mock Data
      setEvents([
          { id: '1', title: 'Lomba 17 Agustus', date: new Date().toISOString(), description: 'Perayaan hari kemerdekaan dengan berbagai lomba tradisional.', budget: 2500000, status: 'approved' },
          { id: '2', title: 'Kerja Bakti Desa', date: new Date(Date.now() + 86400000 * 7).toISOString(), description: 'Membersihkan selokan dan lingkungan sekitar.', budget: 500000, status: 'draft' }
      ]);
    });
    return () => unsubscribe();
  }, []);

  const handleGenerateIdeas = async () => {
    if (!topic) return;
    setLoading(true);
    const results = await generateEventIdeas(topic);
    setIdeas(results);
    setLoading(false);
    setAiStep('ideas');
  };

  const handleRefineProposal = async (idea: string) => {
    setLoading(true);
    setSelectedIdea(idea);
    const result = await refineProposal(idea, `Event about ${topic}`);
    setProposalResult({ description: result.description, budget: result.estimatedBudget });
    setLoading(false);
    setAiStep('refine');
  };

  const handleSaveEvent = async () => {
    if (proposalResult && selectedIdea) {
        await addDoc(collection(db, "events"), {
            title: selectedIdea,
            date: new Date().toISOString().split('T')[0],
            description: proposalResult.description,
            budget: proposalResult.budget,
            status: 'draft'
        });
        
        setShowAIModal(false);
        setAiStep('topic');
        setTopic('');
        setProposalResult(null);
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
         <Button onClick={() => setShowAIModal(true)} variant="primary" className="!px-4">
            <Sparkles className="w-5 h-5 mr-1" />
            AI Assist
         </Button>
      </div>

      <div className="space-y-4">
        {events.length > 0 ? events.map((event) => (
            <Card key={event.id} className="flex flex-col gap-3 !p-4">
                <div className="flex justify-between items-start">
                    <div className="bg-slate-100 rounded-2xl p-3 text-center min-w-[60px]">
                        <span className="block text-xs font-bold text-slate-500 uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                        <span className="block text-xl font-bold text-slate-900">{new Date(event.date).getDate()}</span>
                    </div>
                    <div className="flex-1 ml-4">
                        <h3 className="font-bold text-lg text-slate-900">{event.title}</h3>
                        <p className="text-sm text-slate-500 line-clamp-2 mt-1">{event.description}</p>
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
                        <MapPin className="w-3 h-3" /> Balai Desa
                    </div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1 ml-auto">
                        Budget: Rp {event.budget.toLocaleString('id-ID')}
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

      {/* AI Assistant Modal Overlay */}
      {showAIModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl animate-slide-up h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">AI Planner</h2>
                    </div>
                    <button onClick={() => setShowAIModal(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-all active:scale-95">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                    {aiStep === 'topic' && (
                        <div className="space-y-4">
                            <p className="text-slate-600">Apa tema kegiatan yang ingin kamu buat?</p>
                            <Input 
                                autoFocus
                                placeholder="Contoh: Lingkungan, Olahraga, Kesenian..." 
                                value={topic} 
                                onChange={(e) => setTopic(e.target.value)} 
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {['HUT RI', 'Ramadhan', 'Kebersihan', 'Turnamen Futsal'].map(t => (
                                    <button key={t} onClick={() => setTopic(t)} className="px-4 py-2 bg-slate-50 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 border border-slate-100 transition-all active:scale-95">
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {aiStep === 'ideas' && (
                        <div className="space-y-3">
                            <p className="text-slate-600">Pilih salah satu ide kegiatan:</p>
                            {ideas.map((idea, idx) => (
                                <div key={idx} onClick={() => handleRefineProposal(idea)} className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 cursor-pointer transition-all active:scale-95 group">
                                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-700">{idea}</h3>
                                </div>
                            ))}
                        </div>
                    )}

                    {aiStep === 'refine' && proposalResult && (
                        <div className="space-y-4 bg-slate-50 p-5 rounded-3xl">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Judul</label>
                                <h3 className="text-xl font-bold text-slate-900">{selectedIdea}</h3>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deskripsi Singkat</label>
                                <p className="text-slate-700 leading-relaxed mt-1">{proposalResult.description}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimasi Biaya</label>
                                <p className="text-2xl font-bold text-slate-900 mt-1">Rp {proposalResult.budget.toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                            <p className="text-sm font-medium">Sedang berpikir...</p>
                        </div>
                    )}
                </div>

                <div className="pt-4 border-t border-slate-100">
                    {aiStep === 'topic' && (
                        <Button className="w-full" onClick={handleGenerateIdeas} disabled={!topic}>Generate Ide</Button>
                    )}
                    {aiStep === 'refine' && (
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200" onClick={handleSaveEvent}>Buat Draft Proposal</Button>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Events;