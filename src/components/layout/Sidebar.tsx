'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  FileText, 
  CalendarClock, 
  ShieldCheck, 
  HeartPulse,
  Pin,
  PinOff,
  ChevronRight,
  Home
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser, switchRole } = useClinic();
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  // If pinned is active, it stays expanded; otherwise it expands only on hover
  const isExpanded = isPinned || isHovered;

  const mainNav = [
    {
      label: 'Dashboard Klinis',
      href: '/',
      icon: LayoutDashboard,
      badge: 'Live',
    },
    {
      label: 'Direktori Pasien',
      href: '/pendaftaran',
      icon: Users,
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
    {
      label: 'Layanan Home Care',
      href: '/homecare',
      icon: Home,
      badge: 'Shift & Diet',
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
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`h-screen sticky top-0 bg-white text-slate-700 flex flex-col shrink-0 border-r border-slate-200 transition-[width,box-shadow] duration-300 ease-in-out z-40 select-none overflow-hidden ${
        isExpanded ? 'w-64 shadow-xl' : 'w-20 shadow-xs'
      }`}
    >
      {/* Brand Header with Authentic Logo */}
      <div className={`h-16 border-b border-slate-100 flex items-center px-4 transition-all duration-300 ${
        isExpanded ? 'justify-between' : 'justify-center'
      }`}>
        <div className="flex items-center gap-2.5 overflow-hidden">
          <img
            src="/logo.png"
            alt="Rumah Luka Borneo"
            className={`object-contain transition-all duration-300 ${
              isExpanded ? 'h-10 w-auto max-w-[170px]' : 'h-8 w-auto max-w-[48px]'
            }`}
          />
        </div>

        {/* Pin / Lock Toggle (only visible when expanded) */}
        {isExpanded && (
          <button
            type="button"
            onClick={() => setIsPinned(!isPinned)}
            title={isPinned ? 'Lepas Kunci (Auto-collapse saat mouse keluar)' : 'Kunci Sidebar (Tetap terbuka)'}
            className={`p-1.5 rounded-md text-xs transition ${
              isPinned
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            {isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Nav Section */}
      <div className="flex-1 p-2.5 space-y-5 overflow-y-auto overflow-x-hidden">
        {/* Main Section */}
        <div>
          <div
            className={`px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 transition-all duration-300 ${
              isExpanded ? 'opacity-100 h-5 pb-2' : 'opacity-0 h-0 overflow-hidden'
            }`}
          >
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
                  title={!isExpanded ? item.label : undefined}
                  className={`flex items-center rounded-lg text-xs font-semibold transition-all relative ${
                    isExpanded ? 'px-3 py-2.5' : 'w-11 h-11 mx-auto justify-center p-0'
                  } ${
                    isActive
                      ? 'bg-blue-50 text-blue-900 border border-blue-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                  <span
                    className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                      isExpanded
                        ? 'opacity-100 max-w-[140px] ml-3 flex-1'
                        : 'opacity-0 max-w-0 ml-0 pointer-events-none'
                    }`}
                  >
                    {item.label}
                  </span>
                  {isExpanded && item.badge && !isActive && (
                    <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono font-medium shrink-0 ml-auto">
                      {item.badge}
                    </span>
                  )}
                  {isExpanded && isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-auto" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Secondary Section */}
        <div>
          <div
            className={`px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 transition-all duration-300 ${
              isExpanded ? 'opacity-100 h-5 pb-2' : 'opacity-0 h-0 overflow-hidden'
            }`}
          >
            Operasional
          </div>
          <nav className="space-y-1">
            {secondaryNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={!isExpanded ? item.label : undefined}
                  className={`flex items-center rounded-lg text-xs font-semibold transition-all ${
                    isExpanded ? 'px-3 py-2.5' : 'w-11 h-11 mx-auto justify-center p-0'
                  } ${
                    isActive
                      ? 'bg-blue-50 text-blue-900 border border-blue-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                  <span
                    className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                      isExpanded
                        ? 'opacity-100 max-w-[150px] ml-3 flex-1'
                        : 'opacity-0 max-w-0 ml-0 pointer-events-none'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Role Switcher Box (Adaptive Mini & Expanded) */}
      <div className={`border-t border-slate-200 bg-slate-50/80 transition-all duration-300 ${
        isExpanded ? 'p-4' : 'p-3 flex flex-col items-center'
      }`}>
        {!isExpanded ? (
          <div
            title={`Pengguna: ${currentUser.nama} (${currentUser.role})\nArahkan kursor ke sini untuk membuka menu lengkap`}
            className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center justify-center font-bold text-xs font-mono cursor-pointer"
          >
            {currentUser.role.charAt(0)}
          </div>
        ) : (
          <div className="w-full">
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

            {/* Quick role toggle buttons */}
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
        )}
      </div>
    </aside>
  );
}
