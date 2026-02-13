import React, { useState } from 'react';
import { useTheme } from '../services/themeService';
import { Moon, Star } from 'lucide-react';
import { Season } from '../types';

const RamadanWidget: React.FC = () => {
  const { season } = useTheme();

  if (season !== Season.RAMADAN) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-4 text-white relative overflow-hidden shadow-lg mb-6">
      <div className="relative z-10 flex items-center justify-between">
        <div>
            <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                <Moon className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                Ramadan Kareem
            </h3>
            <p className="text-emerald-100 text-xs">Jadwal Imsakiyah Hari Ini</p>
            <div className="mt-3 flex gap-4 text-center">
                <div>
                    <span className="block text-xs text-emerald-200">Imsak</span>
                    <span className="block font-bold">04:15</span>
                </div>
                <div>
                    <span className="block text-xs text-emerald-200">Maghrib</span>
                    <span className="block font-bold">17:55</span>
                </div>
            </div>
        </div>
        <Star className="w-16 h-16 text-yellow-300 opacity-20 absolute -right-2 -bottom-4 animate-pulse" />
      </div>

      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
    </div>
  );
};

export default RamadanWidget;