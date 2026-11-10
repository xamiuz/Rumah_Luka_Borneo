'use client';

import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Check, 
  KeyRound, 
  Trash2, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  User as UserIcon, 
  X,
  Building2,
  Calendar,
  Clock,
  Shield,
  Activity,
  Stethoscope,
  FileText,
  BadgeCheck,
  Smartphone
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import { Role, User } from '@/types';

export default function KelolaPenggunaPage() {
  const { 
    users, 
    currentUser, 
    addUser, 
    deleteUser, 
    changePassword, 
    adminResetPassword 
  } = useClinic();

  const [activeTab, setActiveTab] = useState<'profil' | 'manajemen'>('profil');
  const [showAddForm, setShowAddForm] = useState(false);

  // Popout / Modal Ganti Password Pribadi
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passFeedback, setPassFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Form Tambah Staf Medis
  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [initialPassword, setInitialPassword] = useState('123');
  const [role, setRole] = useState<Role>('Perawat');
  const [strNip, setStrNip] = useState('');

  // Admin Reset Modal
  const [resetModalUser, setResetModalUser] = useState<{ id: string; nama: string; username: string } | null>(null);
  const [adminNewPass, setAdminNewPass] = useState('');
  const [adminResetMsg, setAdminResetMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Handle Ganti Password Pribadi
  const handleChangeMyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassFeedback(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPassFeedback({ type: 'error', message: 'Semua kolom password wajib diisi.' });
      return;
    }

    if (newPassword.length < 3) {
      setPassFeedback({ type: 'error', message: 'Password baru minimal 3 karakter.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassFeedback({ type: 'error', message: 'Konfirmasi password baru tidak cocok.' });
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await changePassword(oldPassword, newPassword);
      if (res.success) {
        setPassFeedback({ type: 'success', message: 'Password akun Anda berhasil diperbarui.' });
        setTimeout(() => {
          setShowChangePassModal(false);
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setPassFeedback(null);
        }, 1200);
      } else {
        setPassFeedback({ type: 'error', message: res.message || 'Gagal mengubah password.' });
      }
    } catch {
      setPassFeedback({ type: 'error', message: 'Terjadi kesalahan sistem saat memperbarui password.' });
    } finally {
      setIsChangingPass(false);
    }
  };

  // Handle Tambah Petugas
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !username) {
      alert('Nama dan username wajib diisi');
      return;
    }

    if (users.some((u) => u.username.toLowerCase() === username.trim().toLowerCase())) {
      alert(`Username "${username}" sudah digunakan.`);
      return;
    }

    addUser({
      nama,
      username: username.trim(),
      password: initialPassword || '123',
      role,
      strNip: strNip || '-',
      status: 'Aktif',
    });

    setNama('');
    setUsername('');
    setInitialPassword('123');
    setStrNip('');
    setShowAddForm(false);
  };

  // Handle Admin Reset Password Petugas Lain
  const handleAdminResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalUser || !adminNewPass) return;

    if (adminNewPass.length < 3) {
      setAdminResetMsg({ type: 'error', message: 'Password baru minimal 3 karakter.' });
      return;
    }

    const res = await adminResetPassword(resetModalUser.id, adminNewPass);
    if (res.success) {
      setAdminResetMsg({ type: 'success', message: `Password @${resetModalUser.username} berhasil direset.` });
      setTimeout(() => {
        setResetModalUser(null);
        setAdminNewPass('');
        setAdminResetMsg(null);
      }, 1200);
    } else {
      setAdminResetMsg({ type: 'error', message: res.message || 'Gagal mereset password.' });
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Manajemen Akun & Kredensial
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              Klinik EHR
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pengaturan profil tenaga medis, pembaruan kata sandi, dan pengelolaan hak akses staf Rumah Luka Borneo.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold self-start sm:self-auto shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('profil')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profil'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Profil Saya</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manajemen')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'manajemen'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Daftar Staf Medis ({users.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PROFIL SAYA (Desain Card Elegan, Proporsional & Terpadu) */}
      {activeTab === 'profil' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Identity Card (Spans 2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Header Decorative Banner */}
              <div className="h-28 bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 px-6 sm:px-8 relative flex items-end">
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 backdrop-blur-md text-white text-[11px] font-medium rounded-lg border border-white/20">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Sesi Terautentikasi</span>
                  </span>
                </div>
              </div>

              {/* Avatar & Quick Details */}
              <div className="px-6 sm:px-8 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-6">
                  <div className="flex items-end gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-md border border-slate-200 shrink-0">
                      <div className="w-full h-full rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-inner">
                        {currentUser.role.charAt(0)}
                      </div>
                    </div>
                    <div className="mb-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase ${
                          currentUser.role === 'Admin'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : currentUser.role === 'Dokter'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {currentUser.role}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Akun Aktif
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1 truncate">
                        {currentUser.nama}
                      </h2>
                      <p className="text-xs text-slate-500 font-mono">@{currentUser.username}</p>
                    </div>
                  </div>

                  {/* Popout Change Password Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowChangePassModal(true);
                      setPassFeedback(null);
                      setOldPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 self-start sm:self-auto"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Ganti Password Akun</span>
                  </button>
                </div>

                {/* Structured Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-slate-100 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Nomor STR / NIP</span>
                    </div>
                    <p className="font-semibold text-slate-800 text-sm font-mono">{currentUser.strNip || '-'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Shield className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">ID Pengenal Sistem</span>
                    </div>
                    <p className="font-semibold text-slate-800 text-sm font-mono">{currentUser.id}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Fasilitas Pelayanan</span>
                    </div>
                    <p className="font-semibold text-slate-800 text-sm">Rumah Luka Borneo (Truly Health Care)</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Kualifikasi Klinis</span>
                    </div>
                    <p className="font-semibold text-slate-800 text-sm">
                      {currentUser.role === 'Perawat' ? 'Certified Wound Care Clinician (CWCCA)' : currentUser.role === 'Dokter' ? 'Spesialis Bedah / Penanggung Jawab' : 'Koordinator Pelayanan & Administrasi'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Compliance & Clinical Audit Trail Notice */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3.5 text-xs text-slate-600">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="leading-relaxed">
                <span className="font-bold text-slate-800">Integritas Rekam Medis Elektronik (EHR):</span> Akun Anda tercatat secara otomatis pada setiap dokumentasi pengkajian luka (BWAT/PUSH), verifikasi rekam medis CPPT terintegrasi, dan pemberian tindakan home care. Jaga kerahasiaan kata sandi Anda dan selalu lakukan logout saat meninggalkan meja perawat/klinik.
              </div>
            </div>
          </div>

          {/* Right Sidebar: Security & Session Overview */}
          <div className="space-y-6">
            {/* Keamanan Akun Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Lock className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Keamanan Kredensial</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-500">Kekuatan Kata Sandi</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">Aman</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-500">Status Autentikasi</span>
                  <span className="font-medium text-slate-800">Login Kredensial</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-500">Zona Waktu Sesi</span>
                  <span className="font-mono text-slate-800 font-semibold">WITA (UTC+8)</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Akses Database</span>
                  <span className="font-medium text-slate-800">MySQL & Fallback Lokal</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowChangePassModal(true);
                  setPassFeedback(null);
                  setOldPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                <span>Buka Popout Ganti Sandi</span>
              </button>
            </div>

            {/* Tim Medis Quick Glance */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">Staf Terdaftar</h3>
                </div>
                <span className="text-xs font-bold text-blue-600 font-mono">{users.length} Orang</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Kelola hak akses dokter, spesialis perawatan luka, dan admin klinik melalui tab <strong>Daftar Staf Medis</strong>.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('manajemen')}
                className="w-full py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-lg transition text-center cursor-pointer"
              >
                Lihat Semua Petugas &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAJEMEN TENAGA MEDIS & HAK AKSES */}
      {activeTab === 'manajemen' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-600">
              Menampilkan <strong className="text-slate-900">{users.length}</strong> akun staf medis terdaftar di klinik.
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <UserPlus className="w-4 h-4" />
              <span>{showAddForm ? 'Tutup Formulir' : '+ Tambah Tenaga Medis'}</span>
            </button>
          </div>

          {/* Form Registrasi Petugas Baru */}
          {showAddForm && (
            <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-sm space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-slate-900">Registrasi Akun Tenaga Medis / Staf Baru</h2>
                <p className="text-xs text-slate-500">Tentukan kredensial login, peran klinis, dan password awal petugas.</p>
              </div>

              <form onSubmit={handleAddUser} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                    <input
                      type="text"
                      required
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Contoh: Ns. Ahmad Ridwan, S.Kep., CWCCA"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Username Login *</label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Contoh: ahmad_nurse"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Password Awal *</label>
                    <input
                      type="text"
                      required
                      value={initialPassword}
                      onChange={(e) => setInitialPassword(e.target.value)}
                      placeholder="Default: 123"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Peran / Hak Akses (RBAC) *</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as Role)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Perawat">Perawat (CWCCA / Wound Care Specialist)</option>
                      <option value="Dokter">Dokter (Sp.B / Umum Penanggung Jawab)</option>
                      <option value="Admin">Admin (Home Care Coordinator / Keuangan)</option>
                      <option value="Petugas Administrasi">Petugas Administrasi / Rekam Medis</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nomor STR / NIP Petugas</label>
                    <input
                      type="text"
                      value={strNip}
                      onChange={(e) => setStrNip(e.target.value)}
                      placeholder="Contoh: 19890123 201502 1 004"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-lg transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-xs cursor-pointer"
                  >
                    Simpan Petugas Medis
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tabel Pengguna */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Nama Lengkap & NIP</th>
                    <th className="py-3 px-4">Username</th>
                    <th className="py-3 px-4">Peran (Role)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Status Sesi</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => {
                    const isCurrent = currentUser.id === u.id || currentUser.username === u.username;
                    return (
                      <tr key={u.id} className={`hover:bg-slate-50/70 transition ${isCurrent ? 'bg-blue-50/40' : ''}`}>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{u.nama}</div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {u.strNip || 'Tanpa STR/NIP'}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-700">
                          @{u.username}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                            u.role === 'Admin'
                              ? 'bg-purple-100 text-purple-800'
                              : u.role === 'Dokter'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {u.role}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            {u.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          {isCurrent ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-600 text-white font-bold text-[10px] rounded-full">
                              <Check className="w-3 h-3" /> Akun Aktif Anda
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">Offline</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setResetModalUser({ id: u.id, nama: u.nama, username: u.username });
                                setAdminNewPass('');
                                setAdminResetMsg(null);
                              }}
                              title="Reset Password Petugas"
                              className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition cursor-pointer flex items-center gap-1 border border-slate-200 hover:border-blue-300"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-medium hidden sm:inline">Reset Sandi</span>
                            </button>

                            {!isCurrent && users.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Yakin ingin menghapus akun ${u.nama}?`)) {
                                    deleteUser(u.id);
                                  }
                                }}
                                title="Hapus Akun"
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL / POPOUT GANTI PASSWORD PRIBADI */}
      {showChangePassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Ganti Password Akun</h3>
                  <p className="text-xs text-slate-500">Akun: {currentUser.nama}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowChangePassModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Feedback Alert */}
            {passFeedback && (
              <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                passFeedback.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}>
                {passFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                )}
                <div className="leading-relaxed font-medium">{passFeedback.message}</div>
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleChangeMyPassword} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Password Saat Ini *
                </label>
                <div className="relative">
                  <input
                    type={showOldPass ? 'text' : 'password'}
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Masukkan password Anda saat ini"
                    className="w-full px-3 py-2 pr-9 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showOldPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Password Baru *
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 3 karakter"
                    className="w-full px-3 py-2 pr-9 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Konfirmasi Password Baru *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang password baru Anda"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowChangePassModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-lg transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{isChangingPass ? 'Menyimpan...' : 'Perbarui Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Reset Password Modal */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Reset Sandi Petugas</h3>
                <p className="text-[11px] text-slate-500 truncate max-w-[200px]">{resetModalUser.nama}</p>
              </div>
            </div>

            {adminResetMsg && (
              <div className={`p-3 rounded-lg text-xs ${
                adminResetMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {adminResetMsg.message}
              </div>
            )}

            <form onSubmit={handleAdminResetPassword} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Password Baru untuk @{resetModalUser.username} *
                </label>
                <input
                  type="text"
                  required
                  value={adminNewPass}
                  onChange={(e) => setAdminNewPass(e.target.value)}
                  placeholder="Ketik password baru (misal: 123)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  className="px-3.5 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-lg transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-xs cursor-pointer"
                >
                  Terapkan Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
