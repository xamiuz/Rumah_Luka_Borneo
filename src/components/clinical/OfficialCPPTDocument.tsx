'use client';

import React from 'react';
import { Pasien, CatatanCPPT, User } from '@/types';

interface OfficialCPPTDocumentProps {
  patient: Pasien;
  records: CatatanCPPT[];
  currentUser?: User;
}

function calculateAge(birthDateString: string): number {
  if (!birthDateString) return 0;
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function formatDateIndo(date: Date): string {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function OfficialCPPTDocument({ patient, records }: OfficialCPPTDocumentProps) {
  const currentDateFormatted = formatDateIndo(new Date());
  const printTimestamp = new Date().toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) + ' WITA';

  return (
    <div className="bg-white text-black font-sans leading-snug p-4 sm:p-6 max-w-[850px] mx-auto print:p-0 print:max-w-full print:leading-tight">
      {/* 1. KOP SURAT RESMI KLINIK (Alamat & Izin Operasional dikosongi sesuai permintaan) */}
      <div className="border-b-2 border-slate-900 pb-1.5 mb-0.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {/* Logo Emblem */}
            <div className="w-11 h-11 rounded-full border-2 border-slate-900 flex items-center justify-center font-black text-slate-900 text-base font-mono shrink-0 bg-slate-50">
              RLB
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black tracking-wide uppercase text-slate-900 leading-tight">
                KLINIK UTAMA RUMAH LUKA BORNEO
              </h1>
              <p className="text-[10px] font-bold text-slate-800 leading-tight">
                Pusat Pelayanan Perawatan Luka Modern & Home Care Terpadu
              </p>
            </div>
          </div>

          {/* Sisi Kanan Kop Surat (Izin Operasional Dikosongi) */}
          <div className="text-right text-[8px] text-slate-600 font-mono leading-tight shrink-0"></div>
        </div>
      </div>
      {/* Garis Ganda Tipis */}
      <div className="border-b border-slate-900 mb-2"></div>

      {/* 2. JUDUL DOKUMEN REKAM MEDIS */}
      <div className="text-center mb-2">
        <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-slate-900 underline underline-offset-2">
          CATATAN PERKEMBANGAN PASIEN TERINTEGRASI (CPPT)
        </h2>
        <div className="flex justify-between items-center text-[8.5px] text-slate-600 font-mono mt-0.5 border-t border-dotted border-slate-300 pt-0.5">
          <span>Formulir Rekam Medis (PMK No. 24/2022)</span>
          <span>No. Dok: RM-CPPT/2026</span>
          <span>Waktu Cetak: {printTimestamp}</span>
        </div>
      </div>

      {/* 3. TABEL IDENTITAS & RINGKASAN KLINIS (Unified Compact Table) */}
      <div className="mb-2.5">
        <table className="w-full border-collapse border border-slate-700 text-[9px] sm:text-[9.5px]">
          <tbody>
            <tr className="border-b border-slate-400">
              <td className="w-[14%] font-semibold bg-slate-100/80 px-1.5 py-1 border-r border-slate-400">Nama Pasien</td>
              <td className="w-[36%] font-bold text-slate-900 px-1.5 py-1 border-r border-slate-400 uppercase">
                {patient.nama}
              </td>
              <td className="w-[15%] font-semibold bg-slate-100/80 px-1.5 py-1 border-r border-slate-400">No. Rekam Medis</td>
              <td className="w-[35%] font-mono font-bold text-slate-900 px-1.5 py-1">
                {patient.noRm}
              </td>
            </tr>
            <tr className="border-b border-slate-400">
              <td className="font-semibold bg-slate-100/80 px-1.5 py-1 border-r border-slate-400">NIK (KTP)</td>
              <td className="font-mono px-1.5 py-1 border-r border-slate-400">{patient.nik || '-'}</td>
              <td className="font-semibold bg-slate-100/80 px-1.5 py-1 border-r border-slate-400">Tgl Lahir / JK</td>
              <td className="px-1.5 py-1">
                {patient.tanggalLahir} ({calculateAge(patient.tanggalLahir)} Th) / {patient.jenisKelamin} (Gol: {patient.golonganDarah || '-'})
              </td>
            </tr>
            <tr className="border-b border-slate-400">
              <td className="font-semibold bg-slate-100/80 px-1.5 py-1 border-r border-slate-400">Diagnosis Utama</td>
              <td className="font-bold text-slate-900 px-1.5 py-1 border-r border-slate-400">
                {patient.diagnosisMedisUtama}
              </td>
              <td className="font-semibold bg-rose-50 text-rose-900 px-1.5 py-1 border-r border-slate-400">
                Riwayat Alergi
              </td>
              <td className="font-bold text-rose-800 px-1.5 py-1">
                {patient.riwayatAlergi && patient.riwayatAlergi !== 'Tidak Ada'
                  ? patient.riwayatAlergi
                  : 'Tidak Ada Riwayat Alergi'}
              </td>
            </tr>
            {patient.asesmenTerakhir ? (
              <tr>
                <td className="font-semibold bg-slate-100/80 px-1.5 py-1 border-r border-slate-400">Status Luka</td>
                <td colSpan={3} className="px-1.5 py-1 text-slate-800">
                  <span className="font-bold">{patient.asesmenTerakhir.lokasiLuka}</span> ({patient.asesmenTerakhir.tipeLuka}) • Dimensi: {patient.asesmenTerakhir.ukuran.panjangCm}×{patient.asesmenTerakhir.ukuran.lebarCm} cm, kedalaman {patient.asesmenTerakhir.ukuran.kedalamanMm} mm • TIME: Granulasi {patient.asesmenTerakhir.dasarLuka.persenGranulasi}%, Slough {patient.asesmenTerakhir.dasarLuka.persenSlough}%, Epitel {patient.asesmenTerakhir.dasarLuka.persenEpitelisasi}% • Balutan: {patient.asesmenTerakhir.tindakanWoundCare.primaryDressing}
                </td>
              </tr>
            ) : (
              <tr>
                <td className="font-semibold bg-slate-100/80 px-1.5 py-1 border-r border-slate-400">Komorbiditas</td>
                <td colSpan={3} className="px-1.5 py-1 text-slate-800">
                  {patient.riwayatPenyakit && patient.riwayatPenyakit.length > 0
                    ? patient.riwayatPenyakit.join(', ')
                    : 'Tidak ada catatan komorbid'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 4. TABEL RESMI CPPT 5 KOLOM (Standard Akreditasi Kemenkes / KARS) */}
      <div className="mb-3">
        <table className="w-full border-collapse border border-slate-700 text-[8.5px] sm:text-[9px]">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-700 text-center font-bold text-slate-900">
              <th className="w-[12%] py-1 px-1.5 border-r border-slate-600 uppercase text-[8.5px]">
                Tgl & Jam
              </th>
              <th className="w-[16%] py-1 px-1.5 border-r border-slate-600 uppercase text-[8.5px]">
                Pemeriksa (PPA)
              </th>
              <th className="w-[48%] py-1 px-1.5 border-r border-slate-600 uppercase text-[8.5px]">
                Catatan Asesmen & Penatalaksanaan (SOAP)
              </th>
              <th className="w-[14%] py-1 px-1.5 border-r border-slate-600 uppercase text-[8.5px]">
                Instruksi PPA
              </th>
              <th className="w-[10%] py-1 px-1.5 uppercase text-[8.5px]">
                Paraf
              </th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 text-center text-slate-400 italic text-xs">
                  Belum ada catatan perkembangan pasien (CPPT) yang terdaftar.
                </td>
              </tr>
            ) : (
              records.map((item) => {
                const parts = item.tanggalWaktu.split(',');
                const datePart = parts[0]?.trim() || item.tanggalWaktu;
                const timePart = parts[1]?.trim() || '';

                return (
                  <tr key={item.id} className="border-b border-slate-400 align-top">
                    {/* Kolom 1: Tanggal & Jam */}
                    <td className="py-1 px-1.5 border-r border-slate-400 font-mono text-[8px] sm:text-[8.5px] text-center">
                      <div className="font-bold text-slate-900">{datePart}</div>
                      {timePart && <div className="text-slate-600">{timePart}</div>}
                    </td>

                    {/* Kolom 2: PPA */}
                    <td className="py-1 px-1.5 border-r border-slate-400 text-[8.5px]">
                      <div className="font-bold text-slate-900">{item.namaTenagaMedis}</div>
                      <div className="text-slate-600">{item.profesi}</div>
                    </td>

                    {/* Kolom 3: SOAP (Text Formal Rapi Tanpa Kotak-Kotak) */}
                    <td className="py-1 px-1.5 border-r border-slate-400 text-left leading-normal space-y-1">
                      <div>
                        <strong className="text-slate-900 font-bold inline-block w-4">S:</strong>
                        <span className="text-slate-800">{item.soap.subjective}</span>
                      </div>
                      <div>
                        <strong className="text-slate-900 font-bold inline-block w-4">O:</strong>
                        <span className="text-slate-800">{item.soap.objective}</span>
                      </div>
                      <div>
                        <strong className="text-slate-900 font-bold inline-block w-4">A:</strong>
                        <span className="text-slate-800">{item.soap.assessment}</span>
                      </div>
                      <div>
                        <strong className="text-slate-900 font-bold inline-block w-4">P:</strong>
                        <span className="text-slate-800">{item.soap.plan}</span>
                      </div>
                    </td>

                    {/* Kolom 4: Instruksi PPA */}
                    <td className="py-1 px-1.5 border-r border-slate-400 text-[8.5px] leading-normal text-slate-800">
                      {item.instruksiPPA || '-'}
                    </td>

                    {/* Kolom 5: Paraf (Dikosongi sesuai instruksi) */}
                    <td className="py-1 px-1 text-center align-middle h-10"></td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 5. LEMBAR PENGESAHAN DOKUMEN (Legalitas, Kota Bontang, dan TTD Dikosongi) */}
      <div className="pt-2 border-t border-slate-400 print-avoid-break">
        <div className="flex justify-between items-end gap-4 text-[8.5px] sm:text-[9px]">
          {/* Sisi Kiri (Legalitas Dikosongi sesuai permintaan) */}
          <div className="w-[50%]"></div>

          {/* Sisi Kanan: Tanda Tangan PPA (Dikosongi untuk tanda tangan manual) */}
          <div className="w-[45%] text-right flex flex-col items-end">
            <p className="text-slate-700">{currentDateFormatted}</p>
            <p className="text-slate-800 font-semibold">Penanggung Jawab Pelayanan (PPA),</p>
            
            {/* Area Kosong Tanda Tangan Manual */}
            <div className="h-16 w-44"></div>

            <p className="font-bold text-slate-900 text-[9.5px]">
              (&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)
            </p>
            <p className="font-mono text-[8px] text-slate-500">
              SIP / STR: .......................................
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
