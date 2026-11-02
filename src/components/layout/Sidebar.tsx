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
  Stethoscope,
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
    <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
          <HeartPulse className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-bold text-white tracking-tight leading-none truncate">
            RUMAH LUKA
          </h1>
          <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase mt-1 truncate">
            Clinical Wound Care System
          </p>
        </div>
      </div>

      {/* Nav Section */}
      <div className="flex-1 p-3 space-y-6 overflow-y-auto">
        {/* Main Section */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
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
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && !isActive && (
                    <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono font-medium">
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Secondary Section */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
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
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="flex-1 truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Role Switcher Box (Clinical Simulation) */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Hak Akses Login
          </span>
          <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-300 font-mono font-semibold rounded border border-blue-500/30">
            {currentUser.role}
          </span>
        </div>
        <div className="text-xs font-semibold text-white truncate" title={currentUser.nama}>
          {currentUser.nama}
        </div>
        <div className="text-[10px] text-slate-400 truncate mt-0.5">
          {currentUser.strNip ? `NIP/STR: ${currentUser.strNip}` : 'Staf Administrator'}
        </div>

        {/* Role toggle buttons */}
        <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-3 gap-1">
          {(['Perawat', 'Dokter', 'Admin'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => switchRole(r)}
              className={`text-[10px] py-1 px-1 rounded font-medium text-center transition ${
                currentUser.role === r
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
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
