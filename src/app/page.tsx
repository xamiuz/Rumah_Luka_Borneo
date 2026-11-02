'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  Bandage, 
  CalendarCheck, 
  Clock, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Home,
  UserPlus
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useClinic } from '@/context/ClinicContext';

export default function DashboardPage() {
  const { patients, schedules, searchTerm, updatePatient, updateScheduleStatus } = useClinic();

  // Filtered patients based on search
  const filteredPatients = patients.filter((p) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      p.nama.toLowerCase().includes(q) ||
      p.noRm.toLowerCase().includes(q) ||
      p.nik.includes(q)
    );
  });

  const antreanHariIni = patients.filter((p) => p.statusKunjungan === 'Antrean' || p.statusKunjungan === 'Sedang Diperiksa');
  const homecareCount = schedules.filter((s) => s.jenisLayanan === 'Home Care').length;
  const perluAsesmenCount = patients.filter((p) => !p.asesmenTerakhir).length;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header 
        title="Dashboard Pelayanan & Antrean" 
        subtitle="Sistem Rekam Medis Elektronik Terintegrasi Rumah Luka Borneo"
      />

      <main className="p-6 space-y-6 max-w-7xl w-full mx-auto">
        {/* Banner Agenda Klinik */}
        <div className="bg-[#224b9b] text-white rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#1b3d7e]">
          <div>
            <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded text-white tracking-wide uppercase">
              Operasional Klinik Hari Ini
            </span>
            <h2 className="text-xl font-bold mt-2">Pelayanan Wound Care, Home Care & Khitan</h2>
            <p className="text-xs text-blue-100/90 mt-1 max-w-xl">
              Pantau antrean pasien rekam medis, kelola tindakan dressing modern, dan sinkronisasi catatan CPPT dokter & perawat.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/pendaftaran"
              className="px-4 py-2.5 bg-white text-[#224b9b] font-semibold text-xs rounded-lg hover:bg-blue-50 transition shadow-xs flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Daftar Pasien Baru</span>
            </Link>
            <Link
              href="/asesmen"
              className="px-4 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-lg hover:bg-blue-700 transition shadow-xs flex items-center gap-2 border border-blue-400/40"
            >
              <Bandage className="w-4 h-4" />
              <span>Asesmen Luka</span>
            </Link>
          </div>
        </div>

        {/* 4 Statistik Utama */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Antrean Aktif Hari Ini</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{antreanHariIni.length}</h3>
              <p className="text-[11px] text-blue-700 font-medium mt-1">Pasien menunggu & diperiksa</p>
            </div>
            <div className="w-11 h-11 rounded-lg bg-blue-50 text-[#224b9b] flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Total Pasien Terdaftar</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{patients.length}</h3>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">Rekam medis tersimpan</p>
            </div>
            <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Jadwal Home Care</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{homecareCount}</h3>
              <p className="text-[11px] text-slate-600 font-medium mt-1">Kunjungan luar klinik</p>
            </div>
            <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Home className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Belum Asesmen</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{perluAsesmenCount}</h3>
              <p className="text-[11px] text-rose-700 font-medium mt-1">Perlu pemeriksaan awal</p>
            </div>
            <div className="w-11 h-11 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* 2 Kolom Konten: Daftar Pasien Aktif & Jadwal Hari Ini */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri: Tabel Antrean & Pasien */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Daftar Pasien & Rekam Medis Terkini</h3>
                <p className="text-xs text-slate-500">Klik baris untuk melihat riwayat atau mulai tindakan luka</p>
              </div>
              <Link 
                href="/pendaftaran" 
                className="text-xs text-[#224b9b] font-semibold hover:underline flex items-center gap-1"
              >
                <span>Kelola Pasien</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">No. RM & Nama Pasien</th>
                    <th className="px-4 py-3">Diagnosa / Karakteristik Luka</th>
                    <th className="px-4 py-3">Status Kunjungan</th>
                    <th className="px-5 py-3 text-right">Aksi Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-slate-400">
                        Tidak ada pasien ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((p) => {
                      const statusStyles = {
                        'Antrean': 'bg-amber-50 text-amber-800 border-amber-200',
                        'Sedang Diperiksa': 'bg-blue-50 text-blue-800 border-blue-200',
                        'Selesai': 'bg-emerald-50 text-emerald-800 border-emerald-200',
                        'Jadwal Kontrol': 'bg-slate-100 text-slate-700 border-slate-200',
                      }[p.statusKunjungan];

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="font-semibold text-slate-900">{p.nama}</div>
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                              {p.noRm} | {p.jenisKelamin === 'Laki-laki' ? 'L' : 'P'}, {p.tanggalLahir}
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-medium text-slate-800 truncate max-w-[240px]" title={p.diagnosisMedisUtama}>
                              {p.diagnosisMedisUtama}
                            </div>
                            {p.asesmenTerakhir ? (
                              <div className="text-[11px] text-blue-700 font-medium mt-0.5">
                                Granulasi: {p.asesmenTerakhir.dasarLuka.persenGranulasi}% | Nyeri: {p.asesmenTerakhir.skorNyeri}/10
                              </div>
                            ) : (
                              <div className="text-[11px] text-slate-400 italic mt-0.5">
                                Belum ada asesmen klinis
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-block px-2.5 py-1 text-[11px] font-medium rounded border ${statusStyles}`}>
                              {p.statusKunjungan}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                            <Link
                              href={`/asesmen?pasienId=${p.id}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#224b9b] text-white text-[11px] font-semibold rounded hover:bg-[#1a3875] transition shadow-xs"
                            >
                              <Bandage className="w-3 h-3" />
                              <span>Asesmen</span>
                            </Link>
                            <Link
                              href={`/rekam-medis?pasienId=${p.id}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 text-slate-700 text-[11px] font-medium rounded border border-slate-200 hover:bg-slate-200 transition"
                            >
                              <span>CPPT</span>
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Kolom Kanan: Jadwal Kunjungan & Tindakan Hari Ini */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Jadwal Perawatan Hari Ini</h3>
                <p className="text-xs text-slate-500">Kontrol dressing & homecare</p>
              </div>
              <Link 
                href="/jadwal" 
                className="text-xs text-[#224b9b] font-semibold hover:underline"
              >
                Lihat Semua
              </Link>
            </div>

            <div className="p-4 space-y-3 flex-1 overflow-y-auto">
              {schedules.map((item) => (
                <div 
                  key={item.id} 
                  className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded">
                        {item.jam} WITA
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-1">{item.namaPasien}</h4>
                      <p className="text-[11px] text-slate-500">{item.noRm}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      item.status === 'Selesai'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : item.status === 'Dikonfirmasi'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200/80">
                    <span className="font-semibold text-slate-700">{item.jenisLayanan}:</span> {item.catatan || 'Penggantian balutan steril'}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-500 truncate max-w-[140px]">
                      PIC: {item.namaPerawat}
                    </span>
                    {item.status !== 'Selesai' && (
                      <button
                        type="button"
                        onClick={() => updateScheduleStatus(item.id, 'Selesai')}
                        className="text-[10px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 font-semibold px-2 py-0.5 rounded transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Tandai Selesai</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
