'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  UserCog,
  LogOut,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import { useDialog } from '@/context/DialogContext';

export function TopNavbar() {
  const router = useRouter();
  const { searchTerm, setSearchTerm, currentUser, switchUser, users, resetAllData, logout } = useClinic();
  const { showConfirm } = useDialog();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Live real-time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' WITA'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const handleReset = async () => {
    const confirmed = await showConfirm(
      'Reset ulang data sample klinik untuk demonstrasi? Seluruh data baru akan dikembalikan ke kondisi awal.',
      'Reset Data Klinik',
      { type: 'warning', confirmLabel: 'Ya, Reset Data' }
    );
    if (confirmed) {
      resetAllData();
    }
  };

  const handleLogout = async () => {
    const confirmed = await showConfirm(
      `Apakah Anda yakin ingin keluar dari sesi akun ${currentUser.nama}?`,
      'Konfirmasi Logout',
      { type: 'danger', confirmLabel: 'Ya, Keluar' }
    );
    if (confirmed) {
      logout();
      router.push('/login');
    }
  };

  return (
    <header className="h-14 sm:h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Branch & Shift Badge */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2 text-slate-800">
          <img src="/logo.png" alt="Rumah Luka Borneo" className="h-7 sm:h-9 w-auto object-contain" />
          <span className="hidden sm:inline text-slate-300">|</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Shift Pagi</span>
          {currentTime && (
            <>
              <span className="text-slate-300">|</span>
              <span className="font-mono text-slate-800 font-bold">{currentTime}</span>
            </>
          )}
        </div>
      </div>

      {/* Global Search & Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Input (Visible on sm and up) */}
        <div className="relative hidden sm:block sm:w-52 md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari pasien (Nama, No. RM, NIK)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-10 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800 transition placeholder:text-slate-400"
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
          className="hidden sm:flex p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-transparent hover:border-slate-200 transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Staff Profile Capsule & Account Switcher Dropdown */}
        <div className="relative pl-2 sm:pl-3 border-l border-slate-200" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 sm:gap-2.5 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer text-left select-none group"
            title="Klik untuk beralih akun / peran petugas"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white border border-blue-700 flex items-center justify-center text-xs font-bold font-mono shrink-0 shadow-2xs group-hover:ring-2 group-hover:ring-blue-300 transition">
                {currentUser.nama.charAt(currentUser.nama.startsWith('Ns.') || currentUser.nama.startsWith('dr.') ? 4 : 0)}
              </div>
              <span className="sm:hidden text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                {currentUser.role}
              </span>
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

          {/* User Profile Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">{currentUser.nama}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    currentUser.role === 'Admin' ? 'bg-purple-100 text-purple-800' : currentUser.role === 'Dokter' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {currentUser.role}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">@{currentUser.username}</span>
                </div>
              </div>

              <div className="p-2 space-y-1">
                <Link
                  href="/kelola-pengguna"
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-lg transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <UserCog className="w-3.5 h-3.5 text-blue-600" />
                    <span>{currentUser.role === 'Admin' ? 'Manajemen Staf & Hak Akses' : 'Profil & Ganti Sandi'}</span>
                  </div>
                  <KeyRound className="w-3 h-3 text-slate-400" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    handleLogout();
                  }}
                  className="w-full px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-lg transition flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <LogOut className="w-3.5 h-3.5 text-rose-600" />
                    <span>Keluar / Logout</span>
                  </div>
                  <span className="text-[10px] text-rose-500">Sesi</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
