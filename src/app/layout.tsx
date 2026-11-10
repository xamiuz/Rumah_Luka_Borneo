import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClinicProvider } from '@/context/ClinicContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNavbar } from '@/components/layout/TopNavbar';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Rumah Luka Borneo | Sistem Rekam Medis Elektronik Terpadu (Wound Care EHR)',
  description: 'Platform Manajemen Pelayanan Perawatan Luka Modern, Asesmen Klinis, dan Rekam Medis Terintegrasi Rumah Luka Borneo.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 flex antialiased">
        <ClinicProvider>
          <div className="flex w-full min-h-screen">
            {/* Professional Left Sidebar */}
            <Sidebar />

            {/* Main Content Area with Sticky Top Navbar */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
              <TopNavbar />
              <div className="flex-1 overflow-y-auto">
                {children}
              </div>
            </div>
          </div>
        </ClinicProvider>
      </body>
    </html>
  );
}
