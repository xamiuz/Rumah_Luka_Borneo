import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClinicProvider } from '@/context/ClinicContext';
import { Sidebar } from '@/components/layout/Sidebar';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Rumah Luka Borneo - Rekam Medis Elektronik (ERM)',
  description: 'Sistem Informasi Rekam Medis dan Asesmen Wound Care Klinis Rumah Luka Borneo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="font-sans min-h-screen bg-[#f4f7fb] text-slate-800 flex">
        <ClinicProvider>
          <div className="flex w-full min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
              {children}
            </div>
          </div>
        </ClinicProvider>
      </body>
    </html>
  );
}
