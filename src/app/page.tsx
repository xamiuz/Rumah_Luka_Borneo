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
  HeartPulse,
  TrendingUp,
  Stethoscope
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
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Clinical Summary */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard Perawatan Luka & Stoma (Wound Care)
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Monitoring klinis pasien ulkus diabetik, luka tekan (dekubitus), dan luka kronis. Kelola rekam medis SOAP, rencana modern dressing, dan jadwal kunjungan secara terpadu.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/pendaftaran"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shadow-xs flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Registrasi Pasien</span>
          </Link>
          <Link
            href="/asesmen"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition border border-slate-300 flex items-center gap-2"
          >
            <Activity className="w-4 h-4 text-blue-600" />
            <span>Asesmen Baru</span>
          </Link>
        </div>
      </div>

      {/* 4 Clinical KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Antrean Rawat Hari Ini</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-slate-900">{antreanCount}</span>
              <span className="text-xs text-slate-500 font-medium">pasien aktif</span>
            </div>
            <p className="text-[11px] text-blue-700 font-medium mt-1">Siap tindakan di ruang rawat</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
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
            <p className="text-[11px] text-emerald-700 font-medium mt-1">Tersimpan dalam database</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
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
            <p className="text-[11px] text-amber-700 font-medium mt-1">Layanan perawatan di rumah</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
            <CalendarCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Belum Asesmen Luka</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-rose-700">{perluAsesmenCount}</span>
              <span className="text-xs text-slate-500 font-medium">pasien</span>
            </div>
            <p className="text-[11px] text-rose-600 font-medium mt-1">Memerlukan evaluasi luka awal</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Clinical Worklist (8 Cols) & Today's Schedule (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Patient Worklist Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Header & Tabs */}
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Daftar Pasien & Status Perkembangan Luka</h2>
              <p className="text-xs text-slate-500">Pilih pasien untuk memulai asesmen luka TIME atau tinjau catatan CPPT</p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab('semua')}
                className={`px-3 py-1 rounded-md transition ${
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
                className={`px-3 py-1 rounded-md transition ${
                  activeTab === 'antrean'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Antrean ({antreanCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('perlu-asesmen')}
                className={`px-3 py-1 rounded-md transition ${
                  activeTab === 'perlu-asesmen'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Belum Asesmen ({perluAsesmenCount})
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">No. RM & Pasien</th>
                  <th className="px-4 py-3">Diagnosa / Etiologi</th>
                  <th className="px-4 py-3">Komposisi Dasar Jaringan (TIME)</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Aksi Klinis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                      Tidak ada pasien yang sesuai filter.
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
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="font-bold text-slate-900">{p.nama}</div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {p.noRm} • {p.jenisKelamin === 'Laki-laki' ? 'L' : 'P'}, {p.tanggalLahir}
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="font-medium text-slate-800 max-w-[200px] truncate" title={p.diagnosisMedisUtama}>
                            {p.diagnosisMedisUtama}
                          </div>
                          {p.riwayatAlergi && p.riwayatAlergi !== 'Tidak Ada' && (
                            <span className="text-[10px] text-rose-700 font-semibold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 mt-0.5 inline-block">
                              Alergi: {p.riwayatAlergi}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3.5">
                          {p.asesmenTerakhir ? (
                            <div className="space-y-1.5 min-w-[140px]">
                              {/* Tissue Proportion Bar */}
                              <div className="h-2 rounded-full overflow-hidden flex bg-slate-200">
                                <div
                                  style={{ width: `${p.asesmenTerakhir.dasarLuka.persenGranulasi}%` }}
                                  className="bg-red-600"
                                  title={`Granulasi: ${p.asesmenTerakhir.dasarLuka.persenGranulasi}%`}
                                />
                                <div
                                  style={{ width: `${p.asesmenTerakhir.dasarLuka.persenSlough}%` }}
                                  className="bg-amber-400"
                                  title={`Slough: ${p.asesmenTerakhir.dasarLuka.persenSlough}%`}
                                />
                                <div
                                  style={{ width: `${p.asesmenTerakhir.dasarLuka.persenNekrotik}%` }}
                                  className="bg-slate-900"
                                  title={`Nekrotik: ${p.asesmenTerakhir.dasarLuka.persenNekrotik}%`}
                                />
                                <div
                                  style={{ width: `${p.asesmenTerakhir.dasarLuka.persenEpitelisasi}%` }}
                                  className="bg-pink-400"
                                  title={`Epitel: ${p.asesmenTerakhir.dasarLuka.persenEpitelisasi}%`}
                                />
                              </div>
                              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                                <span>G: {p.asesmenTerakhir.dasarLuka.persenGranulasi}%</span>
                                <span>S: {p.asesmenTerakhir.dasarLuka.persenSlough}%</span>
                                <span>N: {p.asesmenTerakhir.dasarLuka.persenNekrotik}%</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">
                              Belum ada asesmen
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className={`px-2 py-0.5 text-[11px] font-semibold rounded border ${statusBadge}`}>
                            {p.statusKunjungan}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 text-right whitespace-nowrap space-x-1.5">
                          <Link
                            href={`/asesmen?pasienId=${p.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded-md transition shadow-xs"
                          >
                            <Bandage className="w-3.5 h-3.5" />
                            <span>Asesmen</span>
                          </Link>
                          <Link
                            href={`/rekam-medis?pasienId=${p.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-300 text-slate-700 text-[11px] font-semibold rounded-md hover:bg-slate-100 transition"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-500" />
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

        {/* Right: Today's Clinical Schedule & Triage Alert (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Schedule Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Jadwal Perawatan Hari Ini</h3>
                <p className="text-xs text-slate-500">Antrean ganti balutan & homecare</p>
              </div>
              <Link href="/jadwal" className="text-xs text-blue-700 font-semibold hover:underline">
                Lihat Semua
              </Link>
            </div>

            <div className="space-y-3">
              {schedules.map((s) => (
                <div
                  key={s.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                          {s.jam} WITA
                        </span>
                        <span className="text-xs font-bold text-slate-900">{s.namaPasien}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{s.noRm}</p>
                    </div>

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      s.status === 'Selesai'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {s.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200/70">
                    <strong className="text-slate-800">{s.jenisLayanan}:</strong> {s.catatan}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-500">PIC: {s.namaPerawat}</span>
                    {s.status !== 'Selesai' && (
                      <button
                        type="button"
                        onClick={() => updateScheduleStatus(s.id, 'Selesai')}
                        className="text-[10px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 font-semibold px-2 py-0.5 rounded transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Selesai</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Access Protocol Box (Light Medical Aesthetic) */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-blue-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                Prosedur & Panduan Klinis (SOP)
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pastikan selalu melakukan dokumentasi luka sebelum dan sesudah tindakan *sharp debridement*, serta evaluasi kondisi eksudat dan maserasi tepi luka.
            </p>
            <div className="pt-1">
              <Link
                href="/asesmen"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 transition"
              >
                <span>Buka Formulir Asesmen Wound Care</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
