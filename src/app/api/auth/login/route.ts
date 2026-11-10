import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username dan password wajib diisi' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Akun dengan username tersebut tidak ditemukan' },
        { status: 404 }
      );
    }

    if (user.status !== 'Aktif') {
      return NextResponse.json(
        { success: false, message: 'Akun ini telah dinonaktifkan oleh administrator' },
        { status: 403 }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        { success: false, message: 'Password salah. Silakan coba kembali' },
        { status: 401 }
      );
    }

    // Return safe user object (exclude raw password)
    const { password: _, ...safeUser } = user;
    return NextResponse.json({
      success: true,
      message: 'Login berhasil',
      data: safeUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Koneksi database offline / error', error: error.message },
      { status: 500 }
    );
  }
}

