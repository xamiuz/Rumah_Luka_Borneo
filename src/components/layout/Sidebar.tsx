'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  UserPlus, 
  Activity, 
  FileText, 
  CalendarClock, 
  ShieldCheck, 
  HeartPulse,
  ChevronRight
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser, switchRole } = useClinic();

  const mainNav = [
    {
      label: 'Dashboard Klinis',
      href: '/',
      icon: LayoutDashboard,
      badge: 'Live',
    },
    {
      label: 'Pendaftaran Pasien',
      href: '/pendaftaran',
      icon: UserPlus,
    },
    {
      label: 'Asesmen & Peta Luka',
      href: '/asesmen',
      icon: Activity,
    },
    {
      label: 'Rekam Medis (CPPT)',
      href: '/rekam-medis',
      icon: FileText,
    },
  ];

  const secondaryNav = [
    {
      label: 'Jadwal Kontrol & Antrean',
      href: '/jadwal',
      icon: CalendarClock,
    },
    {
      label: 'Manajemen Pengguna',
      href: '/kelola-pengguna',
      icon: ShieldCheck,
    },
  ];

  return (
    <aside className="w-64 bg-white text-slate-700 flex flex-col shrink-0 min-h-screen border-r border-slate-200 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
          <HeartPulse className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none truncate">
            RUMAH LUKA
          </h1>
          <p className="text-[10px] text-blue-700 font-semibold tracking-wide uppercase mt-1 truncate">
            Clinical Wound Care System
          </p>
        </div>
      </div>

      {/* Nav Section */}
      <div className="flex-1 p-3 space-y-6 overflow-y-auto">
        {/* Main Section */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Pelayanan Klinis
          </div>
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-blue-50 text-blue-900 border border-blue-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && !isActive && (
                    <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono font-medium">
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-600" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Secondary Section */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Operasional & Administrasi
          </div>
          <nav className="space-y-1">
            {secondaryNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-900 border border-blue-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                  <span className="flex-1 truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Role Switcher Box (Light Medical Aesthetic) */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/70">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
            Hak Akses Login
          </span>
          <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-800 font-mono font-bold rounded border border-blue-200">
            {currentUser.role}
          </span>
        </div>
        <div className="text-xs font-bold text-slate-900 truncate" title={currentUser.nama}>
          {currentUser.nama}
        </div>
        <div className="text-[10px] text-slate-500 truncate mt-0.5">
          {currentUser.strNip ? `NIP/STR: ${currentUser.strNip}` : 'Staf Administrator'}
        </div>

        {/* Role toggle buttons */}
        <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-3 gap-1">
          {(['Perawat', 'Dokter', 'Admin'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => switchRole(r)}
              className={`text-[10px] py-1.5 px-1 rounded-md font-semibold text-center transition ${
                currentUser.role === r
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
