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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/90">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
              Klinik Pratama Rawat Luka Modern
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Dashboard Pelayanan Luka & Rekam Medis
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Monitoring klinis ulkus diabetikum, dekubitus, komposisi dasar jaringan (TIME), serta agenda kontrol ganti balutan.
          </p>
        </div>

        {/* Action Button Placement */}
        <div className="grid grid-cols-2 sm:flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <Link
            href="/asesmen"
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl transition border border-slate-300 shadow-2xs hover:shadow-xs active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <Bandage className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Mulai Asesmen</span>
          </Link>
          <Link
            href="/pendaftaran?tambah=true"
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs hover:shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4 shrink-0" />
            <span>+ Registrasi Pasien</span>
          </Link>
        </div>
      </div>

      {/* 4 Clinical KPI Metrics Cards (Layered Depth & Accent Stripe) */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
        {/* Metric 1 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] hover:shadow-md hover:border-blue-300 transition-all duration-200 relative overflow-hidden flex flex-col justify-between before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-blue-600">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Antrean Hari Ini</p>
              <div className="flex items-baseline gap-1.5 mt-1.5 sm:mt-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{antreanCount}</span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-semibold">pasien</span>
              </div>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 shadow-2xs">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] text-blue-700 font-bold bg-blue-50/80 px-2 py-0.5 rounded-full border border-blue-200/60">
              Siap Tindakan Poli
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] hover:shadow-md hover:border-emerald-300 transition-all duration-200 relative overflow-hidden flex flex-col justify-between before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-emerald-600">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Total Pasien</p>
              <div className="flex items-baseline gap-1.5 mt-1.5 sm:mt-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{patients.length}</span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-semibold">rekam medis</span>
              </div>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 shadow-2xs">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] text-emerald-700 font-bold bg-emerald-50/80 px-2 py-0.5 rounded-full border border-emerald-200/60">
              Database Aktif
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] hover:shadow-md hover:border-amber-300 transition-all duration-200 relative overflow-hidden flex flex-col justify-between before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-amber-500">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Home Care</p>
              <div className="flex items-baseline gap-1.5 mt-1.5 sm:mt-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{homecareCount}</span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-semibold">kunjungan</span>
              </div>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0 shadow-2xs">
              <CalendarCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] text-amber-700 font-bold bg-amber-50/80 px-2 py-0.5 rounded-full border border-amber-200/60">
              Rawat di Rumah
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] hover:shadow-md hover:border-rose-300 transition-all duration-200 relative overflow-hidden flex flex-col justify-between before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-rose-500">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Belum Asesmen</p>
              <div className="flex items-baseline gap-1.5 mt-1.5 sm:mt-2">
                <span className="text-2xl sm:text-3xl font-black text-rose-600 tracking-tight">{perluAsesmenCount}</span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-semibold">pasien</span>
              </div>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0 shadow-2xs">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] text-rose-700 font-bold bg-rose-50/80 px-2 py-0.5 rounded-full border border-rose-200/60">
              Perlu Pengkajian Luka
            </span>
          </div>
        </div>
      </div>

      {/* Main Patient Worklist: Mobile Android Cards & Desktop Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.06)] overflow-hidden">
        {/* Header with Tabs */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-gradient-to-r from-slate-50/90 via-white to-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
              <h2 className="text-sm font-bold text-slate-900">Daftar Pasien & Status Perkembangan Luka</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih pasien untuk memulai pengkajian luka klinis TIME atau meninjau lembar CPPT
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl text-xs font-semibold overflow-x-auto max-w-full border border-slate-200/60 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab('semua')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                activeTab === 'semua'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
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
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Antrean Rawat ({antreanCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('perlu-asesmen')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                activeTab === 'perlu-asesmen'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Belum Asesmen ({perluAsesmenCount})
            </button>
          </div>
        </div>

        {/* 1. MOBILE ANDROID VIEW: Native Clinical Cards (block md:hidden) */}
        <div className="block md:hidden p-3.5 space-y-3 bg-slate-50/70">
          {filteredPatients.length === 0 ? (
            <div className="p-8 text-center text-slate-400 bg-white rounded-xl border border-slate-200 text-xs shadow-2xs">
              Tidak ada pasien yang sesuai filter pencarian.
            </div>
          ) : (
            filteredPatients.map((p) => {
              const statusBadge = {
                'Antrean': 'bg-amber-50 text-amber-800 border-amber-200 shadow-2xs',
                'Sedang Diperiksa': 'bg-blue-50 text-blue-800 border-blue-200 shadow-2xs',
                'Selesai': 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-2xs',
                'Jadwal Kontrol': 'bg-slate-100 text-slate-700 border-slate-200 shadow-2xs',
              }[p.statusKunjungan];

              return (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 space-y-3 relative overflow-hidden before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-blue-600">
                  {/* Row 1: Name, No. RM, Gender, Status */}
                  <div className="flex items-start justify-between gap-2 pl-1.5">
                    <div className="flex items-start gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 border border-blue-200/80 flex items-center justify-center font-bold text-xs font-mono shrink-0 shadow-2xs mt-0.5">
                        {p.nama.charAt(0)}
                      </div>
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
                    </div>

                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border shrink-0 ${statusBadge}`}>
                      {p.statusKunjungan}
                    </span>
                  </div>

                  {/* Row 2: Diagnosis & Alergi */}
                  <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/70 space-y-1">
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
                    <div className="space-y-1.5 p-2.5 bg-slate-50/70 rounded-xl border border-slate-200/70">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-slate-700">Dasar Jaringan Luka (TIME)</span>
                        <span className="font-mono font-bold text-[9px] bg-white px-1.5 py-0.5 rounded text-slate-800 border border-slate-200 shadow-2xs">
                          VAS {p.asesmenTerakhir.skorNyeri}/10
                        </span>
                      </div>
                      {/* TIME Bar */}
                      <div className="h-2 rounded-full overflow-hidden flex bg-slate-200 shadow-inner">
                        <div
                          style={{ width: `${p.asesmenTerakhir.dasarLuka.persenGranulasi}%` }}
                          className="bg-red-600 transition-all"
                        />
                        <div
                          style={{ width: `${p.asesmenTerakhir.dasarLuka.persenSlough}%` }}
                          className="bg-amber-400 transition-all"
                        />
                        <div
                          style={{ width: `${p.asesmenTerakhir.dasarLuka.persenNekrotik}%` }}
                          className="bg-slate-900 transition-all"
                        />
                        <div
                          style={{ width: `${p.asesmenTerakhir.dasarLuka.persenEpitelisasi}%` }}
                          className="bg-pink-400 transition-all"
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
            <thead className="bg-slate-100/70 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="w-[21%] px-4 py-3.5">No. RM & Nama Pasien</th>
                <th className="w-[31%] px-4 py-3.5">Diagnosa Klinis & Riwayat Alergi</th>
                <th className="w-[21%] px-3.5 py-3.5">Status Luka (TIME & Nyeri)</th>
                <th className="w-[11%] px-2 py-3.5 text-center">Status</th>
                <th className="w-[16%] px-4 py-3.5 text-right">Tindakan</th>
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
                    'Antrean': 'bg-amber-50 text-amber-800 border-amber-200 shadow-2xs',
                    'Sedang Diperiksa': 'bg-blue-50 text-blue-800 border-blue-200 shadow-2xs',
                    'Selesai': 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-2xs',
                    'Jadwal Kontrol': 'bg-slate-100 text-slate-700 border-slate-200 shadow-2xs',
                  }[p.statusKunjungan];

                  return (
                    <tr key={p.id} className="hover:bg-blue-50/40 transition-colors group">
                      <td className="px-4 py-3.5 align-middle">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-100/80 text-blue-800 border border-blue-200/70 flex items-center justify-center font-bold text-xs font-mono shrink-0 shadow-2xs">
                            {p.nama.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-sm text-slate-900 leading-snug group-hover:text-blue-900 transition-colors">
                              {p.nama}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                              {p.noRm} • {p.jenisKelamin === 'Laki-laki' ? 'L' : 'P'}, {p.tanggalLahir}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 align-middle">
                        <div className="font-semibold text-slate-800 leading-snug break-words">
                          {p.diagnosisMedisUtama}
                        </div>
                        {p.riwayatAlergi && p.riwayatAlergi !== 'Tidak Ada' ? (
                          <div className="mt-1">
                            <span 
                              className="inline-flex items-center gap-1 text-[10px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200"
                            >
                              <span className="shrink-0">Alergi:</span>
                              <span>{p.riwayatAlergi}</span>
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 mt-0.5 block">Tidak ada riwayat alergi</span>
                        )}
                      </td>

                      <td className="px-3.5 py-3.5 align-middle">
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
                              <span className="font-mono font-bold text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 border border-slate-200 shrink-0 shadow-2xs">
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
                        <span className={`px-2 py-1 text-[10px] font-bold rounded-md border inline-block ${statusBadge}`}>
                          {p.statusKunjungan}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 align-middle text-right whitespace-nowrap">
                        <div className="flex items-center gap-1.5 justify-end">
                          <Link
                            href={`/asesmen?pasienId=${p.id}`}
                            title="Mulai Asesmen Luka & Peta Tubuh"
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[11px] font-bold rounded-lg transition shadow-xs hover:shadow-sm shrink-0"
                          >
                            <Bandage className="w-3 h-3" />
                            <span>Asesmen</span>
                          </Link>
                          <Link
                            href={`/rekam-medis?pasienId=${p.id}`}
                            title="Buka Lembar Catatan Perkembangan Pasien (CPPT)"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-[11px] font-semibold rounded-lg hover:bg-slate-50 active:scale-95 transition shadow-2xs shrink-0"
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left: Schedule Today (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.06)] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Agenda Kunjungan & Ganti Balutan Hari Ini</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Antrean tindakan perawatan luka klinik dan jadwal kunjungan home care</p>
            </div>
            <Link href="/jadwal" className="text-xs text-blue-600 font-bold hover:underline shrink-0">
              Lihat Kalender &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {schedules.map((s) => (
              <div key={s.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 p-2 rounded-xl transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200 shadow-2xs">
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
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shadow-2xs ${
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
                      className="text-[11px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 font-bold px-3 py-1 rounded-lg transition flex items-center gap-1 shadow-2xs active:scale-95"
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
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.06)] p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Standar Prosedur (SOP) Wound Care
                </h3>
                <p className="text-[11px] text-slate-500">Protokol manajemen luka modern bersertifikasi CWCCA</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/70 border-l-[3.5px] border-l-blue-600 shadow-2xs">
                <strong className="text-slate-900 block mb-0.5">1. Pencucian Luka (Cleansing):</strong>
                Gunakan NaCl 0.9% hangat atau antiseptik PHMB/Octenidine rendam 10-15 menit untuk mengeliminasi biofilm dan bakteri patogen.
              </div>
              <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/70 border-l-[3.5px] border-l-emerald-600 shadow-2xs">
                <strong className="text-slate-900 block mb-0.5">2. Debridement Jaringan:</strong>
                Angkat slough devitalisasi dan kalus menebal pada tepi luka (cegah epibole) untuk merangsang migrasi sel epitel sehat.
              </div>
              <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/70 border-l-[3.5px] border-l-amber-500 shadow-2xs">
                <strong className="text-slate-900 block mb-0.5">3. Manajemen Kelembapan (Moisture Balance):</strong>
                Pilih balutan primer modern (Alginate/Hydrofiber untuk eksudat sedang-banyak, Hydrogel untuk hidrasi luka kering).
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">Panduan Klinis Resmi</span>
            <Link
              href="/asesmen"
              className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 group"
            >
              <span>Buka Form Asesmen</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
