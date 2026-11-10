import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Ping MySQL database
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: 'connected',
      database: 'mysql',
      message: 'Koneksi ke database MySQL berhasil',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'offline',
        database: 'mysql',
        message: 'Koneksi ke MySQL belum aktif (menggunakan fallback memori/localStorage)',
        error: error.message,
      },
      { status: 200 } // Kembalikan 200 agar frontend bisa membaca status tanpa throwing network error
    );
  }
}

