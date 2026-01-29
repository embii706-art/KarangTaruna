import React, { useState, useEffect } from 'react';
import { Search, Phone, Mail, MoreHorizontal, Trash2, Edit2 } from 'lucide-react';
import { Input, Button, Modal, Select } from '../components/UI';
import { Member, MemberRole } from '../types';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const Members: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  
  // Edit State
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
      setMembers(usersData);
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateRole = async () => {
    if (!editingMember) return;
    try {
      await updateDoc(doc(db, "users", editingMember.id), {
        role: editingMember.role,
        status: editingMember.status
      });
      setIsEditModalOpen(false);
      setEditingMember(null);
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus anggota ini?")) {
      try {
        await deleteDoc(doc(db, "users", id));
      } catch (error) {
        console.error("Error deleting member:", error);
      }
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || m.role === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="pt-4 px-4 space-y-6 animate-fade-in pb-24">
      <div className="flex justify-between items-end">
         <h1 className="text-2xl font-bold text-slate-900">Anggota <br/><span className="text-slate-400 font-normal text-lg">{members.length} Orang</span></h1>
      </div>

      <Input 
        placeholder="Cari nama anggota..." 
        icon={<Search className="w-5 h-5"/>} 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {['All', MemberRole.CHAIRMAN, MemberRole.VICE_CHAIRMAN, MemberRole.SECRETARY, MemberRole.TREASURER, MemberRole.MEMBER].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
              filter === f 
                ? 'bg-slate-900 text-white' 
                : 'bg-white text-slate-500 border border-slate-200'
            }`}
          >
            {f === 'All' ? 'Semua' : f}
          </button>
        ))}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 gap-4">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white p-4 rounded-[28px] flex flex-col items-center text-center gap-3 border border-slate-50 shadow-sm relative group">
            {/* Admin Controls */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => { setEditingMember(member); setIsEditModalOpen(true); }} className="p-1.5 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 mr-1">
                 <Edit2 className="w-3 h-3"/>
               </button>
               <button onClick={() => handleDeleteMember(member.id)} className="p-1.5 bg-red-50 rounded-full text-red-500 hover:bg-red-100">
                 <Trash2 className="w-3 h-3"/>
               </button>
            </div>

            <div className="relative">
                <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-full object-cover border-4 border-slate-50 shadow-md" />
                <span className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white ${member.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`}></span>
            </div>
            <div>
                <h3 className="font-bold text-slate-900 text-base leading-tight truncate w-32">{member.name}</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wide truncate w-32">{member.role}</p>
            </div>
            
            <div className="flex gap-2 w-full mt-1">
                <button className="flex-1 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-slate-100 transition-colors">
                    <Phone className="w-4 h-4" />
                </button>
                <button className="flex-1 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-slate-100 transition-colors">
                    <Mail className="w-4 h-4" />
                </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredMembers.length === 0 && (
          <div className="text-center py-20 text-slate-400">
              <p>Belum ada data anggota.</p>
          </div>
      )}

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Anggota">
         {editingMember && (
             <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nama</label>
                    <Input value={editingMember.name} disabled className="opacity-60 cursor-not-allowed"/>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Jabatan</label>
                    <Select value={editingMember.role} onChange={e => setEditingMember({...editingMember, role: e.target.value as MemberRole})}>
                        {Object.values(MemberRole).map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </Select>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                    <Select value={editingMember.status} onChange={e => setEditingMember({...editingMember, status: e.target.value as 'active' | 'inactive'})}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </Select>
                 </div>
                 <div className="pt-2">
                    <Button className="w-full" onClick={handleUpdateRole}>Simpan Perubahan</Button>
                 </div>
             </div>
         )}
      </Modal>
    </div>
  );
};

export default Members;