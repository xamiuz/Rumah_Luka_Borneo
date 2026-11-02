'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  Users, 
  Clock, 
  CalendarCheck, 
  AlertTriangle, 
  ChevronRight, 
  CheckCircle2, 
  Bandage, 
  FileText,
  UserPlus,
  Stethoscope,
  Calendar
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';

export default function DashboardPage() {
  const { patients, schedules, searchTerm, updateScheduleStatus } = useClinic();
  const [activeTab, setActiveTab] = useState<'semua' | 'antrean' | 'perlu-asesmen'>('semua');

  // Filtered by search and tabs
  const filteredPatients = patients.filter((p) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = p.nama.toLowerCase().includes(q) || p.noRm.toLowerCase().includes(q) || p.nik.includes(q);
      if (!match) return false;
    }
    if (activeTab === 'antrean') {
      return p.statusKunjungan === 'Antrean' || p.statusKunjungan === 'Sedang Diperiksa';
    }
    if (activeTab === 'perlu-asesmen') {
      return !p.asesmenTerakhir;
    }
    return true;
  });

  const antreanCount = patients.filter((p) => p.statusKunjungan === 'Antrean' || p.statusKunjungan === 'Sedang Diperiksa').length;
  const homecareCount = schedules.filter((s) => s.jenisLayanan === 'Home Care').length;
  const perluAsesmenCount = patients.filter((p) => !p.asesmenTerakhir).length;

  return (
    <div className="w-full px-8 py-6 space-y-6">
      {/* Page Header with Action Bar on Right */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Dashboard Perawatan Luka & Rekam Medis (Wound Care EHR)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitoring klinis pasien ulkus diabetik, luka dekubitus, komposisi dasar jaringan (TIME), dan jadwal kontrol.
          </p>
        </div>

        {/* Action Button Placement */}
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
          <Link
            href="/asesmen"
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition border border-slate-300 shadow-xs flex items-center gap-2"
          >
            <Bandage className="w-4 h-4 text-blue-600" />
            <span>Mulai Asesmen Luka</span>
          </Link>
          <Link
            href="/pendaftaran"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shadow-xs flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Registrasi Pasien Baru</span>
          </Link>
        </div>
      </div>

      {/* 4 Clinical KPI Metrics Cards (Full Width Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Antrean Rawat Hari Ini</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-slate-900">{antreanCount}</span>
              <span className="text-xs text-slate-500 font-medium">pasien aktif</span>
            </div>
            <p className="text-[11px] text-blue-600 font-semibold mt-1">Siap tindakan di klinik</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pasien Terdaftar</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-slate-900">{patients.length}</span>
              <span className="text-xs text-slate-500 font-medium">rekam medis</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">Tersimpan dalam sistem</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Jadwal Home Care</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-slate-900">{homecareCount}</span>
              <span className="text-xs text-slate-500 font-medium">kunjungan</span>
            </div>
            <p className="text-[11px] text-amber-600 font-semibold mt-1">Layanan perawatan di rumah</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <CalendarCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Belum Asesmen Luka</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-rose-600">{perluAsesmenCount}</span>
              <span className="text-xs text-slate-500 font-medium">pasien</span>
            </div>
            <p className="text-[11px] text-rose-500 font-semibold mt-1">Memerlukan evaluasi luka awal</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Full-Width Patient Worklist Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Header with Tabs */}
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Daftar Pasien & Status Perkembangan Luka</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih pasien untuk memulai asesmen luka TIME atau meninjau catatan perkembangan CPPT
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('semua')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === 'semua'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Pasien ({patients.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('antrean')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === 'antrean'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Antrean Rawat ({antreanCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('perlu-asesmen')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === 'perlu-asesmen'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Belum Asesmen ({perluAsesmenCount})
            </button>
          </div>
        </div>

        {/* Full-Width Table - Exactly 100% width with Zero Horizontal Scrollbar and Zero Truncation */}
        <div className="w-full">
          <table className="w-full text-left text-xs table-fixed">
            <thead className="bg-slate-50/90 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="w-[18%] px-4 py-3">No. RM & Nama Pasien</th>
                <th className="w-[28%] px-4 py-3">Diagnosa Klinis & Riwayat Alergi</th>
                <th className="w-[18%] px-3 py-3">Komposisi TIME</th>
                <th className="w-[7%] px-2 py-3 text-center">Nyeri</th>
                <th className="w-[11%] px-2 py-3 text-center">Status</th>
                <th className="w-[18%] px-4 py-3 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    Tidak ada pasien yang sesuai filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((p) => {
                  const statusBadge = {
                    'Antrean': 'bg-amber-50 text-amber-800 border-amber-200',
                    'Sedang Diperiksa': 'bg-blue-50 text-blue-800 border-blue-200',
                    'Selesai': 'bg-emerald-50 text-emerald-800 border-emerald-200',
                    'Jadwal Kontrol': 'bg-slate-100 text-slate-700 border-slate-200',
                  }[p.statusKunjungan];

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3.5 align-middle">
                        <div className="font-bold text-sm text-slate-900 leading-snug">
                          {p.nama}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {p.noRm} • {p.jenisKelamin === 'Laki-laki' ? 'L' : 'P'}, {p.tanggalLahir}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 align-middle">
                        <div className="font-semibold text-slate-800 leading-snug break-words">
                          {p.diagnosisMedisUtama}
                        </div>
                        {p.riwayatAlergi && p.riwayatAlergi !== 'Tidak Ada' ? (
                          <div className="mt-1">
                            <span 
                              className="inline-flex items-center gap-1 text-[10px] text-rose-700 font-medium bg-rose-50 px-2 py-0.5 rounded border border-rose-200"
                            >
                              <span className="font-bold shrink-0">Alergi:</span>
                              <span>{p.riwayatAlergi}</span>
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 mt-0.5 block">Tidak ada riwayat alergi</span>
                        )}
                      </td>

                      <td className="px-3 py-3.5 align-middle">
                        {p.asesmenTerakhir ? (
                          <div className="space-y-1">
                            {/* TIME Tissue Bar */}
                            <div className="h-2 rounded-full overflow-hidden flex bg-slate-200 shadow-inner">
                              <div
                                style={{ width: `${p.asesmenTerakhir.dasarLuka.persenGranulasi}%` }}
                                className="bg-red-600 transition-all"
                                title={`Granulasi (Merah): ${p.asesmenTerakhir.dasarLuka.persenGranulasi}%`}
                              />
                              <div
                                style={{ width: `${p.asesmenTerakhir.dasarLuka.persenSlough}%` }}
                                className="bg-amber-400 transition-all"
                                title={`Slough (Kuning): ${p.asesmenTerakhir.dasarLuka.persenSlough}%`}
                              />
                              <div
                                style={{ width: `${p.asesmenTerakhir.dasarLuka.persenNekrotik}%` }}
                                className="bg-slate-900 transition-all"
                                title={`Nekrotik (Hitam): ${p.asesmenTerakhir.dasarLuka.persenNekrotik}%`}
                              />
                              <div
                                style={{ width: `${p.asesmenTerakhir.dasarLuka.persenEpitelisasi}%` }}
                                className="bg-pink-400 transition-all"
                                title={`Epitel (Pink): ${p.asesmenTerakhir.dasarLuka.persenEpitelisasi}%`}
                              />
                            </div>
                            <div className="flex justify-between text-[9px] text-slate-600 font-mono">
                              <span>G: <strong className="text-red-700">{p.asesmenTerakhir.dasarLuka.persenGranulasi}%</strong></span>
                              <span>S: <strong className="text-amber-700">{p.asesmenTerakhir.dasarLuka.persenSlough}%</strong></span>
                              <span>N: <strong className="text-slate-900">{p.asesmenTerakhir.dasarLuka.persenNekrotik}%</strong></span>
                              <span>E: <strong className="text-pink-600">{p.asesmenTerakhir.dasarLuka.persenEpitelisasi}%</strong></span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">
                            Belum ada asesmen
                          </span>
                        )}
                      </td>

                      <td className="px-2 py-3.5 align-middle text-center whitespace-nowrap">
                        {p.asesmenTerakhir ? (
                          <span className="font-mono font-bold text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-800 border border-slate-200">
                            VAS {p.asesmenTerakhir.skorNyeri}/10
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>

                      <td className="px-2 py-3.5 align-middle text-center whitespace-nowrap">
                        <span className={`px-2.5 py-1 text-[10px] font-semibold rounded-md border inline-block ${statusBadge}`}>
                          {p.statusKunjungan}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 align-middle text-right whitespace-nowrap">
                        <div className="flex items-center gap-1.5 justify-end">
                          <Link
                            href={`/asesmen?pasienId=${p.id}`}
                            title="Mulai Asesmen Luka & Peta Tubuh"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded-md transition shadow-xs shrink-0"
                          >
                            <Bandage className="w-3.5 h-3.5" />
                            <span>Asesmen</span>
                          </Link>
                          <Link
                            href={`/rekam-medis?pasienId=${p.id}`}
                            title="Buka Lembar Catatan Perkembangan Pasien (CPPT)"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-300 text-slate-700 text-[11px] font-medium rounded-md hover:bg-slate-50 transition shadow-xs shrink-0"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-500" />
                            <span>CPPT</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section: Full Width Two-Columns for Schedule & Clinical SOP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Schedule Today (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Agenda Kunjungan & Ganti Balutan Hari Ini</h3>
              <p className="text-xs text-slate-500 mt-0.5">Antrean tindakan perawatan luka klinik dan jadwal kunjungan home care</p>
            </div>
            <Link href="/jadwal" className="text-xs text-blue-600 font-bold hover:underline">
              Lihat Kalender Lengkap &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {schedules.map((s) => (
              <div key={s.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                      {s.jam} WITA
                    </span>
                    <strong className="text-xs text-slate-900">{s.namaPasien}</strong>
                    <span className="text-[11px] text-slate-400 font-mono">({s.noRm})</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">{s.jenisLayanan}:</span> {s.catatan}
                  </p>
                  <p className="text-[11px] text-slate-400">PIC: {s.namaPerawat}</p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    s.status === 'Selesai'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {s.status}
                  </span>
                  {s.status !== 'Selesai' && (
                    <button
                      type="button"
                      onClick={() => updateScheduleStatus(s.id, 'Selesai')}
                      className="text-[11px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 font-bold px-2.5 py-1 rounded-md transition flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Selesai</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Clinical SOP & Guidelines (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 shadow-xs p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Stethoscope className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Standar Operasional Prosedur (SOP) Wound Care
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              1. <strong>Pencucian Luka:</strong> Selalu gunakan NaCl 0.9% hangat atau antiseptik berbahan PHMB/Octenidine (rendam 10-15 menit untuk mengeliminasi biofilm).
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              2. <strong>Debridement:</strong> Angkat jaringan slough dan kalus menebal pada tepi luka (cegah epibole).
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              3. <strong>Moisture Balance:</strong> Pilih balutan primer sesuai eksudat (Alginate/Hydrofiber untuk eksudat sedang-tinggi, Hydrogel untuk luka kering).
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Protokol TIME Bersertifikasi CWCCA</span>
            <Link
              href="/asesmen"
              className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
            >
              <span>Form Asesmen</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
