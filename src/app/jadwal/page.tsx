'use client';

import React, { useState } from 'react';
import { 
  CalendarClock, 
  PlusCircle, 
  CheckCircle2, 
  Home, 
  Bandage, 
  Scissors, 
  Clock, 
  Calendar,
  User,
  Search,
  Filter
} from 'lucide-react';
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
  const [jenisLayanan, setJenisLayanan] = useState<JadwalPerawatan['jenisLayanan']>('Wound Care Klinik');
  const [namaPerawat, setNamaPerawat] = useState<string>(
    users.find((u) => u.role === 'Perawat')?.nama || 'Ns. Hendra Wijaya, S.Kep., CWCCA'
  );
  const [catatan, setCatatan] = useState<string>('');

  React.useEffect(() => {
    setTanggalJadwal(new Date().toISOString().split('T')[0]);
  }, []);

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
      catatan: catatan || 'Ganti balutan steril berkala.',
    });

    setCatatan('');
    setShowAddModal(false);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Jadwal & Antrean Perawatan Luka
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Penjadwalan ganti balutan luka (wound care), kunjungan perawatan di rumah (home care), dan tindakan khitan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Tambah Jadwal Kunjungan</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 flex-wrap">
          {['Semua', 'Wound Care Klinik', 'Home Care', 'Khitan'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeFilter === tab
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-slate-500">
          Total: <strong>{filteredSchedules.length}</strong> Jadwal Kunjungan
        </span>
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Waktu & Tanggal</th>
                <th className="px-5 py-3">Nama Pasien & No. RM</th>
                <th className="px-4 py-3">Jenis Layanan</th>
                <th className="px-4 py-3">PIC Perawat</th>
                <th className="px-5 py-3">Rencana Prosedur</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSchedules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    Tidak ada jadwal perawatan pada kategori ini.
                  </td>
                </tr>
              ) : (
                filteredSchedules.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900 font-mono text-xs">{item.jam} WITA</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{item.tanggalJadwal}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900">{item.namaPasien}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{item.noRm}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
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
                    <td className="px-4 py-4 font-medium text-slate-800">
                      {item.namaPerawat}
                    </td>
                    <td className="px-5 py-4 text-slate-600 max-w-xs truncate" title={item.catatan}>
                      {item.catatan || 'Perawatan berkala'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded border ${
                        item.status === 'Selesai'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : item.status === 'Dikonfirmasi'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      {item.status !== 'Selesai' ? (
                        <button
                          type="button"
                          onClick={() => updateScheduleStatus(item.id, 'Selesai')}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-700 text-white rounded text-[11px] font-semibold hover:bg-emerald-800 transition shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Tandai Selesai</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic font-medium">Selesai Dilayani</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Schedule */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Tambah Jadwal Kunjungan Rawat Baru</h3>
                <p className="text-xs text-slate-500">Pilih pasien dan tentukan tanggal kontrol dressing</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Pasien Terdaftar *</label>
                <select
                  value={pasienId}
                  onChange={(e) => setPasienId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama} ({p.noRm}) - {p.diagnosisMedisUtama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Layanan</label>
                  <select
                    value={jenisLayanan}
                    onChange={(e) => setJenisLayanan(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                  >
                    <option value="Wound Care Klinik">Wound Care Klinik</option>
                    <option value="Home Care">Home Care (Kunjungan Rumah)</option>
                    <option value="Khitan">Khitan / Sirkumsisi</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Pelayanan</label>
                  <input
                    type="time"
                    required
                    value={jam}
                    onChange={(e) => setJam(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tanggal Janji Temu</label>
                <input
                  type="date"
                  required
                  value={tanggalJadwal}
                  onChange={(e) => setTanggalJadwal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Perawat Penanggung Jawab (PIC)</label>
                <select
                  value={namaPerawat}
                  onChange={(e) => setNamaPerawat(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.nama}>
                      {u.nama} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Tindakan / Prosedur</label>
                <input
                  type="text"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Contoh: Penggantian balutan hari ke-3, debridement kalus"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
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
                  className="px-4 py-2 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-950 shadow-xs"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
