'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useClinic } from '@/context/ClinicContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { Loader2 } from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useClinic();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoginPage = pathname === '/login';

  useEffect(() => {
    if (!mounted) return;

    if (!isAuthenticated && !isLoginPage) {
      router.replace('/login');
    } else if (isAuthenticated && isLoginPage) {
      router.replace('/');
    }
  }, [mounted, isAuthenticated, isLoginPage, router]);

  // Loading indicator on initial hydration to avoid layout flashes
  if (!mounted) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-xs font-medium text-slate-600">Memuat Sistem Rumah Luka Borneo...</p>
        </div>
      </div>
    );
  }

  // 1. If currently on /login, render without sidebar or top navbar
  if (isLoginPage) {
    return <main className="min-h-screen w-full bg-slate-50">{children}</main>;
  }

  // 2. If unauthenticated and not yet redirected, show loader while redirecting
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-xs font-medium text-slate-600">Mengarahkan ke halaman login...</p>
        </div>
      </div>
    );
  }

  // 3. Authenticated: render full EHR layout
  return (
    <div className="flex w-full min-h-screen">
      {/* Collapsible Left Sidebar */}
      <Sidebar />

      {/* Main Content Area with Sticky Top Navbar */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

