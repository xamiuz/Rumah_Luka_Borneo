'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { 
  Home, 
  Clock, 
  Utensils, 
  Pill, 
  UserCheck, 
  PlusCircle, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  FileText, 
  Check, 
  X,
  User,
  ArrowRight
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import { JadwalJagaHomecare, JadwalMakanHomecare, JadwalObatHomecare, ShiftHomecare } from '@/types';

function HomecareContent() {
  const { 
    currentUser, 
    switchRole, 
    patients, 
    users, 
    homecareJaga, 
    homecareMeals, 
    homecareMeds,
    addHomecareJaga,
    updateHomecareJaga,
    deleteHomecareJaga,
    addHomecareMeal,
    updateHomecareMeal,
    deleteHomecareMeal,
    addHomecareMed,
    updateHomecareMed,
    deleteHomecareMed,
    addCPPT
  } = useClinic();

  const [activeTab, setActiveTab] = useState<'jaga' | 'makan' | 'obat'>('jaga');
  
  // Default to Bpk. H. Ahmad Dahlan (classic Home Care patient) or first patient
  const defaultHomecarePatient = patients.find((p) => p.nama.includes('Ahmad Dahlan')) || patients[0];
  const [selectedPasienId, setSelectedPasienId] = useState<string>(
    defaultHomecarePatient ? defaultHomecarePatient.id : ''
  );

  const selectedPatient = patients.find((p) => p.id === selectedPasienId);

  // Filtered data for selected patient
  const patientJaga = homecareJaga.filter((j) => j.pasienId === selectedPasienId);
  const patientMeals = homecareMeals.filter((m) => m.pasienId === selectedPasienId);
  const patientMeds = homecareMeds.filter((m) => m.pasienId === selectedPasienId);

  // Modal States
  const [showJagaModal, setShowJagaModal] = useState(false);
  const [editingJaga, setEditingJaga] = useState<JadwalJagaHomecare | null>(null);

  const [showMealModal, setShowMealModal] = useState(false);
  const [showMedModal, setShowMedModal] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Form State: Jadwal Jaga (Admin)
  const [jagaTanggal, setJagaTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [jagaShift, setJagaShift] = useState<ShiftHomecare>('Pagi (07:00 - 14:00)');
  const [jagaPerawat, setJagaPerawat] = useState(users.find((u) => u.role === 'Perawat')?.nama || 'Ns. Maya Anjani, S.Kep');
  const [jagaStatus, setJagaStatus] = useState<JadwalJagaHomecare['statusJaga']>('Terjadwal');
  const [jagaCatatan, setJagaCatatan] = useState('');

  // Form State: Jadwal Makan (Perawat)
  const [mealTanggal, setMealTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [mealWaktu, setMealWaktu] = useState<JadwalMakanHomecare['waktuMakan']>('Sarapan Pagi (07:00)');
  const [mealMenu, setMealMenu] = useState('');
  const [mealTarget, setMealTarget] = useState('TKTP (Tinggi Kalori Tinggi Protein) + Ekstrak Albumin');
  const [mealCatatan, setMealCatatan] = useState('');

  // Form State: Jadwal Obat (Perawat)
  const [medTanggal, setMedTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [medJam, setMedJam] = useState('07:00');
  const [medNama, setMedNama] = useState('');
  const [medDosis, setMedDosis] = useState('1 Tablet (Oral)');
  const [medAturan, setMedAturan] = useState<JadwalObatHomecare['aturanMinum']>('Sesudah Makan');
  const [medCatatan, setMedCatatan] = useState('');

  const isAdmin = currentUser.role === 'Admin';
  const isNurse = currentUser.role === 'Perawat';

  // Handlers: Jadwal Jaga (Admin Only)
  const handleOpenJagaModal = (jaga?: JadwalJagaHomecare) => {
    if (jaga) {
      setEditingJaga(jaga);
      setJagaTanggal(jaga.tanggal);
      setJagaShift(jaga.shift);
      setJagaPerawat(jaga.perawatJaga);
      setJagaStatus(jaga.statusJaga);
      setJagaCatatan(jaga.catatanAdmin || '');
    } else {
      setEditingJaga(null);
      setJagaTanggal(new Date().toISOString().split('T')[0]);
      setJagaShift('Pagi (07:00 - 14:00)');
      setJagaPerawat(users.find((u) => u.role === 'Perawat')?.nama || 'Ns. Maya Anjani, S.Kep');
      setJagaStatus('Terjadwal');
      setJagaCatatan('');
    }
    setShowJagaModal(true);
  };

  const handleSaveJaga = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    if (editingJaga) {
      updateHomecareJaga(editingJaga.id, {
        tanggal: jagaTanggal,
        shift: jagaShift,
        perawatJaga: jagaPerawat,
        statusJaga: jagaStatus,
        catatanAdmin: jagaCatatan,
      });
    } else {
      addHomecareJaga({
        pasienId: selectedPatient.id,
        namaPasien: selectedPatient.nama,
        noRm: selectedPatient.noRm,
        alamatPasien: selectedPatient.alamat,
        tanggal: jagaTanggal,
        shift: jagaShift,
        perawatJaga: jagaPerawat,
        statusJaga: jagaStatus,
        catatanAdmin: jagaCatatan,
        createdBy: `${currentUser.nama} (${currentUser.role})`,
      });
    }

    setShowJagaModal(false);
  };

  // Handlers: Jadwal Makan (Perawat)
  const handleSaveMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !mealMenu) return;

    addHomecareMeal({
      pasienId: selectedPatient.id,
      tanggal: mealTanggal,
      waktuMakan: mealWaktu,
      menuDiet: mealMenu,
      targetNutrisi: mealTarget,
      porsiDimakan: 'Belum Diberikan',
      status: 'Belum Diberikan',
      perawatInput: currentUser.nama,
      catatan: mealCatatan,
    });

    setMealMenu('');
    setMealCatatan('');
    setShowMealModal(false);
  };

  const handleToggleMealStatus = (mealId: string, currentStatus: JadwalMakanHomecare['status']) => {
    const newStatus = currentStatus === 'Sudah Diberikan' ? 'Belum Diberikan' : 'Sudah Diberikan';
    const currentTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WITA';
    updateHomecareMeal(mealId, {
      status: newStatus,
      jamRealisasi: newStatus === 'Sudah Diberikan' ? currentTime : undefined,
      porsiDimakan: newStatus === 'Sudah Diberikan' ? 'Habis (100%)' : 'Belum Diberikan',
      perawatInput: currentUser.nama,
    });
  };

  // Handlers: Jadwal Obat (Perawat)
  const handleSaveMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !medNama) return;

    addHomecareMed({
      pasienId: selectedPatient.id,
      tanggal: medTanggal,
      jamObat: medJam,
      namaObat: medNama,
      dosisRute: medDosis,
      aturanMinum: medAturan,
      status: 'Belum Diminum',
      perawatInput: currentUser.nama,
      catatanKhusus: medCatatan,
    });

    setMedNama('');
    setMedCatatan('');
    setShowMedModal(false);
  };

  const handleToggleMedStatus = (medId: string, currentStatus: JadwalObatHomecare['status']) => {
    const newStatus = currentStatus === 'Sudah Diminum' ? 'Belum Diminum' : 'Sudah Diminum';
    const currentTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WITA';
    updateHomecareMed(medId, {
      status: newStatus,
      jamDiminum: newStatus === 'Sudah Diminum' ? currentTime : undefined,
      perawatInput: currentUser.nama,
    });
  };

  // Sinkronisasi ke Lembar CPPT SOAP
  const handleSyncToCPPT = () => {
    if (!selectedPatient) return;

    const mealsGiven = patientMeals.filter((m) => m.status === 'Sudah Diberikan').length;
    const medsGiven = patientMeds.filter((m) => m.status === 'Sudah Diminum').length;

    addCPPT({
      pasienId: selectedPatient.id,
      profesi: 'Perawat',
      namaTenagaMedis: currentUser.nama,
      soap: {
        subjective: `Laporan kunjungan Home Care harian. Pasien tirah baring posisi diatur nyaman, tidak mengeluh sesak napas. Nafsu makan terjaga (${mealsGiven}/${patientMeals.length} jadwal makan terpenuhi).`,
        objective: `Kondisi umum stabil. Terpasang balutan modern wound care di rumah. Kepatuhan minum obat harian: ${medsGiven}/${patientMeds.length} obat telah diminum sesuai instruksi dosis.`,
        assessment: `Pemulihan luka kronis & dekubitus dalam program Home Care terpadu. Nutrisi dan medikasi terkontrol.`,
        plan: `1. Lanjutkan jadwal jaga perawat home care. 2. Repositioning miring kanan-kiri tiap 2 jam. 3. Monitor asupan diet tinggi protein (albumin). 4. Jadwal ganti balutan berikutnya sesuai rencana.`,
      },
      instruksiPPA: `Edukasi keluarga untuk tetap menjaga kebersihan linen kasur anti-dekubitus dan memastikan hidrasi harian tercukupi.`,
    });

    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 3000);
  };

  return (
    <div className="w-full px-8 py-6 space-y-6">
      {/* Top Header with Role Switcher Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Home className="w-5 h-5 text-blue-600" />
            <span>Layanan Home Care & Monitoring Terpadu</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Penjadwalan perawat jaga oleh Admin klinik, serta pencatatan jadwal makan dan pemberian obat harian oleh Perawat.
          </p>
        </div>

        {/* Role Capsule & Fast Switcher */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-xs self-start lg:self-auto">
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Login Sebagai:</span>
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-purple-600' : 'bg-blue-600'}`} />
              <span>{currentUser.nama}</span>
              <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">
                {currentUser.role}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
            <button
              type="button"
              onClick={() => switchRole('Admin')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition ${
                isAdmin 
                  ? 'bg-purple-600 text-white shadow-xs' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
              }`}
            >
              Mode Admin
            </button>
            <button
              type="button"
              onClick={() => switchRole('Perawat')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition ${
                isNurse 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
              }`}
            >
              Mode Perawat
            </button>
          </div>
        </div>
      </div>

      {/* Patient Selector Capsule */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Pilih Pasien Home Care:</label>
          <select
            value={selectedPasienId}
            onChange={(e) => setSelectedPasienId(e.target.value)}
            className="text-xs font-semibold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-800 min-w-[280px]"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama} ({p.noRm}) - {p.diagnosisMedisUtama}
              </option>
            ))}
          </select>
        </div>

        {selectedPatient && (
          <div className="text-xs text-slate-600 flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedPatient.alamat}</span>
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono">{selectedPatient.noHp}</span>
            </span>
            {selectedPatient.riwayatAlergi && selectedPatient.riwayatAlergi !== 'Tidak Ada' && (
              <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[11px]">
                Alergi: {selectedPatient.riwayatAlergi}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Sync Success Banner */}
      {syncSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Rangkuman kunjungan, jadwal makan, dan kepatuhan obat berhasil disinkronkan ke Catatan CPPT SOAP!</span>
          </div>
          <Link href={`/rekam-medis?pasienId=${selectedPasienId}`} className="text-emerald-800 font-bold underline">
            Buka Lembar CPPT &rarr;
          </Link>
        </div>
      )}

      {/* 3 Main Action Tabs */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Tab Headers */}
        <div className="p-3 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('jaga')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'jaga'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>1. Jadwal Jaga Perawat ({patientJaga.length})</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-mono">Admin</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('makan')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'makan'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>2. Jadwal Makan & Nutrisi ({patientMeals.length})</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-mono">Perawat</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('obat')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'obat'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Pill className="w-4 h-4" />
              <span>3. Jadwal Minum Obat MAR ({patientMeds.length})</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-mono">Perawat</span>
            </button>
          </div>

          {/* Quick Action Button based on Active Tab */}
          <div>
            {activeTab === 'jaga' && (
              <button
                type="button"
                onClick={() => handleOpenJagaModal()}
                disabled={!isAdmin}
                title={!isAdmin ? 'Hanya Admin yang berwenang menjadwalkan perawat jaga' : undefined}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition shadow-xs flex items-center gap-1.5 ${
                  isAdmin 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Jadwalkan Perawat Jaga (Admin)</span>
              </button>
            )}

            {activeTab === 'makan' && (
              <button
                type="button"
                onClick={() => setShowMealModal(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shadow-xs flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Input Jadwal Makan (Perawat)</span>
              </button>
            )}

            {activeTab === 'obat' && (
              <button
                type="button"
                onClick={() => setShowMedModal(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shadow-xs flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Input Jadwal Obat (Perawat)</span>
              </button>
            )}
          </div>
        </div>

        {/* Role Helper Banner */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>
              {activeTab === 'jaga' && (
                isAdmin 
                  ? 'Mode Admin Aktif: Anda memiliki hak penuh untuk menambah, mengubah (edit), dan menukar perawat jaga.'
                  : 'Mode Perawat: Penjadwalan jaga diinput oleh Admin. Silakan lihat shift tugas Anda di bawah.'
              )}
              {activeTab === 'makan' && 'Diinput oleh Perawat yang bertugas di rumah pasien: catat menu diet tinggi protein dan porsi makanan yang dihabiskan.'}
              {activeTab === 'obat' && 'Diinput oleh Perawat jaga: Medication Administration Record (MAR). Klik tombol centang setelah obat selesai diminumkan ke pasien.'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSyncToCPPT}
            className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 underline"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Salin Ringkasan ke CPPT SOAP</span>
          </button>
        </div>

        {/* TAB 1: JADWAL JAGA PERAWAT */}
        {activeTab === 'jaga' && (
          <div className="p-5">
            {patientJaga.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                Belum ada jadwal perawat jaga untuk pasien ini.
                {isAdmin && (
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenJagaModal()}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Klik di sini untuk mengatur jadwal jaga perawat pertama
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patientJaga.map((item) => {
                  const statusColor = {
                    'Terjadwal': 'bg-blue-50 text-blue-800 border-blue-200',
                    'Sedang Bertugas': 'bg-emerald-50 text-emerald-800 border-emerald-200',
                    'Selesai': 'bg-slate-100 text-slate-700 border-slate-200',
                    'Tukar Jaga': 'bg-amber-50 text-amber-800 border-amber-200',
                    'Dibatalkan': 'bg-rose-50 text-rose-800 border-rose-200',
                  }[item.statusJaga];

                  return (
                    <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3 hover:border-blue-300 transition">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">
                            {item.tanggal}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 mt-1">{item.shift}</h4>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusColor}`}>
                          {item.statusJaga}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1 text-xs">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-blue-600" />
                          <strong className="text-slate-900">{item.perawatJaga}</strong>
                        </div>
                        {item.perawatPengganti && (
                          <div className="text-[11px] text-amber-700">
                            Pengganti: <strong>{item.perawatPengganti}</strong>
                          </div>
                        )}
                        <p className="text-[11px] text-slate-600 mt-1">
                          Catatan: {item.catatanAdmin || 'Perawatan luka berkala & repositioning'}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-slate-400">Oleh: {item.createdBy}</span>
                        {isAdmin ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenJagaModal(item)}
                              className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-md transition flex items-center gap-1 shadow-2xs"
                            >
                              <Edit3 className="w-3 h-3 text-blue-600" />
                              <span>Edit / Tukar Jaga</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm('Hapus jadwal jaga ini?')) deleteHomecareJaga(item.id);
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Hanya Admin dapat edit</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: JADWAL MAKAN & NUTRISI */}
        {activeTab === 'makan' && (
          <div className="p-5 space-y-3">
            {patientMeals.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                Belum ada jadwal makan harian untuk pasien ini.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {patientMeals.map((meal) => (
                  <div key={meal.id} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/50 p-2 rounded-lg transition">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                          {meal.waktuMakan}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">({meal.tanggal})</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          meal.status === 'Sudah Diberikan' 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {meal.status}
                        </span>
                        {meal.jamRealisasi && (
                          <span className="text-[11px] text-emerald-700 font-mono">
                            Realisasi: {meal.jamRealisasi}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-800 font-semibold mt-1">
                        Menu: <span className="text-slate-900">{meal.menuDiet}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-3">
                        <span>Target: <strong className="text-blue-700">{meal.targetNutrisi}</strong></span>
                        <span>Porsi: <strong className="text-slate-800">{meal.porsiDimakan}</strong></span>
                        <span>PIC: {meal.perawatInput}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleMealStatus(meal.id, meal.status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
                          meal.status === 'Sudah Diberikan'
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{meal.status === 'Sudah Diberikan' ? 'Telah Diberikan' : 'Tandai Diberikan'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Hapus jadwal makan ini?')) deleteHomecareMeal(meal.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: JADWAL MINUM OBAT (MAR) */}
        {activeTab === 'obat' && (
          <div className="p-5 space-y-3">
            {patientMeds.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                Belum ada jadwal obat yang diinput untuk pasien ini.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {patientMeds.map((med) => (
                  <div key={med.id} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/50 p-2 rounded-lg transition">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold bg-purple-50 text-purple-900 px-2 py-0.5 rounded border border-purple-200">
                          {med.jamObat} WITA
                        </span>
                        <strong className="text-xs text-slate-900">{med.namaObat}</strong>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          med.status === 'Sudah Diminum' 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {med.status}
                        </span>
                        {med.jamDiminum && (
                          <span className="text-[11px] text-emerald-700 font-mono">
                            Diminum: {med.jamDiminum}
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-600 flex items-center gap-4 flex-wrap mt-1">
                        <span>Dosis/Rute: <strong className="text-slate-800">{med.dosisRute}</strong></span>
                        <span>Aturan: <strong className="text-blue-700">{med.aturanMinum}</strong></span>
                        <span>Pencatat: {med.perawatInput}</span>
                      </div>
                      {med.catatanKhusus && (
                        <p className="text-[10px] text-slate-500 italic mt-0.5">
                          Instruksi: {med.catatanKhusus}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleMedStatus(med.id, med.status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
                          med.status === 'Sudah Diminum'
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{med.status === 'Sudah Diminum' ? 'Telah Diminum' : 'Tandai Diminum'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Hapus jadwal obat ini?')) deleteHomecareMed(med.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL 1: ATUR JADWAL JAGA PERAWAT (ADMIN ONLY) */}
      {showJagaModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  {editingJaga ? 'Edit / Tukar Jadwal Jaga Perawat' : 'Jadwalkan Perawat Jaga Home Care'}
                </h3>
                <p className="text-[11px] text-slate-500">Kewenangan Administrator untuk mengatur penugasan shift</p>
              </div>
              <button
                type="button"
                onClick={() => setShowJagaModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJaga} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tanggal Tugas *</label>
                <input
                  type="date"
                  required
                  value={jagaTanggal}
                  onChange={(e) => setJagaTanggal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Shift Jaga *</label>
                <select
                  value={jagaShift}
                  onChange={(e) => setJagaShift(e.target.value as ShiftHomecare)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Pagi (07:00 - 14:00)">Pagi (07:00 - 14:00)</option>
                  <option value="Sore (14:00 - 21:00)">Sore (14:00 - 21:00)</option>
                  <option value="Malam (21:00 - 07:00)">Malam (21:00 - 07:00)</option>
                  <option value="Kunjungan Harian (Visit)">Kunjungan Harian (Visit)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tugaskan Perawat Jaga *</label>
                <select
                  value={jagaPerawat}
                  onChange={(e) => setJagaPerawat(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {users.filter((u) => u.role === 'Perawat').map((u) => (
                    <option key={u.id} value={u.nama}>
                      {u.nama} {u.strNip ? `(NIP: ${u.strNip.split(' ')[0]})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status Penugasan</label>
                <select
                  value={jagaStatus}
                  onChange={(e) => setJagaStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Terjadwal">Terjadwal</option>
                  <option value="Sedang Bertugas">Sedang Bertugas</option>
                  <option value="Tukar Jaga">Tukar Jaga</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Khusus dari Admin</label>
                <textarea
                  rows={2}
                  value={jagaCatatan}
                  onChange={(e) => setJagaCatatan(e.target.value)}
                  placeholder="Misal: Perawat wajib bawa perban kompresi dan cek albumin..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowJagaModal(false)}
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                >
                  Simpan Jadwal Jaga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: INPUT JADWAL MAKAN & NUTRISI (PERAWAT) */}
      {showMealModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Input Jadwal Makan & Nutrisi Pasien</h3>
                <p className="text-[11px] text-slate-500">Pencatatan asupan diet oleh Perawat Home Care</p>
              </div>
              <button
                type="button"
                onClick={() => setShowMealModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMeal} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tanggal Makan *</label>
                <input
                  type="date"
                  required
                  value={mealTanggal}
                  onChange={(e) => setMealTanggal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Waktu Makan *</label>
                <select
                  value={mealWaktu}
                  onChange={(e) => setMealWaktu(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Sarapan Pagi (07:00)">Sarapan Pagi (07:00)</option>
                  <option value="Snack Pagi (10:00)">Snack Pagi (10:00)</option>
                  <option value="Makan Siang (12:30)">Makan Siang (12:30)</option>
                  <option value="Snack Sore (16:00)">Snack Sore (16:00)</option>
                  <option value="Makan Malam (19:00)">Makan Malam (19:00)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Menu Makanan & Diet *</label>
                <input
                  type="text"
                  required
                  value={mealMenu}
                  onChange={(e) => setMealMenu(e.target.value)}
                  placeholder="Contoh: Bubur saring + sari ikan gabus + telur rebus"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Nutrisi Luka</label>
                <input
                  type="text"
                  value={mealTarget}
                  onChange={(e) => setMealTarget(e.target.value)}
                  placeholder="Contoh: TKTP (Tinggi Protein) untuk granulasi jaringan"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Perawat</label>
                <input
                  type="text"
                  value={mealCatatan}
                  onChange={(e) => setMealCatatan(e.target.value)}
                  placeholder="Instruksi posisi duduk semi-fowler atau pantau minum..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowMealModal(false)}
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                >
                  Simpan Jadwal Makan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: INPUT JADWAL OBAT (PERAWAT) */}
      {showMedModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Input Jadwal Obat Pasien (MAR)</h3>
                <p className="text-[11px] text-slate-500">Daftar pemberian obat oral dan injeksi oleh Perawat</p>
              </div>
              <button
                type="button"
                onClick={() => setShowMedModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMed} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal *</label>
                  <input
                    type="date"
                    required
                    value={medTanggal}
                    onChange={(e) => setMedTanggal(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Pemberian *</label>
                  <input
                    type="time"
                    required
                    value={medJam}
                    onChange={(e) => setMedJam(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Obat *</label>
                <input
                  type="text"
                  required
                  value={medNama}
                  onChange={(e) => setMedNama(e.target.value)}
                  placeholder="Contoh: Ciprofloxacin 500mg / Metformin 500mg"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dosis & Rute *</label>
                  <input
                    type="text"
                    required
                    value={medDosis}
                    onChange={(e) => setMedDosis(e.target.value)}
                    placeholder="Contoh: 1 Tablet (Oral)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Aturan Minum</label>
                  <select
                    value={medAturan}
                    onChange={(e) => setMedAturan(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Sebelum Makan">Sebelum Makan</option>
                    <option value="Sesudah Makan">Sesudah Makan</option>
                    <option value="Bersama Makanan">Bersama Makanan</option>
                    <option value="Saat Nyeri">Saat Nyeri</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Khusus Perawat</label>
                <input
                  type="text"
                  value={medCatatan}
                  onChange={(e) => setMedCatatan(e.target.value)}
                  placeholder="Misal: Ditelan utuh dengan air putih, awasi efek mual..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowMedModal(false)}
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                >
                  Simpan Jadwal Obat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomecarePage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-slate-400">Memuat modul Home Care...</div>}>
      <HomecareContent />
    </Suspense>
  );
}
