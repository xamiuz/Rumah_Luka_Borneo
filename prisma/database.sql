-- =========================================================================
-- DATABASE SCHEMA: RUMAH LUKA BORNEO (MySQL 5.7 / 8.0+ & MariaDB)
-- Siap di-import langsung lewat phpMyAdmin / HeidiSQL / DBeaver / MySQL CLI
-- =========================================================================

CREATE DATABASE IF NOT EXISTS `rumah_luka` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `rumah_luka`;

-- 1. Tabel Users
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `nama` VARCHAR(191) NOT NULL,
  `username` VARCHAR(191) NOT NULL UNIQUE,
  `role` VARCHAR(191) NOT NULL,
  `strNip` VARCHAR(191) NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'Aktif',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabel Pasien
CREATE TABLE IF NOT EXISTS `pasien` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `noRm` VARCHAR(191) NOT NULL UNIQUE,
  `nik` VARCHAR(191) NOT NULL UNIQUE,
  `nama` VARCHAR(191) NOT NULL,
  `tanggalLahir` VARCHAR(191) NOT NULL,
  `jenisKelamin` VARCHAR(191) NOT NULL,
  `alamat` TEXT NOT NULL,
  `noHp` VARCHAR(191) NOT NULL,
  `pekerjaan` VARCHAR(191) NOT NULL,
  `golonganDarah` VARCHAR(191) NOT NULL DEFAULT 'O',
  `riwayatPenyakit` VARCHAR(191) NOT NULL DEFAULT '[]',
  `riwayatAlergi` VARCHAR(191) NULL,
  `statusKunjungan` VARCHAR(191) NOT NULL DEFAULT 'Antrean',
  `tanggalDaftar` VARCHAR(191) NOT NULL,
  `diagnosisMedisUtama` TEXT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabel Asesmen Luka (TIME Protocol)
CREATE TABLE IF NOT EXISTS `asesmen_luka` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `pasienId` VARCHAR(191) NOT NULL,
  `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `perawatPemeriksa` VARCHAR(191) NOT NULL,
  `lokasiLuka` TEXT NOT NULL,
  `lokasiKoordinatX` DOUBLE NULL,
  `lokasiKoordinatY` DOUBLE NULL,
  `lokasiView` VARCHAR(191) NULL,
  `tipeLuka` VARCHAR(191) NOT NULL,
  `stadiumLuka` VARCHAR(191) NOT NULL,
  `panjangCm` DOUBLE NOT NULL,
  `lebarCm` DOUBLE NOT NULL,
  `kedalamanMm` DOUBLE NOT NULL,
  `underminingCm` DOUBLE NULL DEFAULT 0,
  `persenGranulasi` INT NOT NULL DEFAULT 0,
  `persenSlough` INT NOT NULL DEFAULT 0,
  `persenNekrotik` INT NOT NULL DEFAULT 0,
  `persenEpitelisasi` INT NOT NULL DEFAULT 0,
  `eksudatJumlah` VARCHAR(191) NOT NULL DEFAULT 'Sedikit',
  `eksudatWarna` VARCHAR(191) NOT NULL DEFAULT 'Serous',
  `eksudatBau` VARCHAR(191) NOT NULL DEFAULT 'Khas',
  `kulitSekitar` VARCHAR(191) NOT NULL DEFAULT 'Sehat',
  `tepiLuka` VARCHAR(191) NOT NULL DEFAULT 'Menyatu',
  `dolorNyeri` BOOLEAN NOT NULL DEFAULT FALSE,
  `calorHangat` BOOLEAN NOT NULL DEFAULT FALSE,
  `ruborKemerahan` BOOLEAN NOT NULL DEFAULT FALSE,
  `tumorBengkak` BOOLEAN NOT NULL DEFAULT FALSE,
  `functioLaesa` BOOLEAN NOT NULL DEFAULT FALSE,
  `skorNyeri` INT NOT NULL DEFAULT 0,
  `cairanPencuci` TEXT NOT NULL,
  `teknikDebridement` TEXT NOT NULL,
  `primaryDressing` TEXT NOT NULL,
  `secondaryDressing` TEXT NOT NULL,
  `terapiTambahan` TEXT NULL,
  `intervensiKeperawatan` TEXT NOT NULL,
  `targetEvaluasi` TEXT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT `fk_asesmen_pasien` FOREIGN KEY (`pasienId`) REFERENCES `pasien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabel Titik Luka Interaktif (Multi-Pin)
