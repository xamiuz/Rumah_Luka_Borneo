'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Pasien, 
  JadwalPerawatan, 
  User, 
  AsesmenLuka, 
  CatatanCPPT, 
  Role,
  JadwalJagaHomecare,
  JadwalMakanHomecare,
  JadwalObatHomecare,
  FotoPerkembanganLuka,
  ParafKunjunganHomecare 
} from '@/types';
import { 
  INITIAL_PATIENTS, 
  INITIAL_SCHEDULES, 
  INITIAL_USERS, 
  INITIAL_CPPT,
  INITIAL_HOMECARE_JAGA,
  INITIAL_HOMECARE_MEALS,
  INITIAL_HOMECARE_MEDS,
  INITIAL_WOUND_PHOTOS,
  INITIAL_PARAF_HOMECARE
} from '@/lib/mock-data';

interface ClinicContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: Role) => void;
  users: User[];
  patients: Pasien[];
  schedules: JadwalPerawatan[];
  cpptRecords: CatatanCPPT[];
  homecareJaga: JadwalJagaHomecare[];
  homecareMeals: JadwalMakanHomecare[];
  homecareMeds: JadwalObatHomecare[];
  woundPhotos: FotoPerkembanganLuka[];
  parafHomecare: ParafKunjunganHomecare[];
  addPatient: (patient: Omit<Pasien, 'id' | 'noRm' | 'tanggalDaftar'>) => Pasien;
  updatePatient: (id: string, updated: Partial<Pasien>) => void;
  addAssessment: (pasienId: string, assessment: Omit<AsesmenLuka, 'id' | 'tanggal'>) => AsesmenLuka;
  addCPPT: (cppt: Omit<CatatanCPPT, 'id' | 'tanggalWaktu'>) => void;
  addSchedule: (schedule: Omit<JadwalPerawatan, 'id'>) => void;
  updateScheduleStatus: (id: string, status: JadwalPerawatan['status']) => void;
  deletePatient: (id: string) => void;
  addHomecareJaga: (jaga: Omit<JadwalJagaHomecare, 'id'>) => void;
  updateHomecareJaga: (id: string, updated: Partial<JadwalJagaHomecare>) => void;
  deleteHomecareJaga: (id: string) => void;
  addHomecareMeal: (meal: Omit<JadwalMakanHomecare, 'id'>) => void;
  updateHomecareMeal: (id: string, updated: Partial<JadwalMakanHomecare>) => void;
  deleteHomecareMeal: (id: string) => void;
  addHomecareMed: (med: Omit<JadwalObatHomecare, 'id'>) => void;
  updateHomecareMed: (id: string, updated: Partial<JadwalObatHomecare>) => void;
  deleteHomecareMed: (id: string) => void;
  addWoundPhoto: (photo: Omit<FotoPerkembanganLuka, 'id'>) => void;
  deleteWoundPhoto: (id: string) => void;
  addParafHomecare: (paraf: Omit<ParafKunjunganHomecare, 'id'>) => void;
  resetAllData: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export function ClinicProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [patients, setPatients] = useState<Pasien[]>(INITIAL_PATIENTS);
  const [schedules, setSchedules] = useState<JadwalPerawatan[]>(INITIAL_SCHEDULES);
  const [cpptRecords, setCpptRecords] = useState<CatatanCPPT[]>(INITIAL_CPPT);
  const [homecareJaga, setHomecareJaga] = useState<JadwalJagaHomecare[]>(INITIAL_HOMECARE_JAGA);
  const [homecareMeals, setHomecareMeals] = useState<JadwalMakanHomecare[]>(INITIAL_HOMECARE_MEALS);
  const [homecareMeds, setHomecareMeds] = useState<JadwalObatHomecare[]>(INITIAL_HOMECARE_MEDS);
  const [woundPhotos, setWoundPhotos] = useState<FotoPerkembanganLuka[]>(INITIAL_WOUND_PHOTOS);
  const [parafHomecare, setParafHomecare] = useState<ParafKunjunganHomecare[]>(INITIAL_PARAF_HOMECARE);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedPatients = localStorage.getItem('rlb_patients');
      if (savedPatients) setPatients(JSON.parse(savedPatients));

      const savedSchedules = localStorage.getItem('rlb_schedules');
      if (savedSchedules) setSchedules(JSON.parse(savedSchedules));

      const savedCppt = localStorage.getItem('rlb_cppt');
      if (savedCppt) setCpptRecords(JSON.parse(savedCppt));

      const savedUser = localStorage.getItem('rlb_active_user');
      if (savedUser) setCurrentUser(JSON.parse(savedUser));

      const savedJaga = localStorage.getItem('rlb_hc_jaga');
      if (savedJaga) setHomecareJaga(JSON.parse(savedJaga));

      const savedMeals = localStorage.getItem('rlb_hc_meals');
      if (savedMeals) setHomecareMeals(JSON.parse(savedMeals));

      const savedMeds = localStorage.getItem('rlb_hc_meds');
      if (savedMeds) setHomecareMeds(JSON.parse(savedMeds));

      const savedPhotos = localStorage.getItem('rlb_wound_photos');
      if (savedPhotos) setWoundPhotos(JSON.parse(savedPhotos));

      const savedParaf = localStorage.getItem('rlb_paraf_homecare');
      if (savedParaf) setParafHomecare(JSON.parse(savedParaf));
    } catch {
      // Fallback to initial data if error
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('rlb_patients', JSON.stringify(patients));
      localStorage.setItem('rlb_schedules', JSON.stringify(schedules));
      localStorage.setItem('rlb_cppt', JSON.stringify(cpptRecords));
      localStorage.setItem('rlb_active_user', JSON.stringify(currentUser));
      localStorage.setItem('rlb_hc_jaga', JSON.stringify(homecareJaga));
      localStorage.setItem('rlb_hc_meals', JSON.stringify(homecareMeals));
      localStorage.setItem('rlb_hc_meds', JSON.stringify(homecareMeds));
      localStorage.setItem('rlb_wound_photos', JSON.stringify(woundPhotos));
      localStorage.setItem('rlb_paraf_homecare', JSON.stringify(parafHomecare));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [patients, schedules, cpptRecords, currentUser, homecareJaga, homecareMeals, homecareMeds, woundPhotos, parafHomecare, isLoaded]);

  const switchRole = (role: Role) => {
    const found = users.find((u) => u.role === role) || {
      id: `USR-${Date.now()}`,
      nama: `Petugas ${role}`,
      username: `user_${role.toLowerCase()}`,
      role,
      status: 'Aktif',
    };
    setCurrentUser(found);
  };

  const addPatient = (data: Omit<Pasien, 'id' | 'noRm' | 'tanggalDaftar'>): Pasien => {
    const nextNumber = patients.length + 1;
    const noRm = `RM-2026-${String(nextNumber).padStart(4, '0')}`;
    const newPatient: Pasien = {
      ...data,
      id: `PAS-${Date.now()}`,
      noRm,
      tanggalDaftar: new Date().toISOString().split('T')[0],
      statusKunjungan: 'Antrean',
    };

    setPatients((prev) => [newPatient, ...prev]);
    return newPatient;
  };

  const updatePatient = (id: string, updated: Partial<Pasien>) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
  };

  const addAssessment = (pasienId: string, assessmentData: Omit<AsesmenLuka, 'id' | 'tanggal'>): AsesmenLuka => {
    const newAssessment: AsesmenLuka = {
      ...assessmentData,
      id: `ASM-${Date.now()}`,
      pasienId,
      tanggal: new Date().toISOString(),
    };

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === pasienId) {
          return {
            ...p,
            statusKunjungan: 'Selesai',
            asesmenTerakhir: newAssessment,
          };
        }
        return p;
      })
    );

    // Otomatis tambahkan juga ke CPPT
    const autoCPPT: CatatanCPPT = {
      id: `CPPT-${Date.now()}`,
      pasienId,
      tanggalWaktu: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
      profesi: currentUser.role === 'Dokter' ? 'Dokter' : 'Perawat',
      namaTenagaMedis: currentUser.nama,
      soap: {
        subjective: `Pasien mengeluh nyeri luka skala ${assessmentData.skorNyeri}/10. Luka berlokasi di ${assessmentData.lokasiLuka}.`,
        objective: `Tipe: ${assessmentData.tipeLuka}. Ukuran ${assessmentData.ukuran.panjangCm}x${assessmentData.ukuran.lebarCm} cm, dalam ${assessmentData.ukuran.kedalamanMm} mm. Granulasi ${assessmentData.dasarLuka.persenGranulasi}%, Slough ${assessmentData.dasarLuka.persenSlough}%, Nekrotik ${assessmentData.dasarLuka.persenNekrotik}%. Eksudat: ${assessmentData.eksudat.jumlah} (${assessmentData.eksudat.warna}).`,
        assessment: `Gangguan integritas jaringan b.d ${assessmentData.tipeLuka} (${assessmentData.stadiumLuka}).`,
        plan: `Tindakan: ${assessmentData.tindakanWoundCare.cairanPencuci}. Debridement: ${assessmentData.tindakanWoundCare.teknikDebridement}. Dressing: ${assessmentData.tindakanWoundCare.primaryDressing} & ${assessmentData.tindakanWoundCare.secondaryDressing}. Evaluasi: ${assessmentData.targetEvaluasi}.`,
      },
      instruksiPPA: `Ganti balutan sesuai jadwal. Jaga luka tetap bersih dan kering dari air luar.`,
    };

    setCpptRecords((prev) => [autoCPPT, ...prev]);

    return newAssessment;
  };

  const addCPPT = (data: Omit<CatatanCPPT, 'id' | 'tanggalWaktu'>) => {
    const newRecord: CatatanCPPT = {
      ...data,
      id: `CPPT-${Date.now()}`,
      tanggalWaktu: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
    };
    setCpptRecords((prev) => [newRecord, ...prev]);
  };

  const addSchedule = (data: Omit<JadwalPerawatan, 'id'>) => {
    const newSchedule: JadwalPerawatan = {
      ...data,
      id: `SCH-${Date.now()}`,
    };
    setSchedules((prev) => [newSchedule, ...prev]);
  };

  const updateScheduleStatus = (id: string, status: JadwalPerawatan['status']) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const deletePatient = (id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
    setSchedules((prev) => prev.filter((s) => s.pasienId !== id));
    setCpptRecords((prev) => prev.filter((c) => c.pasienId !== id));
    setHomecareJaga((prev) => prev.filter((j) => j.pasienId !== id));
    setHomecareMeals((prev) => prev.filter((m) => m.pasienId !== id));
    setHomecareMeds((prev) => prev.filter((m) => m.pasienId !== id));
  };

  // Home Care Mutators
  const addHomecareJaga = (data: Omit<JadwalJagaHomecare, 'id'>) => {
    const newJaga: JadwalJagaHomecare = {
      ...data,
      id: `HC-JAGA-${Date.now()}`,
    };
    setHomecareJaga((prev) => [newJaga, ...prev]);
  };

  const updateHomecareJaga = (id: string, updated: Partial<JadwalJagaHomecare>) => {
    setHomecareJaga((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteHomecareJaga = (id: string) => {
    setHomecareJaga((prev) => prev.filter((item) => item.id !== id));
  };

  const addHomecareMeal = (data: Omit<JadwalMakanHomecare, 'id'>) => {
    const newMeal: JadwalMakanHomecare = {
      ...data,
      id: `MEAL-${Date.now()}`,
    };
    setHomecareMeals((prev) => [newMeal, ...prev]);
  };

  const updateHomecareMeal = (id: string, updated: Partial<JadwalMakanHomecare>) => {
    setHomecareMeals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteHomecareMeal = (id: string) => {
    setHomecareMeals((prev) => prev.filter((item) => item.id !== id));
  };

  const addHomecareMed = (data: Omit<JadwalObatHomecare, 'id'>) => {
    const newMed: JadwalObatHomecare = {
      ...data,
      id: `MED-${Date.now()}`,
    };
    setHomecareMeds((prev) => [newMed, ...prev]);
  };

  const updateHomecareMed = (id: string, updated: Partial<JadwalObatHomecare>) => {
    setHomecareMeds((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteHomecareMed = (id: string) => {
    setHomecareMeds((prev) => prev.filter((item) => item.id !== id));
  };

  // Wound Photos Mutators
  const addWoundPhoto = (data: Omit<FotoPerkembanganLuka, 'id'>) => {
    const newPhoto: FotoPerkembanganLuka = {
      ...data,
      id: `FOTO-${Date.now()}`,
    };
    setWoundPhotos((prev) => [newPhoto, ...prev]);
  };

  const deleteWoundPhoto = (id: string) => {
    setWoundPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  // Paraf Home Care Mutator
  const addParafHomecare = (data: Omit<ParafKunjunganHomecare, 'id'>) => {
    const newParaf: ParafKunjunganHomecare = {
      ...data,
      id: `PARAF-${Date.now()}`,
    };
    setParafHomecare((prev) => [newParaf, ...prev]);
  };

  const resetAllData = () => {
    setPatients(INITIAL_PATIENTS);
    setSchedules(INITIAL_SCHEDULES);
    setCpptRecords(INITIAL_CPPT);
    setHomecareJaga(INITIAL_HOMECARE_JAGA);
    setHomecareMeals(INITIAL_HOMECARE_MEALS);
    setHomecareMeds(INITIAL_HOMECARE_MEDS);
    setWoundPhotos(INITIAL_WOUND_PHOTOS);
    setParafHomecare(INITIAL_PARAF_HOMECARE);
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    localStorage.clear();
  };

  return (
    <ClinicContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        users,
        patients,
        schedules,
        cpptRecords,
        homecareJaga,
        homecareMeals,
        homecareMeds,
        woundPhotos,
        parafHomecare,
        addPatient,
        updatePatient,
        addAssessment,
        addCPPT,
        addSchedule,
        updateScheduleStatus,
        deletePatient,
        addHomecareJaga,
        updateHomecareJaga,
        deleteHomecareJaga,
        addHomecareMeal,
        updateHomecareMeal,
        deleteHomecareMeal,
        addHomecareMed,
        updateHomecareMed,
        deleteHomecareMed,
        addWoundPhoto,
        deleteWoundPhoto,
        addParafHomecare,
        resetAllData,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
}

export function useClinic() {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
}

