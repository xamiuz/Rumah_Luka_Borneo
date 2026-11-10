import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pasienId = searchParams.get('pasienId');

    const whereClause = pasienId ? { pasienId } : {};
    const records = await prisma.catatanCPPT.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    const formatted = records.map((c) => ({
      id: c.id,
      pasienId: c.pasienId,
      tanggalWaktu: c.tanggalWaktu,
      profesi: c.profesi as 'Dokter' | 'Perawat',
      namaTenagaMedis: c.namaTenagaMedis,
      soap: {
        subjective: c.subjective,
        objective: c.objective,
        assessment: c.assessment,
        plan: c.plan,
      },
      instruksiPPA: c.instruksiPPA,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil CPPT dari MySQL', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const created = await prisma.catatanCPPT.create({
      data: {
        id: body.id || `CPPT-${Date.now()}`,
        pasienId: body.pasienId,
        tanggalWaktu: body.tanggalWaktu || new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
        profesi: body.profesi,
        namaTenagaMedis: body.namaTenagaMedis,
        subjective: body.soap.subjective,
        objective: body.soap.objective,
        assessment: body.soap.assessment,
        plan: body.soap.plan,
        instruksiPPA: body.instruksiPPA || '-',
      },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Gagal menyimpan CPPT ke MySQL', error: error.message },
      { status: 500 }
    );
  }
}