CREATE TABLE IF NOT EXISTS `titik_luka` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `asesmenId` VARCHAR(191) NOT NULL,
  `nomor` INT NOT NULL DEFAULT 1,
  `label` VARCHAR(191) NOT NULL,
  `view` VARCHAR(191) NOT NULL,
  `x` DOUBLE NOT NULL,
  `y` DOUBLE NOT NULL,
  `regioAnatomi` TEXT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT `fk_titik_asesmen` FOREIGN KEY (`asesmenId`) REFERENCES `asesmen_luka` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabel Foto Perkembangan Luka
CREATE TABLE IF NOT EXISTS `foto_luka` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `pasienId` VARCHAR(191) NOT NULL,
  `tanggal` VARCHAR(191) NOT NULL,
  `fase` VARCHAR(191) NOT NULL,
  `dataUrl` LONGTEXT NOT NULL,
  `catatan` TEXT NULL,
  `perawat` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT `fk_foto_pasien` FOREIGN KEY (`pasienId`) REFERENCES `pasien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tabel Catatan CPPT SOAP
CREATE TABLE IF NOT EXISTS `catatan_cppt` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `pasienId` VARCHAR(191) NOT NULL,
  `tanggalWaktu` VARCHAR(191) NOT NULL,
  `profesi` VARCHAR(191) NOT NULL,
  `namaTenagaMedis` VARCHAR(191) NOT NULL,
  `subjective` TEXT NOT NULL,
  `objective` TEXT NOT NULL,
  `assessment` TEXT NOT NULL,
  `plan` TEXT NOT NULL,
  `instruksiPPA` TEXT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT `fk_cppt_pasien` FOREIGN KEY (`pasienId`) REFERENCES `pasien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Tabel Jadwal Kontrol & Perawatan
CREATE TABLE IF NOT EXISTS `jadwal_perawatan` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `pasienId` VARCHAR(191) NOT NULL,
  `namaPasien` VARCHAR(191) NOT NULL,
  `noRm` VARCHAR(191) NOT NULL,
  `tanggal` VARCHAR(191) NOT NULL,
  `jam` VARCHAR(191) NOT NULL,
  `jenisLayanan` VARCHAR(191) NOT NULL,
  `namaPerawat` VARCHAR(191) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'Menunggu',
  `catatan` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT `fk_jadwal_pasien` FOREIGN KEY (`pasienId`) REFERENCES `pasien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Tabel Home Care: Jadwal Jaga Perawat
CREATE TABLE IF NOT EXISTS `homecare_jaga` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `pasienId` VARCHAR(191) NOT NULL,
  `namaPasien` VARCHAR(191) NOT NULL,
  `noRm` VARCHAR(191) NOT NULL,
  `alamatPasien` TEXT NOT NULL,
  `tanggal` VARCHAR(191) NOT NULL,
  `shift` VARCHAR(191) NOT NULL,
  `perawatJaga` VARCHAR(191) NOT NULL,
  `statusJaga` VARCHAR(191) NOT NULL DEFAULT 'Terjadwal',
  `catatanAdmin` TEXT NULL,
  `createdBy` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT `fk_hc_jaga_pasien` FOREIGN KEY (`pasienId`) REFERENCES `pasien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Tabel Home Care: Jadwal Makan & Nutrisi
CREATE TABLE IF NOT EXISTS `homecare_meal` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `pasienId` VARCHAR(191) NOT NULL,
  `tanggal` VARCHAR(191) NOT NULL,
  `waktuMakan` VARCHAR(191) NOT NULL,
  `menuMakanan` TEXT NOT NULL,
  `porsiHabis` VARCHAR(191) NOT NULL,
  `statusPemberian` VARCHAR(191) NOT NULL DEFAULT 'Belum Diberikan',
  `catatanKhusus` TEXT NULL,
  `inputByPerawat` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT `fk_hc_meal_pasien` FOREIGN KEY (`pasienId`) REFERENCES `pasien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Tabel Home Care: Jadwal Obat & MAR
CREATE TABLE IF NOT EXISTS `homecare_med` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `pasienId` VARCHAR(191) NOT NULL,
  `tanggal` VARCHAR(191) NOT NULL,
  `jamJadwal` VARCHAR(191) NOT NULL,
  `namaObat` VARCHAR(191) NOT NULL,
  `dosis` VARCHAR(191) NOT NULL,
  `rute` VARCHAR(191) NOT NULL,
  `statusMinum` VARCHAR(191) NOT NULL DEFAULT 'Belum Diminum',
  `jamRealisasi` VARCHAR(191) NULL,
  `keterangan` TEXT NULL,
  `alertAlergi` BOOLEAN NOT NULL DEFAULT FALSE,
  `inputByPerawat` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT `fk_hc_med_pasien` FOREIGN KEY (`pasienId`) REFERENCES `pasien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Tabel Home Care: Paraf Digital Keluarga Pasien
