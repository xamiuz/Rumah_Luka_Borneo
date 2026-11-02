'use client';

import React from 'react';
import { Search, RotateCcw, ShieldCheck, UserCheck } from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { searchTerm, setSearchTerm, currentUser, resetAllData } = useClinic();
  const [formattedDate, setFormattedDate] = React.useState<string>('Pelayanan Hari Ini');

  React.useEffect(() => {
    try {
      const today = new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date());
      setFormattedDate(today);
    } catch {
      // fallback
    }
  }, []);

  const handleReset = () => {
    if (window.confirm('Reset data ke kondisi awal (sample data)? Data baru yang diinput akan dikembalikan.')) {
      resetAllData();
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-0 z-30 shadow-xs">
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h1>
        {subtitle ? (
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        ) : (
          <p className="text-xs text-slate-500 mt-0.5">{formattedDate} | Shift Pelayanan Aktif</p>
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Search bar */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari Pasien (Nama, No. RM, NIK)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b] focus:bg-white text-slate-700 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Reset button */}
        <button
          onClick={handleReset}
          title="Reset ke data awal"
          type="button"
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Sample</span>
        </button>

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-[#224b9b] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
            {currentUser.nama.charAt(currentUser.nama.startsWith('Ns.') || currentUser.nama.startsWith('dr.') ? 4 : 0)}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[150px]">
              {currentUser.nama}
            </p>
            <p className="text-[10px] text-slate-500 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-emerald-600" />
              <span>{currentUser.role}</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
