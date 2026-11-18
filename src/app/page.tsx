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
    <div className="w-full px-4 sm:px-6 py-5 space-y-5">
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
        <div className="grid grid-cols-2 sm:flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <Link
            href="/asesmen"
            className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition border border-slate-300 shadow-xs flex items-center justify-center gap-2"
          >
            <Bandage className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Mulai Asesmen</span>
          </Link>
          <Link
            href="/pendaftaran?tambah=true"
            className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4 shrink-0" />
            <span>+ Registrasi Pasien</span>
          </Link>
        </div>
      </div>

      {/* 4 Clinical KPI Metrics Cards (Responsive 2-Col on Mobile, 4-Col on Desktop) */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
        <div className="bg-white p-3.5 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Antrean Hari Ini</p>
            <div className="flex items-baseline gap-1.5 mt-1 sm:mt-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{antreanCount}</span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium">pasien</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-blue-600 font-semibold mt-0.5 truncate">Siap tindakan</p>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pasien</p>
            <div className="flex items-baseline gap-1.5 mt-1 sm:mt-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{patients.length}</span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium">rekam medis</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-emerald-600 font-semibold mt-0.5 truncate">Terdaftar</p>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Home Care</p>
            <div className="flex items-baseline gap-1.5 mt-1 sm:mt-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{homecareCount}</span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium">kunjungan</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-amber-600 font-semibold mt-0.5 truncate">Perawatan rumah</p>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <CalendarCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Belum Asesmen</p>
            <div className="flex items-baseline gap-1.5 mt-1 sm:mt-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-rose-600">{perluAsesmenCount}</span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium">pasien</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-rose-500 font-semibold mt-0.5 truncate">Evaluasi awal</p>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>

      {/* Main Patient Worklist: Mobile Android Cards & Desktop Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Header with Tabs */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Daftar Pasien & Status Perkembangan Luka</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih pasien untuk memulai asesmen luka TIME atau meninjau catatan perkembangan CPPT
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setActiveTab('semua')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                activeTab === 'semua'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({patients.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('antrean')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                activeTab === 'antrean'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Antrean ({antreanCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('perlu-asesmen')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                activeTab === 'perlu-asesmen'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Belum Asesmen ({perluAsesmenCount})
            </button>
          </div>
        </div>

        {/* 1. MOBILE ANDROID VIEW: Native Clinical Cards (block md:hidden) */}
        <div className="block md:hidden p-3 space-y-3 bg-slate-50/50">
          {filteredPatients.length === 0 ? (
            <div className="p-8 text-center text-slate-400 bg-white rounded-xl border border-slate-200 text-xs">
              Tidak ada pasien yang sesuai filter pencarian.
            </div>
          ) : (
            filteredPatients.map((p) => {
              const statusBadge = {
                'Antrean': 'bg-amber-50 text-amber-800 border-amber-200',
                'Sedang Diperiksa': 'bg-blue-50 text-blue-800 border-blue-200',
                'Selesai': 'bg-emerald-50 text-emerald-800 border-emerald-200',
                'Jadwal Kontrol': 'bg-slate-100 text-slate-700 border-slate-200',
              }[p.statusKunjungan];

              return (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-3.5 space-y-2.5">
                  {/* Row 1: Name, No. RM, Gender, Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-bold text-sm text-slate-900 leading-tight">{p.nama}</h3>
                        <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/80">
                          {p.noRm}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {p.jenisKelamin === 'Laki-laki' ? 'L' : 'P'} • Lahir {p.tanggalLahir}
                      </p>
                    </div>

                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border shrink-0 ${statusBadge}`}>
                      {p.statusKunjungan}
                    </span>
                  </div>

                  {/* Row 2: Diagnosis & Alergi */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                    <p className="text-xs font-semibold text-slate-800 leading-snug">
                      {p.diagnosisMedisUtama}
                    </p>
                    {p.riwayatAlergi && p.riwayatAlergi !== 'Tidak Ada' ? (
                      <div>
                        <span className="inline-flex items-center gap-1 text-[10px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <span className="shrink-0">Alergi:</span>
                          <span className="font-normal truncate">{p.riwayatAlergi}</span>
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400">Tidak ada riwayat alergi</span>
                    )}
                  </div>

                  {/* Row 3: TIME Wound Bed & Pain Score */}
                  {p.asesmenTerakhir ? (
                    <div className="space-y-1.5 p-2 bg-slate-50/70 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-slate-700">Dasar Luka (TIME)</span>
                        <span className="font-mono font-bold text-[9px] bg-white px-1.5 py-0.5 rounded text-slate-800 border border-slate-200">
                          VAS {p.asesmenTerakhir.skorNyeri}/10
                        </span>
                      </div>
                      {/* TIME Bar */}
                      <div className="h-2 rounded-full overflow-hidden flex bg-slate-200">
                        <div
                          style={{ width: `${p.asesmenTerakhir.dasarLuka.persenGranulasi}%` }}
                          className="bg-red-600"
                        />
                        <div
                          style={{ width: `${p.asesmenTerakhir.dasarLuka.persenSlough}%` }}
                          className="bg-amber-400"
                        />
                        <div
                          style={{ width: `${p.asesmenTerakhir.dasarLuka.persenNekrotik}%` }}
                          className="bg-slate-900"
                        />
                        <div
                          style={{ width: `${p.asesmenTerakhir.dasarLuka.persenEpitelisasi}%` }}
                          className="bg-pink-400"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-slate-600 font-mono">
                        <span>G:<strong className="text-red-700">{p.asesmenTerakhir.dasarLuka.persenGranulasi}%</strong></span>
                        <span>S:<strong className="text-amber-700">{p.asesmenTerakhir.dasarLuka.persenSlough}%</strong></span>
                        <span>N:<strong className="text-slate-900">{p.asesmenTerakhir.dasarLuka.persenNekrotik}%</strong></span>
                        <span>E:<strong className="text-pink-600">{p.asesmenTerakhir.dasarLuka.persenEpitelisasi}%</strong></span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-400 italic px-1">
                      Belum ada riwayat asesmen luka
                    </div>
                  )}

                  {/* Row 4: Large Android Touch Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                    <Link
                      href={`/asesmen?pasienId=${p.id}`}
                      className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Bandage className="w-3.5 h-3.5" />
                      <span>Asesmen Luka</span>
                    </Link>
                    <Link
                      href={`/rekam-medis?pasienId=${p.id}`}
                      className="py-2.5 px-3 bg-white hover:bg-slate-50 active:scale-98 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>Catatan CPPT</span>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 2. DESKTOP VIEW: High-Density Tabular Table (hidden md:block) */}
        <div className="hidden md:block w-full">
          <table className="w-full text-left text-xs table-fixed">
            <thead className="bg-slate-50/90 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="w-[21%] px-3.5 py-3">No. RM & Nama Pasien</th>
                <th className="w-[31%] px-3.5 py-3">Diagnosa Klinis & Riwayat Alergi</th>
                <th className="w-[21%] px-3 py-3">Status Luka (TIME & Nyeri)</th>
                <th className="w-[11%] px-2 py-3 text-center">Status</th>
                <th className="w-[16%] px-3.5 py-3 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
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
                      <td className="px-3.5 py-3.5 align-middle">
                        <div className="font-bold text-sm text-slate-900 leading-snug">
                          {p.nama}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {p.noRm} • {p.jenisKelamin === 'Laki-laki' ? 'L' : 'P'}, {p.tanggalLahir}
                        </div>
                      </td>

                      <td className="px-3.5 py-3.5 align-middle">
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
                          <div className="space-y-1.5">
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
                            <div className="flex items-center justify-between text-[9px] text-slate-600 font-mono">
                              <div className="flex items-center gap-1.5">
                                <span>G:<strong className="text-red-700">{p.asesmenTerakhir.dasarLuka.persenGranulasi}%</strong></span>
                                <span>S:<strong className="text-amber-700">{p.asesmenTerakhir.dasarLuka.persenSlough}%</strong></span>
                                <span>N:<strong className="text-slate-900">{p.asesmenTerakhir.dasarLuka.persenNekrotik}%</strong></span>
                                <span>E:<strong className="text-pink-600">{p.asesmenTerakhir.dasarLuka.persenEpitelisasi}%</strong></span>
                              </div>
                              <span className="font-mono font-bold text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 border border-slate-200 shrink-0">
                                VAS {p.asesmenTerakhir.skorNyeri}/10
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">
                            Belum ada asesmen
                          </span>
                        )}
                      </td>

                      <td className="px-2 py-3.5 align-middle text-center whitespace-nowrap">
                        <span className={`px-2 py-1 text-[10px] font-semibold rounded-md border inline-block ${statusBadge}`}>
                          {p.statusKunjungan}
                        </span>
                      </td>

                      <td className="px-3.5 py-3.5 align-middle text-right whitespace-nowrap">
                        <div className="flex items-center gap-1 justify-end">
                          <Link
                            href={`/asesmen?pasienId=${p.id}`}
                            title="Mulai Asesmen Luka & Peta Tubuh"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded-md transition shadow-xs shrink-0"
                          >
                            <Bandage className="w-3 h-3" />
                            <span>Asesmen</span>
                          </Link>
                          <Link
                            href={`/rekam-medis?pasienId=${p.id}`}
                            title="Buka Lembar Catatan Perkembangan Pasien (CPPT)"
                            className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-slate-300 text-slate-700 text-[11px] font-medium rounded-md hover:bg-slate-50 transition shadow-xs shrink-0"
                          >
                            <FileText className="w-3 h-3 text-slate-500" />
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
