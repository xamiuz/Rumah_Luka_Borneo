import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Ping database Supabase / PostgreSQL
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: 'connected',
      database: 'supabase',
      message: 'Koneksi ke database Supabase (PostgreSQL) berhasil',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'offline',
        database: 'supabase',
        message: 'Koneksi ke database Supabase belum terhubung (menggunakan fallback memori/localStorage)',
        error: error.message,
      },
      { status: 200 } // Kembalikan 200 agar frontend bisa membaca status tanpa throwing network error
    );
  }
}

