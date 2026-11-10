import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId, oldPassword, newPassword } = await req.json();

    if (!userId || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'User ID dan password baru wajib diisi' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    // If oldPassword is provided, verify it (user self-change password)
    if (oldPassword !== undefined && user.password !== oldPassword) {
      return NextResponse.json(
        { success: false, message: 'Password saat ini salah' },
        { status: 401 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { password: newPassword },
    });

    const { password: _, ...safeUser } = updated;
    return NextResponse.json({
      success: true,
      message: 'Password berhasil diperbarui',
      data: safeUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui password di MySQL', error: error.message },
      { status: 500 }
    );
  }
}

