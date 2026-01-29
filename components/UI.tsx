import React from 'react';
import { X } from 'lucide-react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' }> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "px-6 py-3.5 rounded-full font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200",
    secondary: "bg-gray-100 text-slate-900 hover:bg-gray-200",
    outline: "border border-slate-200 text-slate-900 hover:bg-slate-50",
    ghost: "text-slate-500 hover:text-slate-900 bg-transparent p-2",
    danger: "bg-red-50 text-red-600 hover:bg-red-100"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-3xl p-5 shadow-sm border border-slate-50 ${className}`}>
    {children}
  </div>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode }> = ({ icon, className = '', ...props }) => (
  <div className="relative w-full group">
    {icon && (
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
        {icon}
      </div>
    )}
    <input 
      className={`w-full bg-slate-50 text-slate-900 rounded-2xl py-4 ${icon ? 'pl-12' : 'pl-4'} pr-4 outline-none focus:ring-2 focus:ring-slate-900/10 transition-all font-medium placeholder:text-slate-400 ${className}`}
      {...props}
    />
  </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { icon?: React.ReactNode }> = ({ icon, className = '', children, ...props }) => (
  <div className="relative w-full group">
    {icon && (
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
        {icon}
      </div>
    )}
    <select 
      className={`w-full bg-slate-50 text-slate-900 rounded-2xl py-4 ${icon ? 'pl-12' : 'pl-4'} pr-8 outline-none focus:ring-2 focus:ring-slate-900/10 transition-all font-medium appearance-none cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </select>
  </div>
);

export const SectionHeader: React.FC<{ title: string; action?: React.ReactNode }> = ({ title, action }) => (
  <div className="flex items-center justify-between mb-4 px-1">
    <h2 className="text-xl font-bold text-slate-900">{title}</h2>
    {action && <div className="text-sm font-semibold text-slate-500 hover:text-slate-900 cursor-pointer">{action}</div>}
  </div>
);

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-[32px] p-6 shadow-2xl animate-slide-up relative">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};