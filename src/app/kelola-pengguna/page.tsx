'use client';

import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Check, 
  BadgeCheck, 
  KeyRound,
  Stethoscope,
  Trash2
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import { User, Role } from '@/types';

export default function KelolaPenggunaPage() {
  const { users, currentUser, switchUser, addUser, deleteUser } = useClinic();
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<Role>('Perawat');
  const [strNip, setStrNip] = useState('');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !username) {
      alert('Nama dan username wajib diisi');
      return;
    }

    addUser({
      nama,
      username,
      role,
      strNip: strNip || '-',
      status: 'Aktif',
    });

    setNama('');
    setUsername('');
    setStrNip('');
    setShowAddForm(false);
  };

  return (
    <div className="w-full px-4 sm:px-6 py-5 space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Manajemen Tenaga Medis & Hak Akses
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pengaturan kredensial perawat spesialis luka CWCCA, dokter bedah, dan administrator klinik.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Tambah Tenaga Medis</span>
        </button>
      </div>

      {/* Form Tambah Petugas */}
      {showAddForm && (
        <div className="bg-white rounded-xl border border-blue-200 p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Registrasi Tenaga Medis / Staf Baru</h2>
            <p className="text-xs text-slate-500">Kredensial login dan nomor STR/NIP resmi</p>
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
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
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
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Peran / Profesi Medis</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                >
                  <option value="Perawat">Perawat (Wound Care Specialist / Nurse)</option>
                  <option value="Dokter">Dokter (Dokter Umum / Spesialis Bedah)</option>
                  <option value="Admin">Administrator Rekam Medis</option>
                  <option value="Petugas Administrasi">Petugas Administrasi</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor STR / NIP</label>
                <input
                  type="text"
                  value={strNip}
                  onChange={(e) => setStrNip(e.target.value)}
                  placeholder="Nomor Surat Tanda Registrasi"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 font-mono"
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
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-xs"
              >
                Simpan Tenaga Medis
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Staff Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Daftar Akun Tenaga Medis Terdaftar</h2>
          <span className="text-xs font-mono font-bold text-slate-500">{users.length} Pengguna</span>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Nama Tenaga Medis</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Profesi / Hak Akses</th>
                <th className="px-5 py-3">Nomor STR / NIP</th>
                <th className="px-4 py-3">Status Akun</th>
                <th className="px-5 py-3 text-right">Simulasi Sesi & Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => {
                const isCurrent = currentUser.id === u.id || currentUser.username === u.username;

                return (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900 text-xs">{u.nama}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{u.id}</div>
                    </td>
                    <td className="px-4 py-4 font-mono text-slate-600">{u.username}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border ${
                        u.role === 'Dokter'
                          ? 'bg-purple-50 text-purple-900 border-purple-200'
                          : u.role === 'Perawat'
                          ? 'bg-blue-50 text-blue-900 border-blue-200'
                          : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px] text-slate-600">
                      {u.strNip || '-'}
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {u.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {isCurrent ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-900 rounded-md text-[11px] font-bold border border-emerald-300">
                            <BadgeCheck className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Sesi Aktif</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => switchUser(u)}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-[11px] font-semibold border border-slate-300 transition"
                          >
                            Ganti ke Akun Ini
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Hapus akun ${u.nama}?`)) {
                              deleteUser(u.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                          title="Hapus Petugas"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
  );
}
