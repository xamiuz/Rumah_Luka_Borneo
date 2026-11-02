'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Search, 
  UserPlus, 
  Building2, 
  Clock, 
  RotateCcw
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';

export function TopNavbar() {
  const { searchTerm, setSearchTerm, currentUser, resetAllData } = useClinic();

  const handleReset = () => {
    if (window.confirm('Reset ulang data sample klinik untuk demonstrasi?')) {
      resetAllData();
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Branch & Shift Badge */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-slate-800">
          <Building2 className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold tracking-tight">Klinik Utama Bontang</span>
          <span className="text-slate-300">|</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Shift Pelayanan Aktif (Pagi)</span>
        </div>
      </div>

      {/* Global Search & Quick Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative w-64 md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari pasien (Nama, No. RM, NIK)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-12 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800 transition placeholder:text-slate-400"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 pointer-events-none">
            /
          </kbd>
        </div>

        {/* Reset sample */}
        <button
          type="button"
          onClick={handleReset}
          title="Reset ke data awal"
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-transparent hover:border-slate-200 transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Staff Profile Capsule (Clean Light Blue theme) */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center justify-center text-xs font-bold font-mono">
            {currentUser.nama.charAt(currentUser.nama.startsWith('Ns.') || currentUser.nama.startsWith('dr.') ? 4 : 0)}
          </div>
          <div className="hidden lg:block text-left text-xs">
            <p className="font-bold text-slate-900 leading-none truncate max-w-[130px]">
              {currentUser.nama}
            </p>
            <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
              <span className="text-blue-700 font-bold">{currentUser.role}</span>
              {currentUser.strNip && <span>• {currentUser.strNip.split(' ')[0]}</span>}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
