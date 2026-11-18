'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Home,
  LogOut,
  KeyRound,
  UserCog
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import { useDialog } from '@/context/DialogContext';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, switchRole, logout } = useClinic();
  const { showConfirm } = useDialog();
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

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

  // If pinned is active, it stays expanded; otherwise it expands only on hover
  const isExpanded = isPinned || isHovered;

  const mainNav = [
    {
      label: 'Dashboard Klinis',
      href: '/',
      icon: LayoutDashboard,
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
    },
  ];

  const secondaryNav = [
    {
      label: 'Jadwal Kontrol & Antrean',
      href: '/jadwal',
      icon: CalendarClock,
    },
    ...(currentUser.role === 'Admin'
      ? [
          {
            label: 'Manajemen Staf & Hak Akses',
            href: '/kelola-pengguna',
            icon: ShieldCheck,
          },
        ]
      : [
          {
            label: 'Profil Akun Saya',
            href: '/kelola-pengguna',
            icon: ShieldCheck,
          },
        ]),
  ];

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`hidden md:flex h-screen sticky top-0 bg-white text-slate-700 flex-col shrink-0 border-r border-slate-200 transition-[width,box-shadow] duration-300 ease-in-out z-40 select-none overflow-hidden ${
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
                  className={`flex items-center rounded-xl text-xs font-semibold transition-all relative ${
                    isExpanded ? 'px-3 py-2.5' : 'w-11 h-11 mx-auto justify-center p-0'
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 via-blue-50/60 to-white text-blue-900 border-l-[3.5px] border-l-blue-600 border-y border-r border-slate-200/70 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span
                    className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                      isExpanded
                        ? 'opacity-100 max-w-[140px] ml-3 flex-1 font-bold'
                        : 'opacity-0 max-w-0 ml-0 pointer-events-none'
                    }`}
                  >
                    {item.label}
                  </span>
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
                  className={`flex items-center rounded-xl text-xs font-semibold transition-all relative ${
                    isExpanded ? 'px-3 py-2.5' : 'w-11 h-11 mx-auto justify-center p-0'
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 via-blue-50/60 to-white text-blue-900 border-l-[3.5px] border-l-blue-600 border-y border-r border-slate-200/70 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span
                    className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                      isExpanded
                        ? 'opacity-100 max-w-[150px] ml-3 flex-1 font-bold'
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

      {/* Bottom User Profile & Logout (Adaptive Mini & Expanded) */}
      <div className={`border-t border-slate-200 bg-slate-50/80 transition-all duration-300 ${
        isExpanded ? 'p-4' : 'p-3 flex flex-col items-center gap-2'
      }`}>
        {!isExpanded ? (
          <>
            <div
              title={`Pengguna: ${currentUser.nama} (${currentUser.role})\nArahkan kursor untuk membuka menu`}
              className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center justify-center font-bold text-xs font-mono cursor-pointer"
            >
              {currentUser.role.charAt(0)}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Keluar / Logout"
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="w-full">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Sesi Petugas
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

            {/* Bottom Actions: Account Management & Logout */}
            <div className="mt-3 pt-3 border-t border-slate-200 space-y-1.5">
              <Link
                href="/kelola-pengguna"
                className="w-full py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-medium rounded-lg border border-slate-200 flex items-center gap-2 transition"
              >
                <UserCog className="w-3.5 h-3.5 text-blue-600" />
                <span className="truncate">Kelola Akun & Sandi</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-semibold rounded-lg border border-rose-200 flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span>Keluar / Logout</span>
                </div>
                <span className="text-[10px] text-rose-500">Keluar</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
