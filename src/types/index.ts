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

