-- ==============================================================================
-- SCHEMA DATABASE RUMAH LUKA BORNEO UNTUK SUPABASE (POSTGRESQL)
-- Salin dan jalankan seluruh query ini di Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================================

-- 1. Tabel Users & Tenaga Medis
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT '123',
    "role" TEXT NOT NULL,
    "strNip" TEXT,
    "noHp" TEXT,
    "email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- 2. Tabel Pasien
CREATE TABLE IF NOT EXISTS "pasien" (
    "id" TEXT NOT NULL,
    "noRm" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "tanggalLahir" TEXT NOT NULL,
    "jenisKelamin" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "noHp" TEXT NOT NULL,
    "pekerjaan" TEXT NOT NULL,
    "golonganDarah" TEXT NOT NULL DEFAULT 'O',
    "riwayatPenyakit" TEXT NOT NULL DEFAULT '[]',
    "riwayatAlergi" TEXT,
    "statusKunjungan" TEXT NOT NULL DEFAULT 'Antrean',
    "tanggalDaftar" TEXT NOT NULL,
    "diagnosisMedisUtama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pasien_pkey" PRIMARY KEY ("id")
);

-- 3. Tabel Asesmen Luka (Protokol TIME)
CREATE TABLE IF NOT EXISTS "asesmen_luka" (
    "id" TEXT NOT NULL,
    "pasienId" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "perawatPemeriksa" TEXT NOT NULL,
    "lokasiLuka" TEXT NOT NULL,
    "lokasiKoordinatX" DOUBLE PRECISION,
    "lokasiKoordinatY" DOUBLE PRECISION,
    "lokasiView" TEXT,
    "tipeLuka" TEXT NOT NULL,
    "stadiumLuka" TEXT NOT NULL,
    "panjangCm" DOUBLE PRECISION NOT NULL,
    "lebarCm" DOUBLE PRECISION NOT NULL,
    "kedalamanMm" DOUBLE PRECISION NOT NULL,
    "underminingCm" DOUBLE PRECISION DEFAULT 0,
    "persenGranulasi" INTEGER NOT NULL DEFAULT 0,
    "persenSlough" INTEGER NOT NULL DEFAULT 0,
    "persenNekrotik" INTEGER NOT NULL DEFAULT 0,
    "persenEpitelisasi" INTEGER NOT NULL DEFAULT 0,
    "eksudatJumlah" TEXT NOT NULL DEFAULT 'Sedikit',
    "eksudatWarna" TEXT NOT NULL DEFAULT 'Serous',
    "eksudatBau" TEXT NOT NULL DEFAULT 'Khas',
    "kulitSekitar" TEXT NOT NULL DEFAULT 'Sehat',
    "tepiLuka" TEXT NOT NULL DEFAULT 'Menyatu',
    "dolorNyeri" BOOLEAN NOT NULL DEFAULT false,
    "calorHangat" BOOLEAN NOT NULL DEFAULT false,
    "ruborKemerahan" BOOLEAN NOT NULL DEFAULT false,
    "tumorBengkak" BOOLEAN NOT NULL DEFAULT false,
    "functioLaesa" BOOLEAN NOT NULL DEFAULT false,
    "skorNyeri" INTEGER NOT NULL DEFAULT 0,
    "cairanPencuci" TEXT NOT NULL,
    "teknikDebridement" TEXT NOT NULL,
    "primaryDressing" TEXT NOT NULL,
    "secondaryDressing" TEXT NOT NULL,
    "terapiTambahan" TEXT,
    "intervensiKeperawatan" TEXT NOT NULL,
    "targetEvaluasi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asesmen_luka_pkey" PRIMARY KEY ("id")
);

-- 4. Tabel Titik Luka Interaktif (Multi-Wound)
CREATE TABLE IF NOT EXISTS "titik_luka" (
    "id" TEXT NOT NULL,
    "asesmenId" TEXT NOT NULL,
    "nomor" INTEGER NOT NULL DEFAULT 1,
    "label" TEXT NOT NULL,
    "view" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "regioAnatomi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "titik_luka_pkey" PRIMARY KEY ("id")
);

-- 5. Tabel Galeri Foto Luka Before-After
CREATE TABLE IF NOT EXISTS "foto_luka" (
    "id" TEXT NOT NULL,
    "pasienId" TEXT NOT NULL,
    "tanggal" TEXT NOT NULL,
    "fase" TEXT NOT NULL,
    "dataUrl" TEXT NOT NULL,
    "catatan" TEXT,
    "perawat" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "foto_luka_pkey" PRIMARY KEY ("id")
);

-- 6. Tabel Catatan Perkembangan Pasien Terintegrasi (CPPT SOAP)
CREATE TABLE IF NOT EXISTS "catatan_cppt" (
    "id" TEXT NOT NULL,
    "pasienId" TEXT NOT NULL,
    "tanggalWaktu" TEXT NOT NULL,
    "profesi" TEXT NOT NULL,
    "namaTenagaMedis" TEXT NOT NULL,
    "subjective" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "assessment" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "instruksiPPA" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "catatan_cppt_pkey" PRIMARY KEY ("id")
);

-- 7. Tabel Jadwal Pelayanan Klinik & Kontrol
CREATE TABLE IF NOT EXISTS "jadwal_perawatan" (
    "id" TEXT NOT NULL,
    "pasienId" TEXT NOT NULL,
    "namaPasien" TEXT NOT NULL,
    "noRm" TEXT NOT NULL,
    "tanggalJadwal" TEXT NOT NULL,
    "jam" TEXT NOT NULL,
    "jenisLayanan" TEXT NOT NULL,
    "namaPerawat" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Menunggu',
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jadwal_perawatan_pkey" PRIMARY KEY ("id")
);

