import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pasienId, assessmentData, perawat } = body;

    // 1. Simpan data Asesmen Luka
    const createdAsesmen = await prisma.asesmenLuka.create({
      data: {
        id: body.id || `ASM-${Date.now()}`,
        pasienId,
        perawatPemeriksa: assessmentData.perawatPemeriksa || perawat,
        lokasiLuka: assessmentData.lokasiLuka,
        lokasiKoordinatX: assessmentData.lokasiKoordinat?.x || null,
        lokasiKoordinatY: assessmentData.lokasiKoordinat?.y || null,
        lokasiView: assessmentData.lokasiKoordinat?.view || 'foot',
        tipeLuka: assessmentData.tipeLuka,
        stadiumLuka: assessmentData.stadiumLuka,
        panjangCm: Number(assessmentData.ukuran.panjangCm),
        lebarCm: Number(assessmentData.ukuran.lebarCm),
        kedalamanMm: Number(assessmentData.ukuran.kedalamanMm),
        underminingCm: Number(assessmentData.ukuran.underminingGoaCm || 0),
        persenGranulasi: Number(assessmentData.dasarLuka.persenGranulasi),
        persenSlough: Number(assessmentData.dasarLuka.persenSlough),
        persenNekrotik: Number(assessmentData.dasarLuka.persenNekrotik),
        persenEpitelisasi: Number(assessmentData.dasarLuka.persenEpitelisasi),
        eksudatJumlah: assessmentData.eksudat.jumlah,
        eksudatWarna: assessmentData.eksudat.warna,
        eksudatBau: assessmentData.eksudat.bau,
        kulitSekitar: assessmentData.kulitSekitar,
        tepiLuka: assessmentData.tepiLuka,
        dolorNyeri: Boolean(assessmentData.tandaInfeksi.dolorNyeri),
        calorHangat: Boolean(assessmentData.tandaInfeksi.calorHangat),
        ruborKemerahan: Boolean(assessmentData.tandaInfeksi.ruborKemerahan),
        tumorBengkak: Boolean(assessmentData.tandaInfeksi.tumorBengkak),
        functioLaesa: Boolean(assessmentData.tandaInfeksi.functioLaesa),
        skorNyeri: Number(assessmentData.skorNyeri),
        cairanPencuci: assessmentData.tindakanWoundCare.cairanPencuci,
        teknikDebridement: assessmentData.tindakanWoundCare.teknikDebridement,
        primaryDressing: assessmentData.tindakanWoundCare.primaryDressing,
        secondaryDressing: assessmentData.tindakanWoundCare.secondaryDressing,
        terapiTambahan: assessmentData.tindakanWoundCare.terapiTambahan || null,
        intervensiKeperawatan: assessmentData.intervensiKeperawatan || 'Rawat luka modern dengan protokol TIME.',
        targetEvaluasi: assessmentData.targetEvaluasi,
      },
    });

    // 2. Simpan Multi-Wound Pins jika ada
    if (assessmentData.daftarTitikLuka && assessmentData.daftarTitikLuka.length > 0) {
      await prisma.titikLuka.createMany({
        data: assessmentData.daftarTitikLuka.map((pt: any) => ({
          asesmenId: createdAsesmen.id,
          nomor: pt.nomor,
          label: pt.label,
          view: pt.view,
          x: pt.x,
          y: pt.y,
          regioAnatomi: pt.regioAnatomi,
        })),
      });
    }

    // 3. Update status kunjungan pasien menjadi 'Selesai'
    await prisma.pasien.update({
      where: { id: pasienId },
      data: { statusKunjungan: 'Selesai' },
    });

    // 4. Otomatis buatkan Catatan CPPT SOAP terintegrasi
    const autoCPPT = await prisma.catatanCPPT.create({
      data: {
        id: `CPPT-${Date.now()}`,
        pasienId,
        tanggalWaktu: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
        profesi: 'Perawat',
        namaTenagaMedis: assessmentData.perawatPemeriksa || perawat,
        subjective: `Pasien mengeluh nyeri luka skala ${assessmentData.skorNyeri}/10. Lokasi luka: ${assessmentData.lokasiLuka}.`,
        objective: `Tipe: ${assessmentData.tipeLuka}. Ukuran ${assessmentData.ukuran.panjangCm}x${assessmentData.ukuran.lebarCm} cm, kedalaman ${assessmentData.ukuran.kedalamanMm} mm. Granulasi ${assessmentData.dasarLuka.persenGranulasi}%, Slough ${assessmentData.dasarLuka.persenSlough}%, Nekrotik ${assessmentData.dasarLuka.persenNekrotik}%. Eksudat: ${assessmentData.eksudat.jumlah} (${assessmentData.eksudat.warna}).`,
        assessment: `Gangguan integritas jaringan b.d ${assessmentData.tipeLuka} (${assessmentData.stadiumLuka}).`,
        plan: `Tindakan: ${assessmentData.tindakanWoundCare.cairanPencuci}. Debridement: ${assessmentData.tindakanWoundCare.teknikDebridement}. Dressing: ${assessmentData.tindakanWoundCare.primaryDressing} & ${assessmentData.tindakanWoundCare.secondaryDressing}. Target: ${assessmentData.targetEvaluasi}.`,
        instruksiPPA: `Ganti balutan steril sesuai jadwal. Jaga luka tetap kering dari air luar.`,
      },
    });

    return NextResponse.json({
      success: true,
      data: { asesmen: createdAsesmen, cppt: autoCPPT },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Gagal menyimpan asesmen ke MySQL', error: error.message },
      { status: 500 }
    );
  }
}

