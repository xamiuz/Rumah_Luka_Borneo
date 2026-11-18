import type { Metadata, Viewport } from 'next';
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
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'RLB Care',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1e40af',
};

export const instant = false;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
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
