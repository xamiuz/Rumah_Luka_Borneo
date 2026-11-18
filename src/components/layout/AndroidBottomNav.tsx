'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  FileText, 
  Menu, 
  X, 
  Home, 
  CalendarClock, 
  ShieldCheck, 
  LogOut, 
  RotateCcw,
  UserCheck,
  ChevronRight,
  Shield
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import { useDialog } from '@/context/DialogContext';

export function AndroidBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, switchRole, logout, resetAllData } = useClinic();
  const { showConfirm } = useDialog();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navItems = [
    {
      label: 'Beranda',
      href: '/',
      icon: LayoutDashboard,
    },
    {
      label: 'Pasien',
      href: '/pendaftaran',
      icon: Users,
    },
    {
      label: 'Asesmen',
      href: '/asesmen',
      icon: Activity,
    },
    {
      label: 'CPPT',
      href: '/rekam-medis',
      icon: FileText,
    },
  ];

  const handleLogout = async () => {
    setIsDrawerOpen(false);
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

  const handleReset = async () => {
    setIsDrawerOpen(false);
    const confirmed = await showConfirm(
      'Reset data sample klinik untuk demonstrasi?',
      'Reset Data',
      { type: 'warning', confirmLabel: 'Ya, Reset Data' }
    );
    if (confirmed) {
      resetAllData();
    }
  };

  return (
    <>
      {/* 1. NATIVE ANDROID BOTTOM NAVIGATION BAR (md:hidden) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1 flex items-center justify-around select-none">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center py-1 transition-transform active:scale-95"
            >
              <div
                className={`px-4 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight ${
                  isActive ? 'font-bold text-blue-700' : 'font-medium text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* 5th Button: Android Drawer Trigger */}
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="flex-1 flex flex-col items-center justify-center py-1 transition-transform active:scale-95"
        >
          <div
            className={`px-4 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
              isDrawerOpen
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Menu className="w-4 h-4" />
          </div>
          <span
            className={`text-[10px] mt-0.5 tracking-tight ${
              isDrawerOpen ? 'font-bold text-blue-700' : 'font-medium text-slate-500'
            }`}
          >
            Menu
          </span>
        </button>
      </nav>

      {/* 2. ANDROID MATERIAL BOTTOM SHEET / DRAWER (SLIDE OVER) */}
      {isDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Sheet Surface */}
          <div className="relative bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto shadow-2xl border-t border-slate-200 p-5 space-y-4 animate-in slide-in-from-bottom duration-200 z-10">
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto -mt-1 mb-2" />

            {/* Header with User Info */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-base font-mono shadow-xs">
                  {currentUser.nama.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{currentUser.nama}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                      {currentUser.role}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {currentUser.strNip ? `STR: ${currentUser.strNip}` : currentUser.username}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role Switcher Pill (Quick for Demo) */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Mode Akun Aktif:</span>
                <span className="font-bold text-blue-700">{currentUser.role}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    switchRole('Perawat');
                    setIsDrawerOpen(false);
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition ${
                    currentUser.role === 'Perawat'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  Mode Perawat
                </button>
                <button
                  type="button"
                  onClick={() => {
                    switchRole('Admin');
                    setIsDrawerOpen(false);
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition ${
                    currentUser.role === 'Admin'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  Mode Admin
                </button>
              </div>
            </div>

            {/* Menu Links */}
            <div className="space-y-1 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                Layanan & Fitur Lainnya:
              </span>

              <Link
                href="/homecare"
                onClick={() => setIsDrawerOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 transition border border-transparent hover:border-blue-200 font-semibold text-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold">Layanan Home Care Terpadu</div>
                    <p className="text-[10px] text-slate-400 font-normal">Shift jaga, diet makan, obat & paraf digital</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/jadwal"
                onClick={() => setIsDrawerOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 transition border border-transparent hover:border-blue-200 font-semibold text-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                    <CalendarClock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold">Jadwal Kontrol & Antrean</div>
                    <p className="text-[10px] text-slate-400 font-normal">Antrean poli klinik & reminder ganti balutan</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/kelola-pengguna"
                onClick={() => setIsDrawerOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 transition border border-transparent hover:border-blue-200 font-semibold text-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold">
                      {currentUser.role === 'Admin' ? 'Manajemen Staf & Hak Akses' : 'Profil Akun & Sandi'}
                    </div>
                    <p className="text-[10px] text-slate-400 font-normal">Ganti password & konfigurasi akun</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset Demo</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold flex items-center gap-1.5 transition border border-rose-200"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar Akun</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
