import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { ClinicProvider } from '@/context/ClinicContext';
import { Sidebar } from '@/components/layout/Sidebar';

export const metadata: Metadata = {
  title: 'Rumah Luka Borneo - ERM',
  description: 'Sistem Informasi Rekam Medis Rumah Luka Borneo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script src="https://unpkg.com/@phosphor-icons/web" async></script>
      </head>
      <body>
        <ClinicProvider>
          <div className="app-container">
            <Sidebar />
            {children}
          </div>
        </ClinicProvider>
      </body>
    </html>
  );
}
