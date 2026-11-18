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

  // 1. If currently on /login, render directly with children
  if (isLoginPage) {
    return <main className="min-h-screen w-full bg-slate-50">{children}</main>;
  }

  // 2. Main Authenticated / Guarded Shell
  // Note: We always keep {children} in the render tree (conditionally hidden via CSS when unauthenticated)
  // so Next.js Partial Prerendering (PPR) / Instant Navigation validation never drops page segments.
  const isReady = mounted && isAuthenticated;

  return (
    <div className="flex w-full min-h-screen">
      {/* Collapsible Left Sidebar */}
      {isReady ? <Sidebar /> : null}

      {/* Main Content Area with Sticky Top Navbar */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {isReady ? <TopNavbar /> : null}
        <main className="flex-1 overflow-y-auto">
          {!isReady ? (
            <div className="min-h-[70vh] w-full flex items-center justify-center bg-slate-50 text-slate-500">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-xs font-medium text-slate-600">
                  {!mounted ? 'Memuat Sistem Rumah Luka Borneo...' : 'Memverifikasi sesi pengguna...'}
                </p>
              </div>
            </div>
          ) : null}

          {/* Render children continuously to avoid segment dropping */}
          <div className={!isReady ? 'hidden' : 'block'}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

