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
  Stethoscope,
  BadgeCheck,
  Mail,
  ChevronRight,
  LogOut,
  Hospital
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import { Role } from '@/types';
import { useRouter } from 'next/navigation';

export default function KelolaPenggunaPage() {
  const router = useRouter();
  const { 
    users, 
    currentUser, 
    addUser, 
    deleteUser, 
    changePassword, 
    adminResetPassword,
    logout 
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

  const handleLogout = () => {
    if (window.confirm(`Konfirmasi keluar dari akun ${currentUser.nama}?`)) {
      logout();
      router.push('/login');
    }
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 max-w-5xl mx-auto space-y-6">
      {/* Tab Navigation Header (Underline Tabs Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Pengaturan Akun & Kredensial
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola profil pribadi, kata sandi, dan hak akses staf Rumah Luka Borneo.
          </p>
        </div>

        {/* Clean Line Tabs */}
        <div className="flex items-center gap-6 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('profil')}
            className={`pb-2.5 relative transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'profil'
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profil Saya</span>
            {activeTab === 'profil' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manajemen')}
            className={`pb-2.5 relative transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'manajemen'
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Daftar Staf Medis ({users.length})</span>
            {activeTab === 'manajemen' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: PROFIL SAYA (Tampilan List Dokumen Bersih, Tanpa Kotak Bertumpuk) */}
      {activeTab === 'profil' && (
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-2xs">
          {/* Header Row: Profil Pengguna */}
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
                {currentUser.role.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold text-slate-900 truncate">
                    {currentUser.nama}
                  </h2>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Aktif
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="font-mono text-slate-700">@{currentUser.username}</span>
                  <span>•</span>
                  <span className="font-medium text-blue-700">{currentUser.role}</span>
                  {currentUser.strNip && (
                    <>
                      <span>•</span>
                      <span>NIP: {currentUser.strNip}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Tombol Aksi Langsung */}
            <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowChangePassModal(true);
                  setPassFeedback(null);
                  setOldPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-xs transition flex items-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Ganti Password</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="px-3.5 py-2 border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          </div>

          {/* Data List Rows (Gaya Formulir Rinci Bersih Tanpa Kotak-kotak) */}
          <div className="p-6 sm:p-8 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Informasi Kredensial Klinis
            </h3>

            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4 text-xs">
              <div className="sm:border-r sm:border-slate-100 pr-4">
                <dt className="text-slate-400 font-medium mb-1">Nomor STR / NIP Petugas</dt>
                <dd className="font-semibold text-slate-900 font-mono text-sm">{currentUser.strNip || '-'}</dd>
              </div>

              <div className="sm:border-r sm:border-slate-100 pr-4">
                <dt className="text-slate-400 font-medium mb-1">ID Pengenal Petugas (Sistem)</dt>
                <dd className="font-semibold text-slate-900 font-mono text-sm">{currentUser.id}</dd>
              </div>

              <div>
                <dt className="text-slate-400 font-medium mb-1">Hak Akses Klinis (RBAC)</dt>
                <dd className="font-semibold text-blue-700 text-sm">{currentUser.role}</dd>
              </div>
            </dl>

            <div className="pt-4 border-t border-slate-100">
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4 text-xs">
                <div className="sm:border-r sm:border-slate-100 pr-4">
                  <dt className="text-slate-400 font-medium mb-1">Fasilitas Pelayanan Kesehatan</dt>
                  <dd className="font-medium text-slate-800">Rumah Luka Borneo (Truly Health Care)</dd>
                </div>

                <div className="sm:border-r sm:border-slate-100 pr-4">
                  <dt className="text-slate-400 font-medium mb-1">Status Sesi Rekam Medis</dt>
                  <dd className="font-medium text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Terverifikasi Aktif
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-400 font-medium mb-1">Zona Waktu Operasional</dt>
                  <dd className="font-medium text-slate-800 font-mono">WITA (UTC+8)</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Baris Bawah: Catatan Keamanan Rekam Medis */}
          <div className="p-6 bg-slate-50/60 flex items-start gap-3 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              Seluruh asesmen luka, catatan CPPT, dan tindakan home care yang Anda buat terhubung langsung dengan tanda tangan digital akun ini. Klik tombol <strong>Ganti Password</strong> jika ingin memperbarui sandi login Anda.
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAJEMEN TENAGA MEDIS */}
      {activeTab === 'manajemen' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-600">
              Menampilkan <strong className="text-slate-900">{users.length}</strong> akun staf medis terdaftar.
            </p>
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <UserPlus className="w-4 h-4" />
              <span>{showAddForm ? 'Tutup Formulir' : '+ Tambah Tenaga Medis'}</span>
            </button>
          </div>

          {/* Form Registrasi Petugas Baru */}
          {showAddForm && (
            <div className="bg-white rounded-xl border border-blue-200 p-6 shadow-xs space-y-4">
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
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
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
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
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
              <div className={`p-3.5 rounded-lg text-xs flex items-start gap-2.5 ${
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
          <div className="w-full max-w-sm bg-white rounded-xl shadow-xl border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
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
