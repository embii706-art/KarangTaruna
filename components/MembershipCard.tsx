import React from 'react';
import { QrCode, ShieldCheck } from 'lucide-react';
import { Member } from '../types';

interface MembershipCardProps {
  user: any; // Using any for flexibility with Firebase user object, or Member type
}

const MembershipCard: React.FC<MembershipCardProps> = ({ user }) => {
  return (
    <div className="relative w-full aspect-[1.586] bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 rounded-3xl overflow-hidden shadow-2xl p-6 text-white flex flex-col justify-between border border-white/10 select-none">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl -ml-16 -mb-16"></div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-start">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                <ShieldCheck className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
                <h3 className="font-bold text-lg leading-none tracking-wide">KARTEJI</h3>
                <p className="text-[10px] text-indigo-200 uppercase tracking-widest">Member Card</p>
            </div>
        </div>
        <img src="/logo.svg" alt="Logo" className="w-8 h-8 opacity-80" />
      </div>

      {/* User Info */}
      <div className="relative z-10 flex gap-4 items-end">
        <div className="w-20 h-20 rounded-xl bg-slate-800 border-2 border-white/30 overflow-hidden shadow-lg">
             {user.photoURL ? (
                 <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
             ) : (
                 <div className="w-full h-full flex items-center justify-center text-2xl font-bold bg-slate-700">
                     {user.displayName?.charAt(0) || 'U'}
                 </div>
             )}
        </div>
        <div className="flex-1">
            <p className="text-[10px] text-indigo-300 uppercase font-bold mb-0.5">Nama Anggota</p>
            <h2 className="font-bold text-xl truncate">{user.displayName}</h2>
            <p className="text-xs text-indigo-200 mt-1">{user.email}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex justify-between items-end mt-4">
        <div>
            <p className="text-[10px] text-indigo-300 uppercase font-bold">Status</p>
            <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-sm font-semibold">Active Member</span>
            </div>
        </div>
        <div className="bg-white p-1 rounded-lg">
            <QrCode className="w-10 h-10 text-slate-900" />
        </div>
      </div>
    </div>
  );
};

export default MembershipCard;