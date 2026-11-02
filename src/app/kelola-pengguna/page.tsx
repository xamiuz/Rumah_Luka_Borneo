'use client';

import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  PlusCircle, 
  ShieldCheck, 
  Check, 
  KeyRound, 
  Stethoscope, 
  BadgeCheck 
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useClinic } from '@/context/ClinicContext';
import { User, Role } from '@/types';

export default function KelolaPenggunaPage() {
  const { users, currentUser, setCurrentUser } = useClinic();

  const [localUsers, setLocalUsers] = useState<User[]>(users);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<Role>('Perawat');
  const [strNip, setStrNip] = useState('');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !username) {
      alert('Lengkapi nama dan username');
      return;
    }

    const newUser: User = {
      id: `USR-${Date.now()}`,
      nama,
      username,
      role,
      strNip: strNip || '-',
      status: 'Aktif',
    };

    setLocalUsers([...localUsers, newUser]);
    setNama('');
    setUsername('');
    setStrNip('');
    setShowAddForm(false);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title="Kelola Pengguna & Hak Akses"
        subtitle="Daftar tenaga medis, perawat luka bersertifikasi CWCCA, dokter bedah, dan administrator klinik"
      />

      <main className="p-6 space-y-6 max-w-7xl w-full mx-auto">
        {/* Banner Info */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#224b9b] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Manajemen Hak Akses Rekam Medis</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pengguna yang sedang aktif login: <strong className="text-slate-900">{currentUser.nama}</strong> ({currentUser.role})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-[#224b9b] text-white font-bold text-xs rounded-lg hover:bg-[#1b3d7e] transition shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Petugas Medis</span>
          </button>
        </div>

        {/* Form Tambah Pengguna */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-md space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
              <Users className="w-4 h-4 text-[#224b9b]" />
              <h3 className="text-sm font-bold text-slate-800">Form Registrasi Tenaga Medis / Staf Baru</h3>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Ns. Ahmad Ridwan, S.Kep., CWCCA"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b]"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Peran / Hak Akses (Role)</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b] bg-white"
                  >
                    <option value="Perawat">Perawat (Nurse / Wound Care Specialist)</option>
                    <option value="Dokter">Dokter (General Practitioner / Spesialis)</option>
                    <option value="Admin">Admin (Perekam Medis / Administrator)</option>
                    <option value="Petugas Administrasi">Petugas Administrasi</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor STR / NIP</label>
                  <input
                    type="text"
                    value={strNip}
                    onChange={(e) => setStrNip(e.target.value)}
                    placeholder="Contoh: 19870514 201101 1 003"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#224b9b] text-white font-bold rounded-lg hover:bg-[#1b3d7e]"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabel Petugas */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Daftar Akun Tenaga Medis & Staf</h3>
            <span className="text-xs text-slate-500 font-mono">{localUsers.length} Terdaftar</span>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Nama Petugas Medis</th>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">Peran / Profesi</th>
                  <th className="px-5 py-3">STR / NIP</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Simulasi Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {localUsers.map((u) => {
                  const isCurrent = currentUser.id === u.id || currentUser.username === u.username;

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900">{u.nama}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{u.id}</div>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-600">{u.username}</td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-1 text-[11px] font-semibold rounded border ${
                          u.role === 'Dokter'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : u.role === 'Perawat'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 font-mono text-[11px]">
                        {u.strNip || '-'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {u.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        {isCurrent ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded text-[11px] font-bold border border-emerald-300">
                            <BadgeCheck className="w-3.5 h-3.5" />
                            <span>Sedang Aktif</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setCurrentUser(u)}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium border border-slate-300 transition"
                          >
                            Masuk Sebagai
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
