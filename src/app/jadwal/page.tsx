'use client';

import React, { useState } from 'react';
import { 
  CalendarDays, 
  Clock, 
  User, 
  PlusCircle, 
  CheckCircle2, 
  Home, 
  Bandage, 
  Scissors, 
  Check, 
  Search 
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useClinic } from '@/context/ClinicContext';
import { JadwalPerawatan } from '@/types';

export default function JadwalPage() {
  const { schedules, addSchedule, updateScheduleStatus, patients, users } = useClinic();

  const [activeFilter, setActiveFilter] = useState<string>('Semua');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form State
  const [pasienId, setPasienId] = useState<string>(patients.length > 0 ? patients[0].id : '');
  const [tanggalJadwal, setTanggalJadwal] = useState<string>('');
  const [jam, setJam] = useState<string>('09:00');

  React.useEffect(() => {
    setTanggalJadwal(new Date().toISOString().split('T')[0]);
  }, []);
  const [jenisLayanan, setJenisLayanan] = useState<JadwalPerawatan['jenisLayanan']>('Wound Care Klinik');
  const [namaPerawat, setNamaPerawat] = useState<string>(
    users.find((u) => u.role === 'Perawat')?.nama || 'Ns. Hendra Wijaya, S.Kep., CWCCA'
  );
  const [catatan, setCatatan] = useState<string>('');

  const filteredSchedules = schedules.filter((s) => {
    if (activeFilter === 'Semua') return true;
    return s.jenisLayanan === activeFilter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patientObj = patients.find((p) => p.id === pasienId);
    if (!patientObj) {
      alert('Pilih pasien terlebih dahulu.');
      return;
    }

    addSchedule({
      pasienId: patientObj.id,
      namaPasien: patientObj.nama,
      noRm: patientObj.noRm,
      tanggalJadwal,
      jam,
      jenisLayanan,
      namaPerawat,
      status: 'Menunggu',
      catatan: catatan || 'Penggantian balutan steril & pemantauan luka.',
    });

    setCatatan('');
    setShowAddModal(false);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title="Jadwal Perawatan & Kunjungan Home Care"
        subtitle="Manajemen antrean janji temu klinik, penggantian balutan wound care, dan kunjungan home care"
      />

      <main className="p-6 space-y-6 max-w-7xl w-full mx-auto">
        {/* Top Controls Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['Semua', 'Wound Care Klinik', 'Home Care', 'Khitan'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeFilter === tab
                    ? 'bg-[#224b9b] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(!showAddModal)}
            className="px-4 py-2 bg-[#224b9b] text-white font-bold text-xs rounded-lg hover:bg-[#1b3d7e] transition shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Jadwal Perawatan</span>
          </button>
        </div>

        {/* Modal / Form Tambah Jadwal */}
        {showAddModal && (
          <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-md space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
              <CalendarDays className="w-4 h-4 text-[#224b9b]" />
              <h3 className="text-sm font-bold text-slate-800">Form Tambah Jadwal Kunjungan Baru</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pilih Pasien Terdaftar *</label>
                  <select
                    value={pasienId}
                    onChange={(e) => setPasienId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b] bg-white text-slate-800"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nama} ({p.noRm}) - {p.diagnosisMedisUtama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Layanan Medis</label>
                  <select
                    value={jenisLayanan}
                    onChange={(e) => setJenisLayanan(e.target.value as JadwalPerawatan['jenisLayanan'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b] bg-white text-slate-800"
                  >
                    <option value="Wound Care Klinik">Wound Care Klinik</option>
                    <option value="Home Care">Home Care (Kunjungan Rumah)</option>
                    <option value="Khitan">Khitan / Sirkumsisi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Janji Temu</label>
                  <input
                    type="date"
                    required
                    value={tanggalJadwal}
                    onChange={(e) => setTanggalJadwal(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Pelayanan (WITA)</label>
                  <input
                    type="time"
                    required
                    value={jam}
                    onChange={(e) => setJam(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Perawat Penanggung Jawab (PIC)</label>
                  <select
                    value={namaPerawat}
                    onChange={(e) => setNamaPerawat(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b] bg-white"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.nama}>
                        {u.nama} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Tindakan / Deskripsi Rencana</label>
                <input
                  type="text"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Contoh: Penggantian balutan hari ke-3, debridement kalus, edukasi kaki diabetik"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#224b9b] text-white font-bold rounded-lg hover:bg-[#1b3d7e]"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabel Jadwal */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Daftar Jadwal Perawatan</h3>
              <p className="text-xs text-slate-500">Kategori: <strong>{activeFilter}</strong> ({filteredSchedules.length} Jadwal)</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Waktu & Tanggal</th>
                  <th className="px-5 py-3">Nama Pasien & No. RM</th>
                  <th className="px-4 py-3">Jenis Layanan</th>
                  <th className="px-4 py-3">PIC Perawat</th>
                  <th className="px-5 py-3">Rencana Tindakan</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSchedules.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                      Tidak ada jadwal perawatan pada kategori ini.
                    </td>
                  </tr>
                ) : (
                  filteredSchedules.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="font-bold text-slate-900 font-mono text-xs">{item.jam} WITA</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{item.tanggalJadwal}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-900">{item.namaPasien}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">{item.noRm}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold border ${
                          item.jenisLayanan === 'Home Care'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : item.jenisLayanan === 'Khitan'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}>
                          {item.jenisLayanan === 'Home Care' && <Home className="w-3 h-3" />}
                          {item.jenisLayanan === 'Wound Care Klinik' && <Bandage className="w-3 h-3" />}
                          {item.jenisLayanan === 'Khitan' && <Scissors className="w-3 h-3" />}
                          <span>{item.jenisLayanan}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-700 font-medium">
                        {item.namaPerawat}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate" title={item.catatan}>
                        {item.catatan || 'Perawatan berkala'}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                          item.status === 'Selesai'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : item.status === 'Dikonfirmasi'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap space-x-1.5">
                        {item.status !== 'Selesai' ? (
                          <button
                            type="button"
                            onClick={() => updateScheduleStatus(item.id, 'Selesai')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-700 text-white rounded text-[11px] font-semibold hover:bg-emerald-800 transition"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Selesai</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Selesai dirawat</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
