'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  UserPlus, 
  Users, 
  Search, 
  Check, 
  AlertCircle, 
  HeartPulse, 
  ShieldAlert, 
  ArrowRight,
  Trash2,
  Calendar,
  Phone,
  MapPin,
  Bandage,
  FileText
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import { Pasien } from '@/types';

export default function PendaftaranPage() {
  const { patients, addPatient, deletePatient } = useClinic();
  const [activeView, setActiveView] = useState<'form' | 'direktori'>('form');

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

  const [searchQuery, setSearchQuery] = useState('');
  const [registeredPatient, setRegisteredPatient] = useState<Pasien | null>(null);

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
    setNik('');
    setNama('');
    setTanggalLahir('');
    setAlamat('');
    setNoHp('');
    setRiwayatAlergi('');
    setDiagnosisMedisUtama('');
  };

  const filteredPatients = patients.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.nama.toLowerCase().includes(q) || p.noRm.toLowerCase().includes(q) || p.nik.includes(q);
  });

  return (
    <div className="w-full px-8 py-6 space-y-6">
      {/* Top Header & View Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pendaftaran & Registrasi Pasien (e-RM)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Penerbitan No. Rekam Medis otomatis, pencatatan identitas demografi, dan riwayat klinis awal.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-lg text-xs font-semibold self-start md:self-auto">
          <button
            type="button"
            onClick={() => {
              setActiveView('form');
              setRegisteredPatient(null);
            }}
            className={`px-4 py-1.5 rounded-md transition flex items-center gap-2 ${
              activeView === 'form'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Formulir Pasien Baru</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('direktori')}
            className={`px-4 py-1.5 rounded-md transition flex items-center gap-2 ${
              activeView === 'direktori'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Direktori Pasien ({patients.length})</span>
          </button>
        </div>
      </div>

      {/* Success Notification Bar */}
      {registeredPatient && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-5 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                Registrasi Berhasil
              </p>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                {registeredPatient.nama} • <span className="font-mono text-emerald-800">{registeredPatient.noRm}</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Pasien telah masuk ke antrean klinis hari ini dan siap dilakukan asesmen luka.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/asesmen?pasienId=${registeredPatient.id}`}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition shadow-xs flex items-center gap-1.5"
            >
              <span>Mulai Asesmen Luka</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* View 1: Formulir Pasien Baru */}
      {activeView === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Data Identitas Demografi */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">1. Data Identitas Demografi Pasien</h2>
              <p className="text-xs text-slate-500">Informasi identitas kependudukan sesuai kartu identitas (KTP/KK)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Nomor Induk Kependudukan (NIK) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  placeholder="16 digit NIK..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:bg-white text-slate-800 font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Nama Lengkap Pasien *
                </label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Bpk. Sugeng Wibowo"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:bg-white text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Tanggal Lahir *</label>
                <input
                  type="date"
                  required
                  value={tanggalLahir}
                  onChange={(e) => setTanggalLahir(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Jenis Kelamin *</label>
                <select
                  value={jenisKelamin}
                  onChange={(e) => setJenisKelamin(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:bg-white text-slate-800"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Golongan Darah</label>
                <select
                  value={golonganDarah}
                  onChange={(e) => setGolonganDarah(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:bg-white text-slate-800"
                >
                  <option value="O">O</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="-">- (Belum Diketahui)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">No. Telepon / WhatsApp</label>
                <input
                  type="text"
                  value={noHp}
                  onChange={(e) => setNoHp(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:bg-white text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Pekerjaan</label>
                <input
                  type="text"
                  value={pekerjaan}
                  onChange={(e) => setPekerjaan(e.target.value)}
                  placeholder="Pensiunan / Swasta / ASN..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Alamat Tempat Tinggal</label>
                <input
                  type="text"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  placeholder="Jl. / RT / Kelurahan, Kota Bontang..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:bg-white text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Kategori Layanan & Riwayat Medis / Alergi */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">2. Kategori Layanan & Profil Medis Awal</h2>
              <p className="text-xs text-slate-500">Tentukan jenis kunjungan dan skrining faktor resiko penyembuhan</p>
            </div>

            {/* Service Type Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Pilih Jenis Layanan:</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {[
                  { id: 'Wound Care', desc: 'Perawatan modern luka kronik / ulkus' },
                  { id: 'Home Care', desc: 'Kunjungan ganti balutan di rumah' },
                  { id: 'Khitan', desc: 'Layanan sirkumsisi modern' },
                  { id: 'Rawat Jalan', desc: 'Konsultasi dan ganti verban ringan' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setJenisLayanan(s.id as any)}
                    className={`p-3 rounded-lg border text-left transition ${
                      jenisLayanan === s.id
                        ? 'border-blue-800 bg-blue-50/60 ring-2 ring-blue-800/20'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-slate-900">{s.id}</div>
                    <div className="text-[11px] text-slate-500 mt-1">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Riwayat Alergi (CRITICAL WARNING FIELD) */}
            <div className="bg-rose-50/50 border border-rose-200 p-4 rounded-xl text-xs space-y-1.5">
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
            <div className="text-xs space-y-2">
              <label className="block font-semibold text-slate-700 flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-blue-700" />
                <span>Penyakit Komorbiditas (Faktor Penghambat Penyembuhan Luka)</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {komorbidList.map((k) => {
                  const isChecked = selectedPenyakit.includes(k);
                  return (
                    <label key={k} className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-700 select-none">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleKomorbid(k)}
                        className="rounded border-slate-300 text-blue-800 focus:ring-blue-800"
                      />
                      <span className={isChecked ? 'font-semibold text-slate-900' : ''}>{k}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Keluhan / Diagnosa Awal */}
            <div className="text-xs">
              <label className="block font-semibold text-slate-700 mb-1.5">
                Diagnosa Awal / Keluhan Utama Terkait Luka
              </label>
              <input
                type="text"
                value={diagnosisMedisUtama}
                onChange={(e) => setDiagnosisMedisUtama(e.target.value)}
                placeholder="Contoh: Ulkus Kaki Diabetikum Dextra Wagner Grade 2"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:bg-white text-slate-800"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setNik('');
                setNama('');
                setAlamat('');
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              Kosongkan Formulir
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shadow-xs flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Daftarkan Pasien & Terbitkan No. RM</span>
            </button>
          </div>
        </form>
      )}

      {/* View 2: Direktori Pasien Terdaftar */}
      {activeView === 'direktori' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Direktori Rekam Medis Pasien</h2>
              <p className="text-xs text-slate-500">Total {patients.length} rekam medis terdaftar dalam pangkalan data</p>
            </div>

            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pasien (Nama, RM, NIK)..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 text-slate-800"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredPatients.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Tidak ditemukan pasien yang sesuai dengan kata kunci pencarian.
              </div>
            ) : (
              filteredPatients.map((p) => (
                <div key={p.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 p-2 rounded-lg transition">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-sm text-slate-900">{p.nama}</span>
                      <span className="text-[11px] font-mono font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                        {p.noRm}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-600">{p.jenisKelamin}, Lahir {p.tanggalLahir}</span>
                    </div>

                    <div className="text-xs text-slate-600 mt-1 flex items-center gap-4 flex-wrap">
                      <span>NIK: <strong className="font-mono text-slate-800">{p.nik}</strong></span>
                      <span>Diagnosa: <strong className="text-slate-800">{p.diagnosisMedisUtama}</strong></span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Phone className="w-3 h-3" />
                        <span>{p.noHp}</span>
                      </span>
                    </div>

                    {p.riwayatPenyakit.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {p.riwayatPenyakit.map((rk) => (
                          <span key={rk} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                            {rk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/asesmen?pasienId=${p.id}`}
                      className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition flex items-center gap-1.5 shadow-xs"
                    >
                      <Bandage className="w-3.5 h-3.5" />
                      <span>Asesmen Luka</span>
                    </Link>
                    <Link
                      href={`/rekam-medis?pasienId=${p.id}`}
                      className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 transition flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>Lembar CPPT</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Hapus rekam medis pasien ${p.nama}?`)) deletePatient(p.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Hapus Pasien"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
