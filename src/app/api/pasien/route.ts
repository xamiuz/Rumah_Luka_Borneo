import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const list = await prisma.pasien.findMany({
      include: {
        asesmenList: {
          orderBy: { tanggal: 'desc' },
          take: 1,
          include: {
            titikLukaList: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = list.map((p) => {
      let riwayatPenyakitArr: string[] = [];
      try {
        riwayatPenyakitArr = JSON.parse(p.riwayatPenyakit);
      } catch {
        riwayatPenyakitArr = [p.riwayatPenyakit];
      }

      const latestAsesmen = p.asesmenList[0];

      return {
        id: p.id,
        noRm: p.noRm,
        nik: p.nik,
        nama: p.nama,
        tanggalLahir: p.tanggalLahir,
        jenisKelamin: p.jenisKelamin as 'Laki-laki' | 'Perempuan',
        alamat: p.alamat,
        noHp: p.noHp,
        pekerjaan: p.pekerjaan,
        golonganDarah: p.golonganDarah,
        riwayatPenyakit: riwayatPenyakitArr,
        riwayatAlergi: p.riwayatAlergi || 'Tidak Ada',
        statusKunjungan: p.statusKunjungan as any,
        tanggalDaftar: p.tanggalDaftar,
        diagnosisMedisUtama: p.diagnosisMedisUtama,
        asesmenTerakhir: latestAsesmen
          ? {
              id: latestAsesmen.id,
              pasienId: latestAsesmen.pasienId,
              tanggal: latestAsesmen.tanggal.toISOString(),
              perawatPemeriksa: latestAsesmen.perawatPemeriksa,
              lokasiLuka: latestAsesmen.lokasiLuka,
              lokasiKoordinat: latestAsesmen.lokasiKoordinatX
                ? {
                    x: latestAsesmen.lokasiKoordinatX,
                    y: latestAsesmen.lokasiKoordinatY || 0,
                    view: (latestAsesmen.lokasiView as any) || 'foot',
                  }
                : undefined,
              tipeLuka: latestAsesmen.tipeLuka as any,
              stadiumLuka: latestAsesmen.stadiumLuka,
              ukuran: {
                panjangCm: latestAsesmen.panjangCm,
                lebarCm: latestAsesmen.lebarCm,
                kedalamanMm: latestAsesmen.kedalamanMm,
                underminingGoaCm: latestAsesmen.underminingCm || 0,
              },
              dasarLuka: {
                persenGranulasi: latestAsesmen.persenGranulasi,
                persenSlough: latestAsesmen.persenSlough,
                persenNekrotik: latestAsesmen.persenNekrotik,
                persenEpitelisasi: latestAsesmen.persenEpitelisasi,
              },
              eksudat: {
                jumlah: latestAsesmen.eksudatJumlah as any,
                warna: latestAsesmen.eksudatWarna as any,
                bau: latestAsesmen.eksudatBau as any,
              },
              kulitSekitar: latestAsesmen.kulitSekitar as any,
              tepiLuka: latestAsesmen.tepiLuka as any,
              tandaInfeksi: {
                dolorNyeri: latestAsesmen.dolorNyeri,
                calorHangat: latestAsesmen.calorHangat,
                ruborKemerahan: latestAsesmen.ruborKemerahan,
                tumorBengkak: latestAsesmen.tumorBengkak,
                functioLaesa: latestAsesmen.functioLaesa,
              },
              skorNyeri: latestAsesmen.skorNyeri,
              tindakanWoundCare: {
                cairanPencuci: latestAsesmen.cairanPencuci,
                teknikDebridement: latestAsesmen.teknikDebridement,
                primaryDressing: latestAsesmen.primaryDressing,
                secondaryDressing: latestAsesmen.secondaryDressing,
                terapiTambahan: latestAsesmen.terapiTambahan || undefined,
              },
              intervensiKeperawatan: latestAsesmen.intervensiKeperawatan,
              targetEvaluasi: latestAsesmen.targetEvaluasi,
            }
          : undefined,
      };
    });

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data dari MySQL', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const created = await prisma.pasien.create({
      data: {
        id: body.id || `PAS-${Date.now()}`,
        noRm: body.noRm,
        nik: body.nik,
        nama: body.nama,
        tanggalLahir: body.tanggalLahir,
        jenisKelamin: body.jenisKelamin,
        alamat: body.alamat,
        noHp: body.noHp,
        pekerjaan: body.pekerjaan || 'Lainnya',
        golonganDarah: body.golonganDarah || 'O',
        riwayatPenyakit: JSON.stringify(body.riwayatPenyakit || []),
        riwayatAlergi: body.riwayatAlergi || 'Tidak Ada',
        statusKunjungan: body.statusKunjungan || 'Antrean',
        tanggalDaftar: body.tanggalDaftar || new Date().toISOString().split('T')[0],
        diagnosisMedisUtama: body.diagnosisMedisUtama,
      },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan pasien ke MySQL', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'ID pasien dibutuhkan' }, { status: 400 });

    await prisma.pasien.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Pasien berhasil dihapus' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus pasien', error: error.message },
      { status: 500 }
    );
  }
}

