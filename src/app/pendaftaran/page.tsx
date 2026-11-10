'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  UserPlus, 
  Search, 
  Check, 
  AlertCircle, 
  ShieldAlert, 
  ArrowRight,
  Trash2,
  Phone,
  MapPin,
  Bandage,
  FileText,
  X,
  HeartPulse,
  Filter,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import { Pasien } from '@/types';

function DirektoriPasienContent() {
  const searchParams = useSearchParams();
  const { patients, addPatient, deletePatient } = useClinic();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'semua' | 'antrean' | 'alergi' | 'dm'>('semua');
  const [registeredPatient, setRegisteredPatient] = useState<Pasien | null>(null);

  // Auto-open modal if query parameter ?tambah=true is present
  useEffect(() => {
    if (searchParams.get('tambah') === 'true') {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  // Form State
  const [nik, setNik] = useState('');
  const [nama, setNama] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [golonganDarah, setGolonganDarah] = useState<Pasien['golonganDarah']>('O');
  const [alamat, setAlamat] = useState('');
  const [noHp, setNoHp] = useState('');
  const [pekerjaan, setPekerjaan] = useState('');
  const [riwayatAlergi, setRiwayatAlergi] = useState('');
  const [diagnosisMedisUtama, setDiagnosisMedisUtama] = useState('');
  const [selectedPenyakit, setSelectedPenyakit] = useState<string[]>(['Diabetes Melitus']);
  const [jenisLayanan, setJenisLayanan] = useState<'Wound Care' | 'Home Care' | 'Khitan' | 'Rawat Jalan'>('Wound Care');

  const komorbidList = [
    'Diabetes Melitus Tipe 1/2',
    'Hipertensi',
    'Insufisiensi Vena Kronik',
    'Penyakit Arteri Perifer (PAD)',
    'Gagal Ginjal Kronik (CKD)',
    'Stroke / Imobilisasi Tirah Baring',
    'Neuropati Perifer',
    'Penyakit Jantung Koroner',
  ];

  const handleToggleKomorbid = (k: string) => {
    if (selectedPenyakit.includes(k)) {
      setSelectedPenyakit(selectedPenyakit.filter((item) => item !== k));
    } else {
      setSelectedPenyakit([...selectedPenyakit, k]);
    }
  };

  const handleResetForm = () => {
    setNik('');
    setNama('');
    setTanggalLahir('');
    setAlamat('');
    setNoHp('');
    setPekerjaan('');
    setRiwayatAlergi('');
    setDiagnosisMedisUtama('');
    setSelectedPenyakit(['Diabetes Melitus']);
    setJenisLayanan('Wound Care');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !nik || !tanggalLahir) {
      alert('Mohon lengkapi NIK, Nama Lengkap, dan Tanggal Lahir.');
      return;
    }

    const created = addPatient({
      nik,
      nama,
      tanggalLahir,
      jenisKelamin,
      alamat: alamat || 'Kota Bontang, Kalimantan Timur',
      noHp: noHp || '-',
      pekerjaan: pekerjaan || 'Karyawan / Pensiunan',
      golonganDarah,
      riwayatAlergi: riwayatAlergi || 'Tidak Ada',
      riwayatPenyakit: selectedPenyakit,
      statusKunjungan: 'Antrean',
      diagnosisMedisUtama: diagnosisMedisUtama || `Pelayanan ${jenisLayanan}`,
    });

    setRegisteredPatient(created);
    handleResetForm();
    setIsModalOpen(false);
  };

  // Filtered patients list
  const filteredPatients = patients.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = p.nama.toLowerCase().includes(q) || 
                    p.noRm.toLowerCase().includes(q) || 
                    p.nik.includes(q) ||
                    p.noHp.includes(q) ||
                    p.alamat.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (filterCategory === 'antrean') {
      return p.statusKunjungan === 'Antrean' || p.statusKunjungan === 'Sedang Diperiksa';
    }
    if (filterCategory === 'alergi') {
      return p.riwayatAlergi && p.riwayatAlergi !== 'Tidak Ada';
    }
    if (filterCategory === 'dm') {
      return p.riwayatPenyakit.some((k) => k.toLowerCase().includes('diabetes')) ||
             p.diagnosisMedisUtama.toLowerCase().includes('diabet');
    }
    return true;
  });

  const antreanCount = patients.filter((p) => p.statusKunjungan === 'Antrean' || p.statusKunjungan === 'Sedang Diperiksa').length;
  const alergiCount = patients.filter((p) => p.riwayatAlergi && p.riwayatAlergi !== 'Tidak Ada').length;
  const dmCount = patients.filter((p) => 
    p.riwayatPenyakit.some((k) => k.toLowerCase().includes('diabetes')) ||
    p.diagnosisMedisUtama.toLowerCase().includes('diabet')
  ).length;

  return (
    <div className="w-full px-4 sm:px-6 py-5 space-y-5">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Direktori Pasien & Rekam Medis (e-RM)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pangkalan data demografi, no. rekam medis otomatis, skrining alergi, dan riwayat klinis terintegrasi.
          </p>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shadow-xs flex items-center gap-2 self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Registrasi Pasien Baru</span>
        </button>
      </div>

      {/* Success Alert Banner (Shown after registration) */}
      {registeredPatient && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                Registrasi Berhasil Diterbitkan
              </p>
              <h3 className="text-xs font-bold text-slate-900 mt-0.5">
                {registeredPatient.nama} • No. RM: <span className="font-mono text-emerald-800 font-bold">{registeredPatient.noRm}</span>
              </h3>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Pasien telah masuk ke direktori dan antrean ruang perawatan luka hari ini.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <Link
              href={`/asesmen?pasienId=${registeredPatient.id}`}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition shadow-xs flex items-center gap-1.5"
            >
              <span>Mulai Asesmen Luka</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setRegisteredPatient(null)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
              title="Tutup Notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Summary KPI Cards (Compact Medical Row) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Total Terdaftar</span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">{patients.length} <span className="text-xs font-normal text-slate-500">pasien</span></span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
            {patients.length}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Antrean Aktif</span>
            <span className="text-xl font-extrabold text-amber-600 mt-0.5 block">{antreanCount} <span className="text-xs font-normal text-slate-500">pasien</span></span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
            {antreanCount}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Peringatan Alergi</span>
            <span className="text-xl font-extrabold text-rose-600 mt-0.5 block">{alergiCount} <span className="text-xs font-normal text-slate-500">kasus</span></span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
            {alergiCount}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Komorbid Diabetes</span>
            <span className="text-xl font-extrabold text-emerald-600 mt-0.5 block">{dmCount} <span className="text-xs font-normal text-slate-500">pasien</span></span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
            {dmCount}
          </div>
        </div>
      </div>

      {/* Directory Main Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Search & Filter Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Global Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama pasien, No. RM, NIK, alamat..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800 transition"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setFilterCategory('semua')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterCategory === 'semua'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({patients.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('antrean')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterCategory === 'antrean'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Antrean ({antreanCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('alergi')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterCategory === 'alergi'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Ada Alergi ({alergiCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('dm')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterCategory === 'dm'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              DM ({dmCount})
            </button>
          </div>
        </div>

        {/* Directory Table (5 Proportional Columns, Exactly 100% Full Width, Zero Overlap, Zero Scrollbar) */}
        <div className="w-full">
          <table className="w-full text-left text-xs table-fixed">
            <thead className="bg-slate-50/90 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="w-[21%] px-3.5 py-3">No. RM & Nama Pasien</th>
                <th className="w-[19%] px-3 py-3">Kontak & Domisili</th>
                <th className="w-[27%] px-3 py-3">Diagnosa & Profil Medis</th>
                <th className="w-[12%] px-2 py-3 text-center">Status</th>
                <th className="w-[21%] px-3 py-3 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                    Tidak ditemukan data pasien yang sesuai dengan kata kunci atau filter.
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
                      {/* 1. Nama & RM */}
                      <td className="px-4 py-3.5 align-middle">
                        <div className="font-bold text-sm text-slate-900 leading-snug">
                          {p.nama}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/80">
                            {p.noRm}
                          </span>
                          <span>•</span>
                          <span>{p.jenisKelamin === 'Laki-laki' ? 'L' : 'P'}, Lahir {p.tanggalLahir}</span>
                        </div>
                      </td>

                      {/* 2. Kontak & Domisili */}
                      <td className="px-4 py-3.5 align-middle">
                        <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="font-mono">{p.noHp}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate" title={`NIK: ${p.nik}`}>
                          NIK: {p.nik}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5" title={p.alamat}>
                          {p.alamat}
                        </div>
                      </td>

                      {/* 3. Diagnosa & Riwayat Medis / Alergi */}
                      <td className="px-4 py-3.5 align-middle">
                        <div className="font-semibold text-slate-800 text-xs leading-snug break-words">
                          {p.diagnosisMedisUtama}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          {p.riwayatAlergi && p.riwayatAlergi !== 'Tidak Ada' ? (
                            <span 
                              title={`Alergi: ${p.riwayatAlergi}`}
                              className="inline-flex items-center gap-1 text-[10px] text-rose-700 font-medium bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200"
                            >
                              <ShieldAlert className="w-3 h-3 shrink-0 text-rose-600" />
                              <span>Alergi: {p.riwayatAlergi}</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">Tanpa alergi</span>
                          )}

                          {p.riwayatPenyakit && p.riwayatPenyakit.slice(0, 2).map((rk) => (
                            <span key={rk} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                              {rk}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* 4. Status Kunjungan (Spacious & Clean) */}
                      <td className="px-2 py-3.5 align-middle text-center whitespace-nowrap">
                        <span className={`px-2 py-1 text-[10px] font-semibold rounded-md border inline-block ${statusBadge}`}>
                          {p.statusKunjungan}
                        </span>
                      </td>

                      {/* 5. Tindakan Cepat (21% Width - Zero Overlap, Perfect Alignment) */}
                      <td className="px-3 py-3.5 align-middle text-right whitespace-nowrap">
                        <div className="flex items-center gap-1 justify-end">
                          <Link
                            href={`/asesmen?pasienId=${p.id}`}
                            title="Mulai Asesmen Klinis & Peta Tubuh"
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded transition shadow-xs shrink-0"
                          >
                            <Bandage className="w-3 h-3" />
                            <span>Asesmen</span>
                          </Link>
                          <Link
                            href={`/rekam-medis?pasienId=${p.id}`}
                            title="Buka Catatan CPPT Pasien"
                            className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-slate-300 text-slate-700 text-[11px] font-medium rounded hover:bg-slate-50 transition shadow-xs shrink-0"
                          >
                            <FileText className="w-3 h-3 text-slate-500" />
                            <span>CPPT</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Hapus rekam medis pasien ${p.nama}? Data asesmen terkait akan ikut terhapus.`)) {
                                deletePatient(p.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition shrink-0"
                            title="Hapus Rekam Medis"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* MODAL REGISTRASI PASIEN BARU */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Formulir Registrasi Pasien Baru</h2>
                  <p className="text-[11px] text-slate-500">Nomor Rekam Medis (RM) diterbitkan otomatis oleh sistem</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* Bagian 1: Data Identitas Demografi */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    1. Data Demografi & Kependudukan
                  </h3>
                  <span className="text-[10px] text-slate-400">* Wajib diisi</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      NIK KTP (16 Digit) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={16}
                      value={nik}
                      onChange={(e) => setNik(e.target.value)}
                      placeholder="Contoh: 647401..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800 font-mono"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Nama Lengkap Pasien *
                    </label>
                    <input
                      type="text"
                      required
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Contoh: Bpk. Sugeng Wibowo"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tanggal Lahir *</label>
                    <input
                      type="date"
                      required
                      value={tanggalLahir}
                      onChange={(e) => setTanggalLahir(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin *</label>
                    <select
                      value={jenisKelamin}
                      onChange={(e) => setJenisKelamin(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Golongan Darah</label>
                    <select
                      value={golonganDarah}
                      onChange={(e) => setGolonganDarah(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800"
                    >
                      <option value="O">O</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="AB">AB</option>
                      <option value="-">- (Belum Tahu)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp / HP</label>
                    <input
                      type="text"
                      value={noHp}
                      onChange={(e) => setNoHp(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Pekerjaan</label>
                    <input
                      type="text"
                      value={pekerjaan}
                      onChange={(e) => setPekerjaan(e.target.value)}
                      placeholder="Pensiunan / Karyawan..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Alamat Domisili</label>
                    <input
                      type="text"
                      value={alamat}
                      onChange={(e) => setAlamat(e.target.value)}
                      placeholder="Jl. / RT / Kelurahan, Kota Bontang..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Bagian 2: Layanan & Alergi */}
              <div className="space-y-4 pt-2">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    2. Jenis Layanan & Skrining Alergi
                  </h3>
                </div>

                {/* Jenis Layanan */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-2">Pilih Jenis Pelayanan:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'Wound Care', title: 'Wound Care', desc: 'Perawatan modern luka kronis/ulkus' },
                      { id: 'Home Care', title: 'Home Care', desc: 'Perawatan ganti balutan di rumah' },
                      { id: 'Khitan', title: 'Khitan', desc: 'Layanan sirkumsisi modern' },
                      { id: 'Rawat Jalan', title: 'Rawat Jalan', desc: 'Konsultasi & balutan ringan' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setJenisLayanan(s.id as any)}
                        className={`p-2.5 rounded-lg border text-left transition ${
                          jenisLayanan === s.id
                            ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600 text-blue-950'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="font-bold">{s.title}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{s.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Critical Allergy Warning */}
                <div className="bg-rose-50/60 border border-rose-200 p-3.5 rounded-xl space-y-1.5">
                  <label className="block font-bold text-rose-800 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Riwayat Alergi Pasien (Plester, Kasa, Lateks, Antiseptik, Obat)</span>
                  </label>
                  <input
                    type="text"
                    value={riwayatAlergi}
                    onChange={(e) => setRiwayatAlergi(e.target.value)}
                    placeholder="Contoh: Alergi plester karet / penisilin / Tidak ada"
                    className="w-full px-3 py-2 bg-white border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800"
                  />
                </div>

                {/* Komorbiditas */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4 text-blue-600" />
                    <span>Penyakit Komorbiditas (Faktor Penghambat Penyembuhan Luka)</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {komorbidList.map((k) => {
                      const isChecked = selectedPenyakit.includes(k);
                      return (
                        <button
                          key={k}
                          type="button"
                          onClick={() => handleToggleKomorbid(k)}
                          className={`p-2 rounded-lg border text-left flex items-start gap-2 transition ${
                            isChecked
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 mt-0.5 rounded flex items-center justify-center shrink-0 border ${
                            isChecked ? 'border-white bg-blue-700' : 'border-slate-300'
                          }`}>
                            {isChecked && <Check className="w-2.5 h-2.5 text-white" />}
                          </span>
                          <span className="text-[11px] font-semibold leading-tight">{k}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Diagnosa Medis Utama */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Diagnosa Klinis Awal / Alasan Kunjungan
                  </label>
                  <input
                    type="text"
                    value={diagnosisMedisUtama}
                    onChange={(e) => setDiagnosisMedisUtama(e.target.value)}
                    placeholder="Contoh: Ulkus Diabetikum Pedis Dextra Wagner Grade 2"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    handleResetForm();
                    setIsModalOpen(false);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shadow-xs flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Simpan & Terbitkan No. RM</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PendaftaranPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-slate-400">Memuat direktori pasien...</div>}>
      <DirektoriPasienContent />
    </Suspense>
  );
}