-- 8. Tabel Home Care: Penugasan Jaga
CREATE TABLE IF NOT EXISTS "homecare_jaga" (
    "id" TEXT NOT NULL,
    "pasienId" TEXT NOT NULL,
    "namaPasien" TEXT NOT NULL,
    "noRm" TEXT NOT NULL,
    "alamatPasien" TEXT NOT NULL,
    "tanggal" TEXT NOT NULL,
    "shift" TEXT NOT NULL,
    "perawatJaga" TEXT NOT NULL,
    "perawatPengganti" TEXT,
    "statusJaga" TEXT NOT NULL DEFAULT 'Terjadwal',
    "catatanAdmin" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "homecare_jaga_pkey" PRIMARY KEY ("id")
);

-- 9. Tabel Home Care: Jadwal Makan & Nutrisi
CREATE TABLE IF NOT EXISTS "homecare_meal" (
    "id" TEXT NOT NULL,
    "pasienId" TEXT NOT NULL,
    "tanggal" TEXT NOT NULL,
    "waktuMakan" TEXT NOT NULL,
    "menuDiet" TEXT NOT NULL,
    "targetNutrisi" TEXT,
    "porsiDimakan" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Belum Diberikan',
    "jamRealisasi" TEXT,
    "perawatInput" TEXT NOT NULL,
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "homecare_meal_pkey" PRIMARY KEY ("id")
);

-- 10. Tabel Home Care: Jadwal Obat (MAR)
CREATE TABLE IF NOT EXISTS "homecare_med" (
    "id" TEXT NOT NULL,
    "pasienId" TEXT NOT NULL,
    "tanggal" TEXT NOT NULL,
    "jamObat" TEXT NOT NULL,
    "namaObat" TEXT NOT NULL,
    "dosisRute" TEXT NOT NULL,
    "aturanMinum" TEXT NOT NULL DEFAULT 'Sesudah Makan',
    "status" TEXT NOT NULL DEFAULT 'Belum Diminum',
    "jamDiminum" TEXT,
    "perawatInput" TEXT NOT NULL,
    "catatanKhusus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "homecare_med_pkey" PRIMARY KEY ("id")
);

-- 11. Tabel Home Care: Paraf Digital Keluarga
CREATE TABLE IF NOT EXISTS "homecare_paraf" (
    "id" TEXT NOT NULL,
    "pasienId" TEXT NOT NULL,
    "tanggal" TEXT NOT NULL,
    "namaKeluarga" TEXT NOT NULL,
    "hubungan" TEXT NOT NULL,
    "signatureDataUrl" TEXT NOT NULL,
    "waktuTtd" TEXT NOT NULL,
    "perawatJaga" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "homecare_paraf_pkey" PRIMARY KEY ("id")
);

-- INDEXES
CREATE UNIQUE INDEX IF NOT EXISTS "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX IF NOT EXISTS "pasien_noRm_key" ON "pasien"("noRm");
CREATE UNIQUE INDEX IF NOT EXISTS "pasien_nik_key" ON "pasien"("nik");

-- FOREIGN KEYS
ALTER TABLE "asesmen_luka" DROP CONSTRAINT IF EXISTS "asesmen_luka_pasienId_fkey";
ALTER TABLE "asesmen_luka" ADD CONSTRAINT "asesmen_luka_pasienId_fkey" FOREIGN KEY ("pasienId") REFERENCES "pasien"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "titik_luka" DROP CONSTRAINT IF EXISTS "titik_luka_asesmenId_fkey";
ALTER TABLE "titik_luka" ADD CONSTRAINT "titik_luka_asesmenId_fkey" FOREIGN KEY ("asesmenId") REFERENCES "asesmen_luka"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "foto_luka" DROP CONSTRAINT IF EXISTS "foto_luka_pasienId_fkey";
ALTER TABLE "foto_luka" ADD CONSTRAINT "foto_luka_pasienId_fkey" FOREIGN KEY ("pasienId") REFERENCES "pasien"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "catatan_cppt" DROP CONSTRAINT IF EXISTS "catatan_cppt_pasienId_fkey";
ALTER TABLE "catatan_cppt" ADD CONSTRAINT "catatan_cppt_pasienId_fkey" FOREIGN KEY ("pasienId") REFERENCES "pasien"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "jadwal_perawatan" DROP CONSTRAINT IF EXISTS "jadwal_perawatan_pasienId_fkey";
ALTER TABLE "jadwal_perawatan" ADD CONSTRAINT "jadwal_perawatan_pasienId_fkey" FOREIGN KEY ("pasienId") REFERENCES "pasien"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "homecare_jaga" DROP CONSTRAINT IF EXISTS "homecare_jaga_pasienId_fkey";
ALTER TABLE "homecare_jaga" ADD CONSTRAINT "homecare_jaga_pasienId_fkey" FOREIGN KEY ("pasienId") REFERENCES "pasien"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "homecare_meal" DROP CONSTRAINT IF EXISTS "homecare_meal_pasienId_fkey";
ALTER TABLE "homecare_meal" ADD CONSTRAINT "homecare_meal_pasienId_fkey" FOREIGN KEY ("pasienId") REFERENCES "pasien"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "homecare_med" DROP CONSTRAINT IF EXISTS "homecare_med_pasienId_fkey";
ALTER TABLE "homecare_med" ADD CONSTRAINT "homecare_med_pasienId_fkey" FOREIGN KEY ("pasienId") REFERENCES "pasien"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "homecare_paraf" DROP CONSTRAINT IF EXISTS "homecare_paraf_pasienId_fkey";
ALTER TABLE "homecare_paraf" ADD CONSTRAINT "homecare_paraf_pasienId_fkey" FOREIGN KEY ("pasienId") REFERENCES "pasien"("id") ON DELETE CASCADE ON UPDATE CASCADE;