CREATE TABLE IF NOT EXISTS `homecare_paraf` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `pasienId` VARCHAR(191) NOT NULL,
  `tanggalKunjungan` VARCHAR(191) NOT NULL,
  `namaKeluarga` VARCHAR(191) NOT NULL,
  `hubunganKeluarga` VARCHAR(191) NOT NULL,
  `tandaTanganSvg` LONGTEXT NOT NULL,
  `catatanKeluarga` TEXT NULL,
  `perawatBertugas` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT `fk_hc_paraf_pasien` FOREIGN KEY (`pasienId`) REFERENCES `pasien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- SEED DATA AWAL (Initial Sample Clinical Data)
-- =========================================================================

INSERT IGNORE INTO `users` (`id`, `nama`, `username`, `role`, `strNip`, `status`) VALUES
('USR-001', 'Ns. Hendra Wijaya, S.Kep., CWCCA', 'hendra_nurse', 'Perawat', '19870514 201101 1 003', 'Aktif'),
('USR-002', 'dr. Farhan Malik, Sp.B, FICS', 'farhan_doc', 'Dokter', '31.1.1.100.2.19.12345', 'Aktif'),
('USR-003', 'Kolifah, S.E. (Admin Home Care)', 'admin_kolifah', 'Admin', '19850312 201001 2 005', 'Aktif'),
('USR-004', 'Ns. Maya Anjani, S.Kep', 'maya_nurse', 'Perawat', '19920821 201503 2 007', 'Aktif');

INSERT IGNORE INTO `pasien` (`id`, `noRm`, `nik`, `nama`, `tanggalLahir`, `jenisKelamin`, `alamat`, `noHp`, `pekerjaan`, `golonganDarah`, `riwayatPenyakit`, `riwayatAlergi`, `statusKunjungan`, `tanggalDaftar`, `diagnosisMedisUtama`) VALUES
('PAS-001', 'RM-2026-0012', '6474011208650001', 'Bpk. Budi Santoso', '1965-08-12', 'Laki-laki', 'Jl. Ahmad Yani No. 45, Bontang Selatan', '0812-5544-3321', 'Pensiunan Swasta', 'O', '["Diabetes Melitus Tipe 2", "Hipertensi Grade 1"]', 'Alergi Plester Karet (Latex)', 'Sedang Diperiksa', '2026-10-15', 'Diabetic Foot Ulcer Pedis Dextra Wagner Grade 3'),
('PAS-002', 'RM-2026-0015', '6474025405780003', 'Ibu Siti Rahmawati', '1978-05-14', 'Perempuan', 'Jl. Pupuk Raya Blok D-12, Bontang Barat', '0813-4789-2210', 'Ibu Rumah Tangga', 'B', '["Insufisiensi Vena Kronis"]', 'Tidak Ada', 'Antrean', '2026-10-20', 'Ulkus Venosum Cruris Sinistra'),
('PAS-003', 'RM-2026-0021', '6474010303520002', 'Bpk. H. Ahmad Dahlan', '1952-03-03', 'Laki-laki', 'Jl. Brigjen Katamso No. 19, Bontang Utara', '0852-9988-1122', 'Pensiunan Guru', 'A', '["Stroke Iskemik (Tirah Baring Lama)", "Hipertensi"]', 'Antibiotik Golongan Penisilin', 'Jadwal Kontrol', '2026-10-25', 'Pressure Injury Regio Sakrum Stadium 3'),
('PAS-004', 'RM-2026-0028', '6474031911950004', 'Sdr. Rizky Maulana', '1995-11-19', 'Laki-laki', 'Jl. Imam Bonjol No. 88, Bontang Utara', '0821-3344-9001', 'Karyawan Swasta', 'AB', 'Tidak ada riwayat', 'Tidak Ada', 'Antrean', '2026-11-01', 'Vulnus Laceratum Antebrachii Sinistra Post Debridement');

