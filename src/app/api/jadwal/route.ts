import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const list = await prisma.jadwalPerawatan.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil jadwal dari MySQL', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const created = await prisma.jadwalPerawatan.create({
      data: {
        id: body.id || `SCH-${Date.now()}`,
        pasienId: body.pasienId,
        namaPasien: body.namaPasien,
        noRm: body.noRm,
        tanggalJadwal: body.tanggalJadwal || body.tanggal,
        jam: body.jam,
        jenisLayanan: body.jenisLayanan,
        namaPerawat: body.namaPerawat,
        status: body.status || 'Menunggu',
        catatan: body.catatan || null,
      },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan jadwal ke MySQL', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    const updated = await prisma.jadwalPerawatan.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui status jadwal', error: error.message },
      { status: 500 }
    );
  }
}

