'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CalendarDays, 
  UserPlus, 
  Bandage, 
  FileText, 
  Users, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser, switchRole } = useClinic();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
    },
    {
      label: 'Pendaftaran Pasien',
      href: '/pendaftaran',
      icon: UserPlus,
    },
    {
      label: 'Asesmen Wound Care',
      href: '/asesmen',
      icon: Bandage,
    },
    {
      label: 'Rekam Medis (CPPT)',
      href: '/rekam-medis',
      icon: FileText,
    },
    {
      label: 'Jadwal Perawatan',
      href: '/jadwal',
      icon: CalendarDays,
    },
    {
      label: 'Kelola Pengguna',
      href: '/kelola-pengguna',
      icon: Users,
    },
  ];

  return (
    <aside className="w-64 bg-[#1e3b7b] text-white flex flex-col shrink-0 min-h-screen border-r border-[#162e60] select-none">
      {/* Brand & Logo */}
      <div className="p-5 border-b border-white/10 flex flex-col items-center gap-3">
        <div className="bg-white p-2 rounded-lg shadow-sm w-full flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Rumah Luka Borneo Logo"
            width={180}
            height={52}
            className="h-10 w-auto object-contain"
            priority
          />
        </div>
        <div className="text-center w-full">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-200">
            Sistem Rekam Medis (ERM)
          </h2>
          <p className="text-[11px] text-blue-300/80 font-medium">Rumah Luka Borneo</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto" aria-label="Menu Utama">
        <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-blue-300/70">
          Pelayanan Klinis
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white text-[#1e3b7b] shadow-sm font-semibold'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#224b9b]' : 'text-blue-200'}`} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 text-[#224b9b]" />}
            </Link>
          );
        })}
      </nav>

      {/* Current User & Role Switcher */}
      <div className="p-4 border-t border-white/10 bg-[#162e60]/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-200">
            Akses Login Saat Ini
          </span>
          <span className="text-[10px] bg-blue-500/20 text-blue-200 px-2 py-0.5 rounded border border-blue-400/30">
            {currentUser.role}
          </span>
        </div>

        <p className="text-xs font-medium text-white truncate" title={currentUser.nama}>
          {currentUser.nama}
        </p>
        {currentUser.strNip && (
          <p className="text-[10px] text-blue-300/80 truncate">NIP/STR: {currentUser.strNip}</p>
        )}

        {/* Quick Role Switch for clinical demo */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <label className="text-[10px] text-blue-300 block mb-1 font-medium">Ganti Peran (Simulasi):</label>
          <div className="grid grid-cols-3 gap-1">
            {(['Admin', 'Perawat', 'Dokter'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => switchRole(r)}
                className={`text-[11px] py-1 px-1.5 rounded text-center transition-colors font-medium ${
                  currentUser.role === r
                    ? 'bg-blue-500 text-white font-semibold'
                    : 'bg-white/10 text-blue-200 hover:bg-white/20'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
