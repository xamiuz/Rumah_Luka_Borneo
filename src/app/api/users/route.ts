import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const list = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data user dari MySQL', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const created = await prisma.user.create({
      data: {
        id: body.id || `USR-${Date.now()}`,
        nama: body.nama,
        username: body.username,
        password: body.password || '123',
        role: body.role,
        strNip: body.strNip || null,
        noHp: body.noHp || null,
        email: body.email || null,
        status: body.status || 'Aktif',
      },
    });
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Gagal menyimpan user ke MySQL', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ success: false, message: 'ID user dibutuhkan' }, { status: 400 });

    const updated = await prisma.user.update({
      where: { id },
      data,
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui user di MySQL', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'ID user dibutuhkan' }, { status: 400 });

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'User berhasil dihapus' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus user dari MySQL', error: error.message },
      { status: 500 }
    );
  }
}

