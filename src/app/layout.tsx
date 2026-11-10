import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClinicProvider } from '@/context/ClinicContext';
import { DialogProvider } from '@/context/DialogContext';
import { AppShell } from '@/components/layout/AppShell';

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
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <DialogProvider>
          <ClinicProvider>
            <AppShell>
              {children}
            </AppShell>
          </ClinicProvider>
        </DialogProvider>
      </body>
    </html>
  );
}
