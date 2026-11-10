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
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  adminResetPassword: (userId: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  setCurrentUser: (user: User) => void;
  switchUser: (user: User) => void;
  switchRole: (role: Role) => void;
  users: User[];
  addUser: (user: Omit<User, 'id'>) => User;
  updateUser: (id: string, updated: Partial<User>) => void;
  deleteUser: (id: string) => void;
  patients: Pasien[];
  schedules: JadwalPerawatan[];
  cpptRecords: CatatanCPPT[];
  homecareJaga: JadwalJagaHomecare[];
  homecareMeals: JadwalMakanHomecare[];
  homecareMeds: JadwalObatHomecare[];
  woundPhotos: FotoPerkembanganLuka[];
  parafHomecare: ParafKunjunganHomecare[];
  dbStatus: 'connected' | 'offline' | 'checking';
  refreshDb: () => Promise<void>;
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
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
  const [dbStatus, setDbStatus] = useState<'connected' | 'offline' | 'checking'>('checking');

  // Load data function: checks MySQL first, falls back to localStorage
  const refreshDb = async () => {
    try {
      const healthRes = await fetch('/api/health');
      const healthData = await healthRes.json();

      if (healthData.status === 'connected') {
        setDbStatus('connected');
        // Load from MySQL
        const [usersRes, pasienRes, cpptRes, jadwalRes, hcRes] = await Promise.all([
          fetch('/api/users').then((r) => r.json()).catch(() => null),
          fetch('/api/pasien').then((r) => r.json()).catch(() => null),
          fetch('/api/cppt').then((r) => r.json()).catch(() => null),
          fetch('/api/jadwal').then((r) => r.json()).catch(() => null),
          fetch('/api/homecare').then((r) => r.json()).catch(() => null),
        ]);

        if (usersRes?.success && usersRes.data?.length > 0) {
          setUsers(usersRes.data);
        }
        if (pasienRes?.success && pasienRes.data?.length > 0) {
          setPatients(pasienRes.data);
        }
        if (cpptRes?.success && cpptRes.data?.length > 0) {
          setCpptRecords(cpptRes.data);
        }
        if (jadwalRes?.success && jadwalRes.data?.length > 0) {
          setSchedules(jadwalRes.data);
        }
        if (hcRes?.success && hcRes.data) {
          if (hcRes.data.jaga?.length > 0) setHomecareJaga(hcRes.data.jaga);
          if (hcRes.data.meals?.length > 0) setHomecareMeals(hcRes.data.meals);
          if (hcRes.data.meds?.length > 0) setHomecareMeds(hcRes.data.meds);
          if (hcRes.data.photos?.length > 0) setWoundPhotos(hcRes.data.photos);
          if (hcRes.data.paraf?.length > 0) setParafHomecare(hcRes.data.paraf);
        }
      } else {
        setDbStatus('offline');
        loadFromLocalStorage();
      }
    } catch {
      setDbStatus('offline');
      loadFromLocalStorage();
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const savedUsers = localStorage.getItem('rlb_users');
      if (savedUsers) setUsers(JSON.parse(savedUsers));

      const savedPatients = localStorage.getItem('rlb_patients');
      if (savedPatients) setPatients(JSON.parse(savedPatients));

      const savedSchedules = localStorage.getItem('rlb_schedules');
      if (savedSchedules) setSchedules(JSON.parse(savedSchedules));

      const savedCppt = localStorage.getItem('rlb_cppt');
      if (savedCppt) setCpptRecords(JSON.parse(savedCppt));

      const savedUser = localStorage.getItem('rlb_active_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed && parsed.id) {
            setCurrentUser(parsed);
            setIsAuthenticated(true);
          }
        } catch {}
      } else {
        // Check if there is an explicit auth token or session
        const authStatus = localStorage.getItem('rlb_auth_status');
        if (authStatus === 'unauthenticated') {
          setIsAuthenticated(false);
        }
      }

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
    }
  };

  // On initial mount
  useEffect(() => {
    refreshDb().finally(() => setIsLoaded(true));
  }, []);

  // Sync to localStorage as offline safety backup
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('rlb_users', JSON.stringify(users));
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
  }, [users, patients, schedules, cpptRecords, currentUser, homecareJaga, homecareMeals, homecareMeds, woundPhotos, parafHomecare, isLoaded]);

  const switchUser = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('rlb_active_user', JSON.stringify(user));
      localStorage.setItem('rlb_auth_status', 'authenticated');
    } catch {}
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    // 1. Try MySQL API first if connected
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setCurrentUser(data.data);
        setIsAuthenticated(true);
        localStorage.setItem('rlb_active_user', JSON.stringify(data.data));
        localStorage.setItem('rlb_auth_status', 'authenticated');
        return { success: true };
      } else if (res.status !== 500) {
        // User not found or bad password from DB
        return { success: false, message: data.message || 'Username atau password salah' };
      }
    } catch {}

    // 2. Fallback to local users state
    const target = users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());
    if (!target) {
      return { success: false, message: 'Username tidak terdaftar dalam sistem.' };
    }
    if (target.status !== 'Aktif') {
      return { success: false, message: 'Akun Anda sedang dinonaktifkan. Hubungi Administrator.' };
    }
    const expectedPassword = target.password || '123';
    if (password !== expectedPassword) {
      return { success: false, message: 'Password yang Anda masukkan salah.' };
    }

    setCurrentUser(target);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('rlb_active_user', JSON.stringify(target));
      localStorage.setItem('rlb_auth_status', 'authenticated');
    } catch {}
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('rlb_active_user');
      localStorage.setItem('rlb_auth_status', 'unauthenticated');
    } catch {}
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean; message?: string }> => {
    // Verify old password
    const currentPass = currentUser.password || '123';
    if (oldPassword !== currentPass) {
      return { success: false, message: 'Password saat ini salah.' };
    }

    // Try API update
    try {
      await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, oldPassword, newPassword }),
      });
    } catch {}

    // Update in local state
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, password: newPassword } : u))
    );
    const updated = { ...currentUser, password: newPassword };
    setCurrentUser(updated);
    try {
      localStorage.setItem('rlb_active_user', JSON.stringify(updated));
    } catch {}

    return { success: true, message: 'Password berhasil diperbarui.' };
  };

  const adminResetPassword = async (userId: string, newPassword: string): Promise<{ success: boolean; message?: string }> => {
    try {
      await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newPassword }),
      });
    } catch {}

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, password: newPassword } : u))
    );
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, password: newPassword }));
    }

    return { success: true, message: 'Password akun berhasil direset.' };
  };

  const switchRole = (role: Role) => {
    const found = users.find((u) => u.role === role) || {
      id: `USR-${Date.now()}`,
      nama: `Petugas ${role}`,
      username: `user_${role.toLowerCase()}`,
      role,
      status: 'Aktif',
    };
    switchUser(found);
  };

  const addUser = (userData: Omit<User, 'id'>): User => {
    const newUser: User = {
      ...userData,
      id: `USR-${Date.now()}`,
    };

    setUsers((prev) => [...prev, newUser]);

    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    }).catch(() => {});

    return newUser;
  };

  const updateUser = (id: string, updated: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updated } : u))
    );
    if (currentUser.id === id) {
      const merged = { ...currentUser, ...updated };
      setCurrentUser(merged);
      try {
        localStorage.setItem('rlb_active_user', JSON.stringify(merged));
      } catch {}
    }

    // Sync to MySQL API
    fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updated }),
    }).catch(() => {});
  };

  const deleteUser = (id: string) => {
    if (users.length <= 1) {
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (currentUser.id === id) {
      const nextUser = users.find((u) => u.id !== id);
      if (nextUser) switchUser(nextUser);
    }
    fetch(`/api/users?id=${id}`, { method: 'DELETE' }).catch(() => {});
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

    // Sync to MySQL API
    fetch('/api/pasien', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPatient),
    }).catch(() => {});

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

    // Sync Asesmen & CPPT to MySQL API
    fetch('/api/asesmen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pasienId,
        assessmentData,
        perawat: currentUser.nama,
      }),
    }).catch(() => {});

    return newAssessment;
  };

  const addCPPT = (data: Omit<CatatanCPPT, 'id' | 'tanggalWaktu'>) => {
    const newRecord: CatatanCPPT = {
      ...data,
      id: `CPPT-${Date.now()}`,
      tanggalWaktu: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
    };
    setCpptRecords((prev) => [newRecord, ...prev]);

    fetch('/api/cppt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord),
    }).catch(() => {});
  };

  const addSchedule = (data: Omit<JadwalPerawatan, 'id'>) => {
    const newSchedule: JadwalPerawatan = {
      ...data,
      id: `SCH-${Date.now()}`,
    };
    setSchedules((prev) => [newSchedule, ...prev]);

    fetch('/api/jadwal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSchedule),
    }).catch(() => {});
  };

  const updateScheduleStatus = (id: string, status: JadwalPerawatan['status']) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );

    fetch('/api/jadwal', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    }).catch(() => {});
  };

  const deletePatient = (id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
    setSchedules((prev) => prev.filter((s) => s.pasienId !== id));
    setCpptRecords((prev) => prev.filter((c) => c.pasienId !== id));
    setHomecareJaga((prev) => prev.filter((j) => j.pasienId !== id));
    setHomecareMeals((prev) => prev.filter((m) => m.pasienId !== id));
    setHomecareMeds((prev) => prev.filter((m) => m.pasienId !== id));

    fetch(`/api/pasien?id=${id}`, { method: 'DELETE' }).catch(() => {});
  };

  // Home Care Mutators
  const addHomecareJaga = (data: Omit<JadwalJagaHomecare, 'id'>) => {
    const newJaga: JadwalJagaHomecare = {
      ...data,
      id: `HC-JAGA-${Date.now()}`,
    };
    setHomecareJaga((prev) => [newJaga, ...prev]);

    fetch('/api/homecare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addJaga', payload: newJaga }),
    }).catch(() => {});
  };

  const updateHomecareJaga = (id: string, updated: Partial<JadwalJagaHomecare>) => {
    setHomecareJaga((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );

    fetch('/api/homecare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateJaga', payload: { id, data: updated } }),
    }).catch(() => {});
  };

  const deleteHomecareJaga = (id: string) => {
    setHomecareJaga((prev) => prev.filter((item) => item.id !== id));

    fetch('/api/homecare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteJaga', payload: { id } }),
    }).catch(() => {});
  };

  const addHomecareMeal = (data: Omit<JadwalMakanHomecare, 'id'>) => {
    const newMeal: JadwalMakanHomecare = {
      ...data,
      id: `MEAL-${Date.now()}`,
    };
    setHomecareMeals((prev) => [newMeal, ...prev]);

    fetch('/api/homecare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addMeal', payload: newMeal }),
    }).catch(() => {});
  };

  const updateHomecareMeal = (id: string, updated: Partial<JadwalMakanHomecare>) => {
    setHomecareMeals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );

    fetch('/api/homecare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateMeal', payload: { id, data: updated } }),
    }).catch(() => {});
  };

  const deleteHomecareMeal = (id: string) => {
    setHomecareMeals((prev) => prev.filter((item) => item.id !== id));

    fetch('/api/homecare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteMeal', payload: { id } }),
    }).catch(() => {});
  };

  const addHomecareMed = (data: Omit<JadwalObatHomecare, 'id'>) => {
    const newMed: JadwalObatHomecare = {
      ...data,
      id: `MED-${Date.now()}`,
    };
    setHomecareMeds((prev) => [newMed, ...prev]);

    fetch('/api/homecare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addMed', payload: newMed }),
    }).catch(() => {});
  };

  const updateHomecareMed = (id: string, updated: Partial<JadwalObatHomecare>) => {
    setHomecareMeds((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );

    fetch('/api/homecare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateMed', payload: { id, data: updated } }),
    }).catch(() => {});
  };

  const deleteHomecareMed = (id: string) => {
    setHomecareMeds((prev) => prev.filter((item) => item.id !== id));

    fetch('/api/homecare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteMed', payload: { id } }),
    }).catch(() => {});
  };

  // Wound Photos Mutators
  const addWoundPhoto = (data: Omit<FotoPerkembanganLuka, 'id'>) => {
    const newPhoto: FotoPerkembanganLuka = {
      ...data,
      id: `FOTO-${Date.now()}`,
    };
    setWoundPhotos((prev) => [newPhoto, ...prev]);

    fetch('/api/homecare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addPhoto', payload: newPhoto }),
    }).catch(() => {});
  };

  const deleteWoundPhoto = (id: string) => {
    setWoundPhotos((prev) => prev.filter((p) => p.id !== id));

    fetch('/api/homecare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deletePhoto', payload: { id } }),
    }).catch(() => {});
  };

  // Paraf Home Care Mutator
  const addParafHomecare = (data: Omit<ParafKunjunganHomecare, 'id'>) => {
    const newParaf: ParafKunjunganHomecare = {
      ...data,
      id: `PARAF-${Date.now()}`,
    };
    setParafHomecare((prev) => [newParaf, ...prev]);

    fetch('/api/homecare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addParaf', payload: newParaf }),
    }).catch(() => {});
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
    localStorage.clear();
  };

  return (
    <ClinicContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        logout,
        changePassword,
        adminResetPassword,
        setCurrentUser,
        switchUser,
        switchRole,
        users,
        addUser,
        updateUser,
        deleteUser,
        patients,
        schedules,
        cpptRecords,
        homecareJaga,
        homecareMeals,
        homecareMeds,
        woundPhotos,
        parafHomecare,
        dbStatus,
        refreshDb,
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
