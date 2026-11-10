import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pasienId = searchParams.get('pasienId');

    const whereClause = pasienId ? { pasienId } : {};

    const [jaga, meals, meds, photos, paraf] = await Promise.all([
      prisma.homecareJaga.findMany({ where: whereClause, orderBy: { createdAt: 'desc' } }),
      prisma.homecareMeal.findMany({ where: whereClause, orderBy: { createdAt: 'desc' } }),
      prisma.homecareMed.findMany({ where: whereClause, orderBy: { createdAt: 'desc' } }),
      prisma.fotoLuka.findMany({ where: whereClause, orderBy: { createdAt: 'desc' } }),
      prisma.homecareParaf.findMany({ where: whereClause, orderBy: { createdAt: 'desc' } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        jaga,
        meals,
        meds,
        photos,
        paraf,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data Home Care dari MySQL', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    switch (action) {
      case 'addJaga': {
        const res = await prisma.homecareJaga.create({
          data: {
            id: payload.id || `HC-JAGA-${Date.now()}`,
            pasienId: payload.pasienId,
            namaPasien: payload.namaPasien,
            noRm: payload.noRm,
            alamatPasien: payload.alamatPasien,
            tanggal: payload.tanggal,
            shift: payload.shift,
            perawatJaga: payload.perawatJaga,
            statusJaga: payload.statusJaga || 'Terjadwal',
            catatanAdmin: payload.catatanAdmin,
            createdBy: payload.createdBy,
          },
        });
        return NextResponse.json({ success: true, data: res });
      }

      case 'updateJaga': {
        const res = await prisma.homecareJaga.update({
          where: { id: payload.id },
          data: payload.data,
        });
        return NextResponse.json({ success: true, data: res });
      }

      case 'deleteJaga': {
        await prisma.homecareJaga.delete({ where: { id: payload.id } });
        return NextResponse.json({ success: true, message: 'Jadwal jaga terhapus' });
      }

      case 'addMeal': {
        const res = await prisma.homecareMeal.create({
          data: {
            id: payload.id || `HC-MEAL-${Date.now()}`,
            pasienId: payload.pasienId,
            tanggal: payload.tanggal,
            waktuMakan: payload.waktuMakan,
            menuDiet: payload.menuDiet || payload.menuMakanan || '-',
            targetNutrisi: payload.targetNutrisi || null,
            porsiDimakan: payload.porsiDimakan || payload.porsiHabis || 'Habis (100%)',
            status: payload.status || 'Belum Diberikan',
            jamRealisasi: payload.jamRealisasi || null,
            catatan: payload.catatan || payload.catatanKhusus || null,
            perawatInput: payload.perawatInput || payload.inputByPerawat || 'Perawat',
          },
        });
        return NextResponse.json({ success: true, data: res });
      }

      case 'updateMeal': {
        const res = await prisma.homecareMeal.update({
          where: { id: payload.id },
          data: payload.data,
        });
        return NextResponse.json({ success: true, data: res });
      }

      case 'deleteMeal': {
        await prisma.homecareMeal.delete({ where: { id: payload.id } });
        return NextResponse.json({ success: true, message: 'Jadwal makan terhapus' });
      }

      case 'addMed': {
        const res = await prisma.homecareMed.create({
          data: {
            id: payload.id || `HC-MED-${Date.now()}`,
            pasienId: payload.pasienId,
            tanggal: payload.tanggal,
            jamObat: payload.jamObat || payload.jamJadwal || '08:00',
            namaObat: payload.namaObat,
            dosisRute: payload.dosisRute || `${payload.dosis || ''} (${payload.rute || 'Oral'})`,
            aturanMinum: payload.aturanMinum || 'Sesudah Makan',
            status: payload.status || payload.statusMinum || 'Belum Diminum',
            jamDiminum: payload.jamDiminum || payload.jamRealisasi || null,
            catatanKhusus: payload.catatanKhusus || payload.keterangan || null,
            perawatInput: payload.perawatInput || payload.inputByPerawat || 'Perawat',
          },
        });
        return NextResponse.json({ success: true, data: res });
      }

      case 'updateMed': {
        const res = await prisma.homecareMed.update({
          where: { id: payload.id },
          data: payload.data,
        });
        return NextResponse.json({ success: true, data: res });
      }

      case 'deleteMed': {
        await prisma.homecareMed.delete({ where: { id: payload.id } });
        return NextResponse.json({ success: true, message: 'Jadwal obat terhapus' });
      }

      case 'addPhoto': {
        const res = await prisma.fotoLuka.create({
          data: {
            id: payload.id || `PHOTO-${Date.now()}`,
            pasienId: payload.pasienId,
            tanggal: payload.tanggal,
            fase: payload.fase,
            dataUrl: payload.dataUrl,
            catatan: payload.catatan,
            perawat: payload.perawat,
          },
        });
        return NextResponse.json({ success: true, data: res });
      }

      case 'deletePhoto': {
        await prisma.fotoLuka.delete({ where: { id: payload.id } });
        return NextResponse.json({ success: true, message: 'Foto luka terhapus' });
      }

      case 'addParaf': {
        const res = await prisma.homecareParaf.create({
          data: {
            id: payload.id || `PARAF-${Date.now()}`,
            pasienId: payload.pasienId,
            tanggal: payload.tanggal || payload.tanggalKunjungan,
            namaKeluarga: payload.namaKeluarga,
            hubungan: payload.hubungan || payload.hubunganKeluarga || 'Keluarga',
            signatureDataUrl: payload.signatureDataUrl || payload.tandaTanganSvg,
            waktuTtd: payload.waktuTtd || new Date().toLocaleTimeString('id-ID'),
            perawatJaga: payload.perawatJaga || payload.perawatBertugas || 'Perawat',
          },
        });
        return NextResponse.json({ success: true, data: res });
      }

      default:
        return NextResponse.json({ success: false, message: 'Aksi tidak dikenal' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Gagal memproses data Home Care ke MySQL', error: error.message },
      { status: 500 }
    );
  }
}

