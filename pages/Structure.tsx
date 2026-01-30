import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { ArrowLeft, Network, Phone, Mail, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Member, MemberRole } from '../types';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(Draggable);

const Structure: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [members, setMembers] = useState<Member[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch all users
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));

      // Sort by Hierarchy
      const roleOrder: { [key: string]: number } = {
        [MemberRole.SUPER_ADMIN]: 1,
        [MemberRole.CHAIRMAN]: 2,
        [MemberRole.VICE_CHAIRMAN]: 3,
        [MemberRole.SECRETARY]: 4,
        [MemberRole.TREASURER]: 5,
        [MemberRole.MEMBER]: 6
      };

      const sorted = data.sort((a, b) => {
        const roleA = roleOrder[a.role] || 99;
        const roleB = roleOrder[b.role] || 99;
        return roleA - roleB;
      });

      setMembers(sorted);
    });

    return () => unsubscribe();
  }, []);

  useLayoutEffect(() => {
    if (members.length === 0 || !cardsRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current;
      const cardElements = gsap.utils.toArray('.structure-card');
      const cardHeight = 400; // Estimate card height + margin

      // Initial Animation
      gsap.from(cardElements, {
        y: 800,
        opacity: 0,
        rotation: 10,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out"
      });

      // Draggable Logic
      Draggable.create(cards, {
        type: "y",
        bounds: { minY: -cards.scrollHeight + window.innerHeight - 100, maxY: 0 },
        inertia: true,
        edgeResistance: 0.7,
        dragResistance: 0.4,
        snap: {
            y: (value) => Math.round(value / 100) * 100 // Soft snap
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, [members]);

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-6 pb-2 flex items-center gap-4 sticky top-0 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-sm z-20">
        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-all active:scale-95">
          <ArrowLeft className="w-6 h-6 text-slate-900 dark:text-white" />
        </button>
        <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Network className="w-5 h-5"/> Struktur Organisasi
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Geser untuk melihat struktur</p>
        </div>
      </div>

      {/* 3D Perspective Container */}
      <div className="flex-grow relative px-4 perspective-1000">
        <div ref={cardsRef} className="pb-32 pt-4 space-y-6">
            {members.map((member, index) => (
                <div
                    key={member.id}
                    className="structure-card bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-xl border border-slate-100 dark:border-slate-800 relative overflow-hidden group transform transition-transform hover:scale-[1.02]"
                >
                    {/* Decorative Background */}
                    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-10 -mt-10 blur-2xl opacity-20 ${
                        member.role === MemberRole.CHAIRMAN ? 'bg-red-500' :
                        member.role === MemberRole.VICE_CHAIRMAN ? 'bg-blue-500' :
                        member.role === MemberRole.SUPER_ADMIN ? 'bg-purple-500' : 'bg-slate-400'
                    }`}></div>

                    <div className="flex flex-col items-center text-center relative z-10">
                        <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 mb-4 shadow-inner">
                            <img
                                src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}`}
                                alt={member.name}
                                className="w-full h-full rounded-full object-cover border-4 border-white dark:border-slate-900 shadow-sm"
                            />
                        </div>

                        <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
                             member.role === MemberRole.CHAIRMAN ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                             member.role === MemberRole.VICE_CHAIRMAN ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                             member.role === MemberRole.SUPER_ADMIN ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                             'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                            {t(`roles.${member.role}`)}
                        </div>

                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{member.name}</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Anggota Aktif</p>

                        <div className="flex gap-3 w-full max-w-xs">
                            <button className="flex-1 bg-slate-50 dark:bg-slate-800 py-3 rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors active:scale-95">
                                <Phone className="w-5 h-5"/>
                            </button>
                            <button className="flex-1 bg-slate-50 dark:bg-slate-800 py-3 rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors active:scale-95">
                                <Mail className="w-5 h-5"/>
                            </button>
                            <button className="flex-1 bg-slate-50 dark:bg-slate-800 py-3 rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors active:scale-95">
                                <User className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Structure;
