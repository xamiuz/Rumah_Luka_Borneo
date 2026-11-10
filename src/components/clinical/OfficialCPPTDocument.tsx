'use client';

import React from 'react';
import { Pasien, CatatanCPPT, User } from '@/types';

interface OfficialCPPTDocumentProps {
  patient: Pasien;
  records: CatatanCPPT[];
  currentUser: User;
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

export function OfficialCPPTDocument({ patient, records, currentUser }: OfficialCPPTDocumentProps) {
  const currentDateFormatted = formatDateIndo(new Date());
  const printTimestamp = new Date().toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) + ' WITA';

  return (
    <div className="bg-white text-black font-sans leading-normal p-6 sm:p-8 max-w-[850px] mx-auto print:p-0 print:max-w-full">
      {/* 1. KOP SURAT RESMI KLINIK */}
      <div className="border-b-2 border-slate-900 pb-2 mb-1">
        <div className="flex items-center justify-between gap-4">
          {/* Logo / Emblem */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full border-2 border-slate-800 flex items-center justify-center font-bold text-slate-800 text-xl font-mono shrink-0 bg-slate-50">
              RLB
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-wide uppercase text-slate-900">
                KLINIK UTAMA RUMAH LUKA BORNEO
              </h1>
              <p className="text-[11px] sm:text-xs font-bold text-slate-700 tracking-tight">
                PUSAT PELAYANAN PERAWATAN LUKA MODERN & HOME CARE TERPADU
              </p>
              <p className="text-[9.5px] sm:text-[10px] text-slate-600 mt-0.5 leading-tight">
                Jl. Pupuk Raya Blok D-12, Bontang Barat, Kota Bontang, Kalimantan Timur 75313
              </p>
              <p className="text-[9px] sm:text-[9.5px] text-slate-500 font-mono">
                Telp: (0548) 22341 • WA: 0812-5544-3321 • Email: rekam.medis@rumahlukaborneo.id
              </p>
            </div>
          </div>

          {/* Izin Faskes & Legalitas */}
          <div className="text-right text-[8.5px] sm:text-[9px] text-slate-600 hidden sm:block font-mono leading-tight">
            <div className="font-bold text-slate-800 uppercase">Izin Operasional Klinik:</div>
            <div>445/082/DPMPTSP-PPID/KES/2024</div>
            <div className="mt-1 text-slate-500">Kode Faskes: 647401-RLB</div>
          </div>
        </div>
      </div>
      {/* Garis Ganda Kop Surat */}
      <div className="border-b border-slate-800 mb-4"></div>

      {/* 2. JUDUL DOKUMEN REKAM MEDIS */}
      <div className="text-center mb-4">
        <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-900 underline underline-offset-4">
          CATATAN PERKEMBANGAN PASIEN TERINTEGRASI (CPPT)
        </h2>
        <p className="text-[10px] text-slate-600 font-semibold mt-1">
          LEMBAR REKAM MEDIS RAWAT JALAN & HOME CARE • PERMENKES NO. 24 TAHUN 2022
        </p>
        <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono mt-1 border-t border-dotted border-slate-300 pt-1">
          <span>Nomor Dokumen: FORM-RM-CPPT/2026</span>
          <span>Dicetak: {printTimestamp}</span>
        </div>
      </div>

      {/* 3. TABEL IDENTITAS PASIEN RESMI */}
      <div className="mb-4">
        <div className="bg-slate-800 text-white text-[9.5px] font-bold px-2 py-1 uppercase tracking-wider">
          A. IDENTITAS PASIEN
        </div>
        <table className="w-full border-collapse border border-slate-700 text-[10px] sm:text-[11px]">
          <tbody>
            <tr className="border-b border-slate-400">
              <td className="w-[18%] font-semibold bg-slate-50 px-2 py-1.5 border-r border-slate-400">Nama Lengkap</td>
              <td className="w-[32%] font-bold text-slate-900 px-2 py-1.5 border-r border-slate-400 uppercase">
                {patient.nama}
              </td>
              <td className="w-[18%] font-semibold bg-slate-50 px-2 py-1.5 border-r border-slate-400">Nomor Rekam Medis</td>
              <td className="w-[32%] font-mono font-bold text-slate-900 px-2 py-1.5">
                {patient.noRm}
              </td>
            </tr>
            <tr className="border-b border-slate-400">
              <td className="font-semibold bg-slate-50 px-2 py-1.5 border-r border-slate-400">NIK (KTP)</td>
              <td className="font-mono px-2 py-1.5 border-r border-slate-400">{patient.nik || '-'}</td>
              <td className="font-semibold bg-slate-50 px-2 py-1.5 border-r border-slate-400">Tgl Lahir / Umur</td>
              <td className="px-2 py-1.5">
                {patient.tanggalLahir} ({calculateAge(patient.tanggalLahir)} Tahun) / {patient.jenisKelamin}
              </td>
            </tr>
            <tr className="border-b border-slate-400">
              <td className="font-semibold bg-slate-50 px-2 py-1.5 border-r border-slate-400">Alamat Domisili</td>
              <td className="px-2 py-1.5 border-r border-slate-400">{patient.alamat || '-'}</td>
              <td className="font-semibold bg-slate-50 px-2 py-1.5 border-r border-slate-400">Golongan Darah</td>
              <td className="px-2 py-1.5 font-bold font-mono">{patient.golonganDarah || '-'}</td>
            </tr>
            <tr className="border-b border-slate-400">
              <td className="font-semibold bg-slate-50 px-2 py-1.5 border-r border-slate-400">Diagnosis Utama</td>
              <td className="font-bold text-slate-900 px-2 py-1.5 border-r border-slate-400">
                {patient.diagnosisMedisUtama}
              </td>
              <td className="font-semibold bg-rose-50 text-rose-900 px-2 py-1.5 border-r border-slate-400">
                Riwayat Alergi
              </td>
              <td className="font-bold text-rose-800 px-2 py-1.5">
                {patient.riwayatAlergi && patient.riwayatAlergi !== 'Tidak Ada'
                  ? patient.riwayatAlergi
                  : 'Tidak Ada Riwayat Alergi'}
              </td>
            </tr>
            <tr>
              <td className="font-semibold bg-slate-50 px-2 py-1.5 border-r border-slate-400">Komorbiditas</td>
              <td colSpan={3} className="px-2 py-1.5 text-slate-800">
                {patient.riwayatPenyakit && patient.riwayatPenyakit.length > 0
                  ? patient.riwayatPenyakit.join(', ')
                  : 'Tidak ada riwayat penyakit penyerta'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 4. RINGKASAN STATUS KLINIS ASESMEN LUKA TERAKHIR */}
      {patient.asesmenTerakhir && (
        <div className="mb-4">
          <div className="bg-slate-800 text-white text-[9.5px] font-bold px-2 py-1 uppercase tracking-wider flex justify-between items-center">
            <span>B. STATUS KLINIS & ASESMEN LUKA TERAKHIR</span>
            <span className="font-mono text-[9px] text-slate-200">
              Tgl: {patient.asesmenTerakhir.tanggal.split('T')[0]} • Pemeriksa: {patient.asesmenTerakhir.perawatPemeriksa}
            </span>
          </div>
          <table className="w-full border-collapse border border-slate-700 text-[10px] sm:text-[10.5px]">
            <tbody>
              <tr className="border-b border-slate-400">
                <td className="w-[18%] font-semibold bg-slate-50 px-2 py-1 border-r border-slate-400">Lokasi / Regio</td>
                <td className="w-[32%] font-bold px-2 py-1 border-r border-slate-400">
                  {patient.asesmenTerakhir.lokasiLuka}
                </td>
                <td className="w-[18%] font-semibold bg-slate-50 px-2 py-1 border-r border-slate-400">Tipe & Stadium</td>
                <td className="w-[32%] px-2 py-1 font-semibold">
                  {patient.asesmenTerakhir.tipeLuka} ({patient.asesmenTerakhir.stadiumLuka})
                </td>
              </tr>
              <tr className="border-b border-slate-400">
                <td className="font-semibold bg-slate-50 px-2 py-1 border-r border-slate-400">Dimensi Luka</td>
                <td className="font-mono px-2 py-1 border-r border-slate-400">
                  P: {patient.asesmenTerakhir.ukuran.panjangCm} cm • L: {patient.asesmenTerakhir.ukuran.lebarCm} cm • Kedalaman: {patient.asesmenTerakhir.ukuran.kedalamanMm} mm
                  {patient.asesmenTerakhir.ukuran.underminingGoaCm ? ` • Goa: ${patient.asesmenTerakhir.ukuran.underminingGoaCm} cm` : ''}
                </td>
                <td className="font-semibold bg-slate-50 px-2 py-1 border-r border-slate-400">TIME (Dasar Luka)</td>
                <td className="font-mono px-2 py-1">
                  Granulasi {patient.asesmenTerakhir.dasarLuka.persenGranulasi}% | Slough {patient.asesmenTerakhir.dasarLuka.persenSlough}% | Nekrotik {patient.asesmenTerakhir.dasarLuka.persenNekrotik}% | Epitel {patient.asesmenTerakhir.dasarLuka.persenEpitelisasi}%
                </td>
              </tr>
              <tr className="border-b border-slate-400">
                <td className="font-semibold bg-slate-50 px-2 py-1 border-r border-slate-400">Eksudat & Nyeri</td>
                <td className="px-2 py-1 border-r border-slate-400">
                  Jumlah: {patient.asesmenTerakhir.eksudat.jumlah} ({patient.asesmenTerakhir.eksudat.warna}, bau: {patient.asesmenTerakhir.eksudat.bau}) • Nyeri: {patient.asesmenTerakhir.skorNyeri}/10
                </td>
                <td className="font-semibold bg-slate-50 px-2 py-1 border-r border-slate-400">Kondisi Peri-Wound</td>
                <td className="px-2 py-1">
                  Kulit Sekitar: {patient.asesmenTerakhir.kulitSekitar} • Tepi Luka: {patient.asesmenTerakhir.tepiLuka}
                </td>
              </tr>
              <tr>
                <td className="font-semibold bg-slate-50 px-2 py-1 border-r border-slate-400">Balutan Terpasang</td>
                <td colSpan={3} className="px-2 py-1 text-slate-800">
                  <strong>Pembersih:</strong> {patient.asesmenTerakhir.tindakanWoundCare.cairanPencuci} • <strong>Primer:</strong> {patient.asesmenTerakhir.tindakanWoundCare.primaryDressing} • <strong>Sekunder:</strong> {patient.asesmenTerakhir.tindakanWoundCare.secondaryDressing}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* 5. TABEL RESMI CPPT 5 KOLOM (Standard Akreditasi Kemenkes / KARS) */}
      <div className="mb-5">
        <div className="bg-slate-800 text-white text-[9.5px] font-bold px-2 py-1 uppercase tracking-wider flex justify-between items-center">
          <span>C. CATATAN PERKEMBANGAN PASIEN TERINTEGRASI (SOAP KRONOLOGIS)</span>
          <span className="font-mono text-[9px] text-slate-200">{records.length} Entri Tercatat</span>
        </div>
        <table className="w-full border-collapse border border-slate-700 text-[10px] sm:text-[10.5px]">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-700 text-center font-bold text-slate-900">
              <th className="w-[14%] p-2 border-r border-slate-600 uppercase text-[9px] sm:text-[9.5px]">
                Tanggal & Jam
              </th>
              <th className="w-[18%] p-2 border-r border-slate-600 uppercase text-[9px] sm:text-[9.5px]">
                Pemeriksa (PPA)
              </th>
              <th className="w-[44%] p-2 border-r border-slate-600 uppercase text-[9px] sm:text-[9.5px]">
                Hasil Asesmen Pasien & Penatalaksanaan (SOAP)
              </th>
              <th className="w-[14%] p-2 border-r border-slate-600 uppercase text-[9px] sm:text-[9.5px]">
                Instruksi PPA
              </th>
              <th className="w-[10%] p-2 uppercase text-[9px] sm:text-[9.5px]">
                Verifikasi
              </th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-400 italic text-xs">
                  Belum ada catatan perkembangan pasien (CPPT) yang terdaftar.
                </td>
              </tr>
            ) : (
              records.map((item) => {
                const parts = item.tanggalWaktu.split(',');
                const datePart = parts[0]?.trim() || item.tanggalWaktu;
                const timePart = parts[1]?.trim() || '';

                return (
                  <tr key={item.id} className="border-b border-slate-500 align-top break-inside-avoid">
                    {/* Kolom 1: Tanggal & Jam */}
                    <td className="p-2 border-r border-slate-400 font-mono text-[9.5px] text-center">
                      <div className="font-bold text-slate-900">{datePart}</div>
                      {timePart && <div className="text-slate-600 mt-0.5">{timePart}</div>}
                    </td>

                    {/* Kolom 2: PPA */}
                    <td className="p-2 border-r border-slate-400 text-[9.5px]">
                      <div className="font-bold text-slate-900">{item.namaTenagaMedis}</div>
                      <div className="text-slate-600 font-semibold">{item.profesi}</div>
                    </td>

                    {/* Kolom 3: SOAP (Text Formal, NO Kotak-Kotak) */}
                    <td className="p-2 border-r border-slate-400 text-left leading-relaxed space-y-1.5">
                      <div>
                        <strong className="text-slate-900 font-extrabold inline-block w-5">S :</strong>
                        <span className="text-slate-800">{item.soap.subjective}</span>
                      </div>
                      <div>
                        <strong className="text-slate-900 font-extrabold inline-block w-5">O :</strong>
                        <span className="text-slate-800">{item.soap.objective}</span>
                      </div>
                      <div>
                        <strong className="text-slate-900 font-extrabold inline-block w-5">A :</strong>
                        <span className="text-slate-800">{item.soap.assessment}</span>
                      </div>
                      <div>
                        <strong className="text-slate-900 font-extrabold inline-block w-5">P :</strong>
                        <span className="text-slate-800">{item.soap.plan}</span>
                      </div>
                    </td>

                    {/* Kolom 4: Instruksi PPA */}
                    <td className="p-2 border-r border-slate-400 text-[9.5px] leading-relaxed text-slate-800">
                      {item.instruksiPPA || '-'}
                    </td>

                    {/* Kolom 5: Paraf / Verifikasi */}
                    <td className="p-2 text-center align-middle">
                      <div className="inline-block border border-slate-800 bg-slate-50 px-1 py-0.5 rounded text-[8px] font-mono font-bold text-slate-900 uppercase">
                        ✓ TTE SAH
                      </div>
                      <div className="text-[7.5px] text-slate-500 font-mono mt-1">
                        {item.namaTenagaMedis.split(',')[0]}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 6. LEMBAR PENGESAHAN DOKUMEN & LEGALITAS HUKUM */}
      <div className="pt-2 border-t border-slate-400 break-inside-avoid">
        <div className="flex flex-col sm:flex-row justify-between items-end gap-6 text-[9.5px] sm:text-[10px]">
          {/* Legalitas PMK */}
          <div className="w-full sm:w-[58%] text-slate-600 leading-tight space-y-1">
            <p className="font-bold text-slate-900 uppercase tracking-tight">Klausul Legalitas Rekam Medis Elektronik:</p>
            <p>
              1. Dokumen ini sah dan berkekuatan hukum tetap sesuai dengan <strong>Permenkes RI No. 24 Tahun 2022</strong> tentang Rekam Medis serta UU Informasi dan Transaksi Elektronik (ITE).
            </p>
            <p>
              2. Rekam medis ini bersifat rahasia dan merupakan milik fasilitas kesehatan, sedangkan isi ringkasan rekam medis merupakan hak pasien.
            </p>
            <p className="font-mono text-[8.5px] text-slate-400 pt-0.5">
              Sistem Otomasi Dokumen Medis • Klinik Rumah Luka Borneo
            </p>
          </div>

          {/* Tanda Tangan DPJP / Petugas */}
          <div className="w-full sm:w-[38%] text-center sm:text-right flex flex-col items-center sm:items-end">
            <p className="text-slate-700">Kota Bontang, {currentDateFormatted}</p>
            <p className="text-slate-800 font-semibold mt-0.5">Penanggung Jawab Pelayanan / PPA,</p>
            
            {/* Stamp Box */}
            <div className="my-2 border border-slate-800 bg-slate-50/60 px-3 py-1.5 rounded text-center w-56">
              <span className="block text-[8px] font-mono font-bold uppercase tracking-wider text-slate-700">
                TANDA TANGAN ELEKTRONIK TERSERTIFIKASI
              </span>
              <span className="block text-[8px] font-mono text-slate-500">
                ID SESI: RLB-MED-{patient.id}
              </span>
            </div>

            <p className="font-bold underline text-slate-900 text-xs mt-1">{currentUser.nama}</p>
            <p className="font-mono text-[9px] text-slate-600">
              {currentUser.strNip ? `NIP/STR: ${currentUser.strNip}` : `Peran: ${currentUser.role}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
