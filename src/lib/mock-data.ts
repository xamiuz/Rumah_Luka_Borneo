import { 
  Pasien, 
  JadwalPerawatan, 
  User, 
  CatatanCPPT,
  JadwalJagaHomecare,
  JadwalMakanHomecare,
  JadwalObatHomecare,
  FotoPerkembanganLuka,
  ParafKunjunganHomecare 
} from '@/types';

export const INITIAL_USERS: User[] = [
  {
    id: 'USR-ADMIN',
    nama: 'Administrator Utama',
    username: 'admin',
    password: '123',
    role: 'Admin',
    strNip: 'ADM-RLB-001',
    noHp: '0812-5544-3321',
    email: 'admin@rumahlukaborneo.id',
    status: 'Aktif',
  },
];

export const INITIAL_PATIENTS: Pasien[] = [];

export const INITIAL_SCHEDULES: JadwalPerawatan[] = [];

export const INITIAL_CPPT: CatatanCPPT[] = [];

export const INITIAL_HOMECARE_JAGA: JadwalJagaHomecare[] = [];

export const INITIAL_HOMECARE_MEALS: JadwalMakanHomecare[] = [];

export const INITIAL_HOMECARE_MEDS: JadwalObatHomecare[] = [];

export const INITIAL_WOUND_PHOTOS: FotoPerkembanganLuka[] = [];

export const INITIAL_PARAF_HOMECARE: ParafKunjunganHomecare[] = [];
