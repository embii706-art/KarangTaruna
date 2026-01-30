import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Search, Phone, Mail, Trash2, Edit2 } from 'lucide-react';
import { Input, Button, Modal, Select } from '../components/UI';
import { Member, MemberRole } from '../types';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(Draggable);

const Members: React.FC = () => {
  const { t } = useTranslation();
  const [members, setMembers] = useState<Member[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  
  // Edit State
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<MemberRole | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    // 1. Listen to members collection
    const unsubscribeMembers = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
      setMembers(usersData);
    }, (error) => {
      console.error("Error fetching members:", error);
      // Fallback/Mock data if permission denied or error
      setMembers([
          { id: '1', name: 'Budi Santoso', email: 'budi@example.com', role: MemberRole.CHAIRMAN, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi', joinedAt: new Date().toISOString(), status: 'active' },
          { id: '2', name: 'Siti Aminah', email: 'siti@example.com', role: MemberRole.TREASURER, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti', joinedAt: new Date().toISOString(), status: 'active' },
          { id: '3', name: 'Rahmat Hidayat', email: 'rahmat@example.com', role: MemberRole.MEMBER, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahmat', joinedAt: new Date().toISOString(), status: 'active' },
          { id: '4', name: 'Dewi Lestari', email: 'dewi@example.com', role: MemberRole.SECRETARY, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi', joinedAt: new Date().toISOString(), status: 'inactive' },
          { id: '5', name: 'Agus Pratama', email: 'agus@example.com', role: MemberRole.MEMBER, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Agus', joinedAt: new Date().toISOString(), status: 'active' }
      ]);
    });

    // 2. Fetch current user role
    const fetchCurrentUserRole = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCurrentUserRole(docSnap.data().role as MemberRole);
        }
      }
    };
    fetchCurrentUserRole();

    return () => unsubscribeMembers();
  }, []);

  // GSAP Infinite Scroll / Drag Logic
  useLayoutEffect(() => {
    if (members.length === 0 || !cardsRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current;
      const proxy = document.createElement("div"); // Proxy for inertia/dragging logic if needed, or just drag the cards directly

      // Basic Vertical Infinite Loop Logic
      // Since real infinite loop with DOM nodes is complex to get perfect without cloning,
      // and "snapping" was requested.

      // Calculate total height
      const cardHeight = 320; // Approx height of card + gap
      // const totalHeight = cards.scrollHeight;

      Draggable.create(cards, {
        type: "y",
        bounds: { minY: -cards.scrollHeight + 500, maxY: 0 }, // Simple bounds for now
        inertia: true, // Note: Needs InertiaPlugin for momentum, will fallback if not present
        edgeResistance: 0.65,
        dragResistance: 0.4,
        snap: {
            y: (value) => Math.round(value / 100) * 100 // Snap to grid approx
        },
        onDrag: function() {
           // Custom infinite logic could go here
        }
      });

      // Entrance animation
      gsap.from(cards.children, {
        y: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out"
      });

    }, containerRef);

    return () => ctx.revert();
  }, [members, filter, search]); // Re-run when data changes

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
    if (window.confirm(t('members.delete_confirm'))) {
      try {
        await deleteDoc(doc(db, "users", id));
      } catch (error) {
        console.error("Error deleting member:", error);
      }
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = (m.name || '').toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || m.role === filter;
    return matchesSearch && matchesFilter;
  });

  // Permission Logic
  const canManageMember = (targetRole: MemberRole) => {
    if (!currentUserRole) return false;

    const allowedManagers = [
      MemberRole.SUPER_ADMIN,
      MemberRole.CHAIRMAN,
      MemberRole.VICE_CHAIRMAN
    ];
    
    if (!allowedManagers.includes(currentUserRole)) {
      return false;
    }

    // Chairman and Vice Chairman CANNOT manage Super Admin
    if (
      (currentUserRole === MemberRole.CHAIRMAN || currentUserRole === MemberRole.VICE_CHAIRMAN) &&
      targetRole === MemberRole.SUPER_ADMIN
    ) {
      return false;
    }

    return true;
  };

  // Role Options for Select
  const roleOptions = [
    MemberRole.SUPER_ADMIN,
    MemberRole.CHAIRMAN,
    MemberRole.VICE_CHAIRMAN,
    MemberRole.TREASURER,
    MemberRole.SECRETARY,
    MemberRole.MEMBER
  ];

  return (
    <div ref={containerRef} className="pt-4 px-4 space-y-6 h-[calc(100vh-100px)] flex flex-col overflow-hidden">
      <div className="flex justify-between items-end flex-shrink-0">
         <h1 className="text-2xl font-bold text-slate-900">{t('members.title')} <br/><span className="text-slate-400 font-normal text-lg">{members.length} {t('members.count')}</span></h1>
      </div>

      <div className="flex-shrink-0 space-y-4">
        <Input
            placeholder={t('members.search')}
            icon={<Search className="w-5 h-5"/>}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            <button
                onClick={() => setFilter('All')}
                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all active:scale-95 ${
                filter === 'All'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-500 border border-slate-200'
                }`}
            >
                {t('members.all')}
            </button>
            {roleOptions.map((f) => (
            <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all active:scale-95 ${
                filter === f
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-500 border border-slate-200'
                }`}
            >
                {t(`members.filter.${f}`)}
            </button>
            ))}
        </div>
      </div>

      <div className="text-center text-xs text-slate-400 flex-shrink-0">
        {t('members.drag_hint')}
      </div>

      {/* Grid Layout - Scrollable Container */}
      <div className="flex-grow relative overflow-hidden bg-slate-50/50 rounded-3xl border border-slate-100 p-2">
          <div ref={cardsRef} className="grid grid-cols-2 gap-4 pb-20 cursor-grab active:cursor-grabbing">
            {filteredMembers.map((member) => (
            <div key={member.id} className="bg-white p-4 rounded-[28px] flex flex-col items-center text-center gap-3 border border-slate-50 shadow-sm relative group">
                {/* Admin Controls */}
                {canManageMember(member.role) && (
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button onClick={() => { setEditingMember(member); setIsEditModalOpen(true); }} className="p-1.5 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 transition-all active:scale-95">
                    <Edit2 className="w-3 h-3"/>
                    </button>
                    <button onClick={() => handleDeleteMember(member.id)} className="p-1.5 bg-red-50 rounded-full text-red-500 hover:bg-red-100 transition-all active:scale-95">
                    <Trash2 className="w-3 h-3"/>
                    </button>
                </div>
                )}

                <div className="relative">
                    <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-full object-cover border-4 border-slate-50 shadow-md pointer-events-none select-none" />
                    <span className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white ${member.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 text-base leading-tight truncate w-32 select-none">{member.name}</h3>
                    <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wide truncate w-32 select-none">{t(`roles.${member.role}`)}</p>
                </div>

                <div className="flex gap-2 w-full mt-1">
                    <button className="flex-1 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-slate-100 transition-all active:scale-95">
                        <Phone className="w-4 h-4" />
                    </button>
                    <button className="flex-1 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-slate-100 transition-all active:scale-95">
                        <Mail className="w-4 h-4" />
                    </button>
                </div>
            </div>
            ))}
            
            {filteredMembers.length === 0 && (
                <div className="col-span-2 text-center py-20 text-slate-400">
                    <p>{t('members.no_data')}</p>
                </div>
            )}

            {/* Spacer for bottom scrolling */}
            <div className="col-span-2 h-20"></div>
          </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={t('members.edit')}>
         {editingMember && (
             <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t('members.name')}</label>
                    <Input value={editingMember.name} disabled className="opacity-60 cursor-not-allowed"/>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t('members.role')}</label>
                    <Select value={editingMember.role} onChange={e => setEditingMember({...editingMember, role: e.target.value as MemberRole})}>
                        {roleOptions.map(role => (
                            <option key={role} value={role}>{t(`roles.${role}`)}</option>
                        ))}
                    </Select>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t('members.status')}</label>
                    <Select value={editingMember.status} onChange={e => setEditingMember({...editingMember, status: e.target.value as 'active' | 'inactive'})}>
                        <option value="active">{t('common.active')}</option>
                        <option value="inactive">{t('common.inactive')}</option>
                    </Select>
                 </div>
                 <div className="pt-2">
                    <Button className="w-full" onClick={handleUpdateRole}>{t('members.save')}</Button>
                 </div>
             </div>
         )}
      </Modal>
    </div>
  );
};

export default Members;
