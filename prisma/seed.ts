import { PrismaClient } from '@prisma/client';
import { 
  INITIAL_PATIENTS, 
  INITIAL_USERS, 
  INITIAL_SCHEDULES, 
  INITIAL_CPPT, 
  INITIAL_HOMECARE_JAGA, 
  INITIAL_HOMECARE_MEALS, 
  INITIAL_HOMECARE_MEDS,
  INITIAL_WOUND_PHOTOS,
  INITIAL_PARAF_HOMECARE
} from '../src/lib/mock-data';

const prisma = new PrismaClient();

async function main() {
  console.log('Memulai seeding database Rumah Luka Borneo...');

  // 1. Users
  for (const user of INITIAL_USERS) {
    await prisma.user.upsert({
      where: { username: user.username },
      update: {},
      create: {
        id: user.id,
        nama: user.nama,
        username: user.username,
        role: user.role,
        strNip: user.strNip || null,
        status: user.status,
      },
    });
  }
  console.log('✓ Users berhasil di-seed');

  // 2. Pasien & Asesmen
  for (const p of INITIAL_PATIENTS) {
    const createdPasien = await prisma.pasien.upsert({
      where: { noRm: p.noRm },
      update: {},
      create: {
        id: p.id,
        noRm: p.noRm,
        nik: p.nik,
        nama: p.nama,
        tanggalLahir: p.tanggalLahir,
        jenisKelamin: p.jenisKelamin,
        alamat: p.alamat,
        noHp: p.noHp,
        pekerjaan: p.pekerjaan,
        golonganDarah: p.golonganDarah,
        riwayatPenyakit: JSON.stringify(p.riwayatPenyakit),
        riwayatAlergi: p.riwayatAlergi || null,
        statusKunjungan: p.statusKunjungan,
        tanggalDaftar: p.tanggalDaftar,
        diagnosisMedisUtama: p.diagnosisMedisUtama,
      },
    });

    if (p.asesmenTerakhir) {
      const a = p.asesmenTerakhir;
      const createdAsesmen = await prisma.asesmenLuka.upsert({
        where: { id: a.id },
        update: {},
        create: {
          id: a.id,
          pasienId: createdPasien.id,
          tanggal: new Date(a.tanggal),
          perawatPemeriksa: a.perawatPemeriksa,
          lokasiLuka: a.lokasiLuka,
          lokasiKoordinatX: a.lokasiKoordinat?.x || null,
          lokasiKoordinatY: a.lokasiKoordinat?.y || null,
          lokasiView: (a.lokasiKoordinat as any)?.view || 'foot',
          tipeLuka: a.tipeLuka,
          stadiumLuka: a.stadiumLuka,
          panjangCm: a.ukuran.panjangCm,
          lebarCm: a.ukuran.lebarCm,
          kedalamanMm: a.ukuran.kedalamanMm,
          underminingCm: a.ukuran.underminingGoaCm || 0,
          persenGranulasi: a.dasarLuka.persenGranulasi,
          persenSlough: a.dasarLuka.persenSlough,
          persenNekrotik: a.dasarLuka.persenNekrotik,
          persenEpitelisasi: a.dasarLuka.persenEpitelisasi,
          eksudatJumlah: a.eksudat.jumlah,
          eksudatWarna: a.eksudat.warna,
          eksudatBau: a.eksudat.bau,
          kulitSekitar: a.kulitSekitar,
          tepiLuka: a.tepiLuka,
          dolorNyeri: a.tandaInfeksi.dolorNyeri,
          calorHangat: a.tandaInfeksi.calorHangat,
          ruborKemerahan: a.tandaInfeksi.ruborKemerahan,
          tumorBengkak: a.tandaInfeksi.tumorBengkak,
          functioLaesa: a.tandaInfeksi.functioLaesa,
          skorNyeri: a.skorNyeri,
          cairanPencuci: a.tindakanWoundCare.cairanPencuci,
          teknikDebridement: a.tindakanWoundCare.teknikDebridement,
          primaryDressing: a.tindakanWoundCare.primaryDressing,
          secondaryDressing: a.tindakanWoundCare.secondaryDressing,
          terapiTambahan: a.tindakanWoundCare.terapiTambahan || null,
          intervensiKeperawatan: a.intervensiKeperawatan,
          targetEvaluasi: a.targetEvaluasi,
        },
      });

      // Default Titik Luka
      await prisma.titikLuka.create({
        data: {
          asesmenId: createdAsesmen.id,
          nomor: 1,
          label: 'Luka Utama',
          view: 'foot',
          x: a.lokasiKoordinat?.x || 74,
          y: a.lokasiKoordinat?.y || 78,
          regioAnatomi: a.lokasiLuka,
        },
      });
    }
  }
  console.log('✓ Pasien & Asesmen berhasil di-seed');

  // 3. Catatan CPPT
  for (const c of INITIAL_CPPT) {
    await prisma.catatanCPPT.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        pasienId: c.pasienId,
        tanggalWaktu: c.tanggalWaktu,
        profesi: c.profesi,
        namaTenagaMedis: c.namaTenagaMedis,
        subjective: c.soap.subjective,
        objective: c.soap.objective,
        assessment: c.soap.assessment,
        plan: c.soap.plan,
        instruksiPPA: c.instruksiPPA,
      },
    });
  }
  console.log('✓ Catatan CPPT berhasil di-seed');

  // 4. Jadwal Kontrol
  for (const s of INITIAL_SCHEDULES) {
    await prisma.jadwalPerawatan.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id,
        pasienId: s.pasienId,
        namaPasien: s.namaPasien,
        noRm: s.noRm,
        tanggalJadwal: s.tanggalJadwal,
        jam: s.jam,
        jenisLayanan: s.jenisLayanan,
        namaPerawat: s.namaPerawat,
        status: s.status,
        catatan: s.catatan || null,
      },
    });
  }
  console.log('✓ Jadwal Perawatan berhasil di-seed');

  // 5. Home Care: Jaga
  for (const j of INITIAL_HOMECARE_JAGA) {
    await prisma.homecareJaga.upsert({
      where: { id: j.id },
      update: {},
      create: {
        id: j.id,
        pasienId: j.pasienId,
        namaPasien: j.namaPasien,
        noRm: j.noRm,
        alamatPasien: j.alamatPasien,
        tanggal: j.tanggal,
        shift: j.shift,
        perawatJaga: j.perawatJaga,
        perawatPengganti: j.perawatPengganti || null,
        statusJaga: j.statusJaga,
        catatanAdmin: j.catatanAdmin || null,
        createdBy: j.createdBy,
      },
    });
  }

  // 6. Home Care: Meals
  for (const m of INITIAL_HOMECARE_MEALS) {
    await prisma.homecareMeal.upsert({
      where: { id: m.id },
      update: {},
      create: {
        id: m.id,
        pasienId: m.pasienId,
        tanggal: m.tanggal,
        waktuMakan: m.waktuMakan,
        menuDiet: m.menuDiet,
        targetNutrisi: m.targetNutrisi || null,
        porsiDimakan: m.porsiDimakan,
        status: m.status,
        jamRealisasi: m.jamRealisasi || null,
        perawatInput: m.perawatInput,
        catatan: m.catatan || null,
      },
    });
  }

  // 7. Home Care: Meds
  for (const o of INITIAL_HOMECARE_MEDS) {
    await prisma.homecareMed.upsert({
      where: { id: o.id },
      update: {},
      create: {
        id: o.id,
        pasienId: o.pasienId,
        tanggal: o.tanggal,
        jamObat: o.jamObat,
        namaObat: o.namaObat,
        dosisRute: o.dosisRute,
        aturanMinum: o.aturanMinum,
        status: o.status,
        jamDiminum: o.jamDiminum || null,
        perawatInput: o.perawatInput,
        catatanKhusus: o.catatanKhusus || null,
      },
    });
  }

  // 8. Foto Luka
  for (const f of INITIAL_WOUND_PHOTOS) {
    await prisma.fotoLuka.upsert({
      where: { id: f.id },
      update: {},
      create: {
        id: f.id,
        pasienId: f.pasienId,
        tanggal: f.tanggal,
        fase: f.fase,
        dataUrl: f.dataUrl,
        catatan: f.catatan || null,
        perawat: f.perawat,
      },
    });
  }

  // 9. Paraf
  for (const p of INITIAL_PARAF_HOMECARE) {
    await prisma.homecareParaf.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        pasienId: p.pasienId,
        tanggal: p.tanggal,
        namaKeluarga: p.namaKeluarga,
        hubungan: p.hubungan,
        signatureDataUrl: p.signatureDataUrl,
        waktuTtd: p.waktuTtd,
        perawatJaga: p.perawatJaga,
      },
    });
  }
  console.log('✓ Seluruh data Home Care berhasil di-seed');
  console.log('SELESAI: Database MySQL Rumah Luka Borneo siap digunakan!');
}

main()
  .catch((e) => {
    console.error('Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

