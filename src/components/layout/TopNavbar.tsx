'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  UserPlus, 
  Building2, 
  Clock, 
  RotateCcw,
  Database,
  ChevronDown,
  UserCheck,
  Check,
  UserCog
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';

export function TopNavbar() {
  const { searchTerm, setSearchTerm, currentUser, switchUser, users, resetAllData, dbStatus } = useClinic();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleReset = () => {
    if (window.confirm('Reset ulang data sample klinik untuk demonstrasi?')) {
      resetAllData();
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Branch & Shift Badge */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 text-slate-800">
          <img src="/logo.png" alt="Rumah Luka Borneo" className="h-9 w-auto object-contain" />
          <span className="text-slate-300">|</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Shift Pelayanan Aktif (Pagi)</span>
        </div>

        {/* Database Status Indicator */}
        <div
          title={
            dbStatus === 'connected'
              ? 'Terhubung langsung ke Database MySQL'
              : 'MySQL belum aktif — aplikasi otomatis berjalan menggunakan penyimpanan lokal/localStorage'
          }
          className={`hidden md:flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md border transition ${
            dbStatus === 'connected'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          <Database className="w-3 h-3" />
          <span>{dbStatus === 'connected' ? 'MySQL: Terhubung' : 'MySQL: Offline (Mode Lokal)'}</span>
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

        {/* Staff Profile Capsule & Account Switcher Dropdown */}
        <div className="relative pl-3 border-l border-slate-200" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer text-left select-none group"
            title="Klik untuk beralih akun / peran petugas"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center justify-center text-xs font-bold font-mono shrink-0 group-hover:ring-2 group-hover:ring-blue-300 transition">
              {currentUser.nama.charAt(currentUser.nama.startsWith('Ns.') || currentUser.nama.startsWith('dr.') ? 4 : 0)}
            </div>
            <div className="hidden sm:block text-left text-xs">
              <div className="flex items-center gap-1">
                <p className="font-bold text-slate-900 leading-none whitespace-nowrap">
                  {currentUser.nama}
                </p>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1.5 font-medium whitespace-nowrap">
                <span className={`font-bold ${
                  currentUser.role === 'Admin' ? 'text-purple-700' : currentUser.role === 'Dokter' ? 'text-rose-700' : 'text-blue-700'
                }`}>
                  {currentUser.role}
                </span>
                {currentUser.strNip && <span>• NIP/STR: {currentUser.strNip}</span>}
              </p>
            </div>
          </button>

          {/* Interactive Account Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Pilih Akun Petugas Aktif:
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Klik untuk langsung berganti sesi kerja klinis
                </p>
              </div>

              <div className="max-h-64 overflow-y-auto py-1 divide-y divide-slate-50">
                {users.map((u) => {
                  const isActive = currentUser.id === u.id || currentUser.username === u.username;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        switchUser(u);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-3.5 py-2.5 text-left text-xs flex items-center justify-between gap-2 hover:bg-slate-50 transition cursor-pointer ${
                        isActive ? 'bg-blue-50/70 font-semibold text-blue-900' : 'text-slate-700'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-bold truncate text-slate-900 text-xs">
                          {u.nama}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span className={`px-1.5 py-0.2 rounded font-bold ${
                            u.role === 'Admin'
                              ? 'bg-purple-100 text-purple-800'
                              : u.role === 'Dokter'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {u.role}
                          </span>
                          <span className="truncate">{u.strNip || u.username}</span>
                        </div>
                      </div>

                      {isActive && (
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="p-2 border-t border-slate-100 bg-slate-50/60 rounded-b-xl">
                <Link
                  href="/kelola-pengguna"
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-[11px] rounded-lg border border-slate-200 transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <UserCog className="w-3.5 h-3.5 text-blue-600" />
                  <span>Kelola Semua Tenaga Medis</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
