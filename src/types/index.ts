export type Role = 'Admin' | 'Dokter' | 'Perawat' | 'Petugas Administrasi';

export interface User {
  id: string;
  nama: string;
  username: string;
  role: Role;
  strNip?: string;
  status: 'Aktif' | 'Nonaktif';
}

export type TipeLuka = 
  | 'Ulkus Diabetikum (Diabetic Foot)'
  | 'Luka Tekan (Pressure Injury / Decubitus)'
  | 'Ulkus Venosum / Arteriosum'
  | 'Luka Bedah / Post Operasi'
  | 'Luka Bakar (Combustio)'
  | 'Luka Trauma / Laserasi'
  | 'Luka Kanker';

export interface DasarLuka {
  persenGranulasi: number; // Merah
  persenSlough: number;    // Kuning
  persenNekrotik: number;  // Hitam
  persenEpitelisasi: number; // Pink
}

export interface AsesmenLuka {
  id: string;
  pasienId: string;
  tanggal: string; // ISO format
  perawatPemeriksa: string;
  lokasiLuka: string; // e.g. "Dorsum Pedis Dextra", "Kalkaneus Sinistra", dll.
  lokasiKoordinat?: { x: number; y: number }; // Koordinat pada Body Map
  tipeLuka: TipeLuka;
  stadiumLuka: string;
  ukuran: {
    panjangCm: number;
    lebarCm: number;
    kedalamanMm: number;
    underminingGoaCm?: number;
  };
  dasarLuka: DasarLuka;
  eksudat: {
    jumlah: 'Tidak Ada' | 'Sedikit' | 'Sedang' | 'Banyak';
    warna: 'Serous' | 'Haemoserous' | 'Sanguineous' | 'Purulent (Nanah)';
    bau: 'Tidak Berbau' | 'Khas' | 'Berbau Busuk';
  };
  kulitSekitar: 'Sehat' | 'Maserasi' | 'Eritema / Kemerahan' | 'Kering / Hiperkeratosis' | 'Oedema';
  tepiLuka: 'Menyatu' | 'Menebal / Kalus' | 'Menggulung (Epibole)' | 'Nekrotik';
  tandaInfeksi: {
    dolorNyeri: boolean;
    calorHangat: boolean;
    ruborKemerahan: boolean;
    tumorBengkak: boolean;
    functioLaesa: boolean;
  };
  skorNyeri: number; // 0 - 10 VAS
  tindakanWoundCare: {
    cairanPencuci: string; // e.g. "NaCl 0.9% + PHMB Prontosan"
    teknikDebridement: string; // e.g. "Mechanical & Autolytic Debridement"
    primaryDressing: string; // e.g. "Hydrogel + Calcium Alginate"
    secondaryDressing: string; // e.g. "Polyurethane Foam + Transparent Film"
    terapiTambahan?: string;
  };
  intervensiKeperawatan: string;
  targetEvaluasi: string;
  fotoLukaUrl?: string;
}

export interface Pasien {
  id: string;
  noRm: string; // format: "RM-2026-XXXX"
  nik: string;
  nama: string;
  tanggalLahir: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  alamat: string;
  noHp: string;
  pekerjaan: string;
  golonganDarah: 'A' | 'B' | 'AB' | 'O' | '-';
  riwayatPenyakit: string[]; // DM, Hipertensi, Asam Urat, Penyakit Jantung, Ginjal, dll.
  riwayatAlergi: string;
  statusKunjungan: 'Antrean' | 'Sedang Diperiksa' | 'Selesai' | 'Jadwal Kontrol';
  tanggalDaftar: string;
  diagnosisMedisUtama: string;
  asesmenTerakhir?: AsesmenLuka;
}

export interface CatatanCPPT {
  id: string;
  pasienId: string;
  tanggalWaktu: string;
  profesi: 'Perawat' | 'Dokter';
  namaTenagaMedis: string;
  soap: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  instruksiPPA: string;
}

export interface JadwalPerawatan {
  id: string;
  pasienId: string;
  namaPasien: string;
  noRm: string;
  tanggalJadwal: string;
  jam: string;
  jenisLayanan: 'Wound Care Klinik' | 'Home Care' | 'Khitan';
  namaPerawat: string;
  status: 'Menunggu' | 'Dikonfirmasi' | 'Selesai' | 'Batal';
  catatan?: string;
}

// Modul Home Care Terpadu
export type ShiftHomecare = 
  | 'Pagi (07:00 - 14:00)' 
  | 'Sore (14:00 - 21:00)' 
  | 'Malam (21:00 - 07:00)' 
  | 'Kunjungan Harian (Visit)';

export interface JadwalJagaHomecare {
  id: string;
  pasienId: string;
  namaPasien: string;
  noRm: string;
  alamatPasien: string;
  tanggal: string; // YYYY-MM-DD
  shift: ShiftHomecare;
  perawatJaga: string;
  perawatPengganti?: string;
  statusJaga: 'Terjadwal' | 'Sedang Bertugas' | 'Selesai' | 'Tukar Jaga' | 'Dibatalkan';
  catatanAdmin?: string;
  createdBy: string; // e.g. "Admin Bambang"
}

export interface JadwalMakanHomecare {
  id: string;
  pasienId: string;
  tanggal: string; // YYYY-MM-DD
  waktuMakan: 'Sarapan Pagi (07:00)' | 'Snack Pagi (10:00)' | 'Makan Siang (12:30)' | 'Snack Sore (16:00)' | 'Makan Malam (19:00)';
  menuDiet: string;
  targetNutrisi: string; // e.g. "TKTP (Tinggi Kalori Tinggi Protein) + Rendah Gula"
  porsiDimakan: 'Habis (100%)' | '3/4 Porsi' | '1/2 Porsi' | 'Hanya Sedikit (<1/4)' | 'Menolak Makan' | 'Belum Diberikan';
  status: 'Belum Diberikan' | 'Sudah Diberikan';
  jamRealisasi?: string;
  perawatInput: string;
  catatan?: string;
}

export interface JadwalObatHomecare {
  id: string;
  pasienId: string;
  tanggal: string; // YYYY-MM-DD
  jamObat: string; // e.g. "07:00", "13:00", "19:00", "22:00"
  namaObat: string;
  dosisRute: string; // e.g. "1 Tablet (Oral)", "1 Ampul (IV)"
  aturanMinum: 'Sebelum Makan' | 'Sesudah Makan' | 'Bersama Makanan' | 'Saat Nyeri';
  status: 'Belum Diminum' | 'Sudah Diminum' | 'Ditunda' | 'Menolak';
  jamDiminum?: string;
  perawatInput: string;
  catatanKhusus?: string;
}

// Rekomendasi Fitur Klinis Lanjutan
export interface FotoPerkembanganLuka {
  id: string;
  pasienId: string;
  tanggal: string; // YYYY-MM-DD
  fase: 'Sebelum Tindakan' | 'Sesudah Debridement' | 'Setelah Balutan Selesai';
  dataUrl: string; // Base64 data URL
  catatan?: string;
  perawat: string;
}

export interface ParafKunjunganHomecare {
  id: string;
  pasienId: string;
  tanggal: string;
  namaKeluarga: string;
  hubungan: string; // e.g. "Istri Pasien", "Anak Pasien", "Pasien Sendiri"
  signatureDataUrl: string; // Base64 canvas PNG
  waktuTtd: string;
  perawatJaga: string;
}



