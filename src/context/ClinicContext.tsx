'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Pasien, JadwalPerawatan, User, AsesmenLuka, CatatanCPPT, Role } from '@/types';
import { INITIAL_PATIENTS, INITIAL_SCHEDULES, INITIAL_USERS, INITIAL_CPPT } from '@/lib/mock-data';

interface ClinicContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: Role) => void;
  users: User[];
  patients: Pasien[];
  schedules: JadwalPerawatan[];
  cpptRecords: CatatanCPPT[];
  addPatient: (patient: Omit<Pasien, 'id' | 'noRm' | 'tanggalDaftar'>) => Pasien;
  updatePatient: (id: string, updated: Partial<Pasien>) => void;
  addAssessment: (pasienId: string, assessment: Omit<AsesmenLuka, 'id' | 'tanggal'>) => AsesmenLuka;
  addCPPT: (cppt: Omit<CatatanCPPT, 'id' | 'tanggalWaktu'>) => void;
  addSchedule: (schedule: Omit<JadwalPerawatan, 'id'>) => void;
  updateScheduleStatus: (id: string, status: JadwalPerawatan['status']) => void;
  deletePatient: (id: string) => void;
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
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [patients, schedules, cpptRecords, currentUser, isLoaded]);

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
  };

  const resetAllData = () => {
    setPatients(INITIAL_PATIENTS);
    setSchedules(INITIAL_SCHEDULES);
    setCpptRecords(INITIAL_CPPT);
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
        addPatient,
        updatePatient,
        addAssessment,
        addCPPT,
        addSchedule,
        updateScheduleStatus,
        deletePatient,
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

