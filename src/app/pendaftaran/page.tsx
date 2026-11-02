'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  UserPlus, 
  Search, 
  Trash2, 
  Bandage, 
  FileText, 
  Check, 
  AlertCircle,
  Phone,
  Calendar,
  MapPin,
  HeartPulse
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useClinic } from '@/context/ClinicContext';
import { Pasien } from '@/types';

export default function PendaftaranPage() {
  const { patients, addPatient, deletePatient } = useClinic();

  const [formData, setFormData] = useState({
    nik: '',
    nama: '',
    tanggalLahir: '',
    jenisKelamin: 'Laki-laki' as Pasien['jenisKelamin'],
    alamat: '',
    noHp: '',
    pekerjaan: '',
    golonganDarah: 'O' as Pasien['golonganDarah'],
    riwayatAlergi: '',
    diagnosisMedisUtama: '',
    selectedPenyakit: [] as string[],
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const listPenyakitUmum = [
    'Diabetes Melitus',
    'Hipertensi',
    'Insufisiensi Vena',
    'Penyakit Arteri Perifer (PAD)',
    'Gagal Ginjal Kronis',
    'Asam Urat (Gout)',
    'Neuropati Perifer',
    'Stroke / Tirah Baring Lama',
  ];

  const handleCheckboxPenyakit = (penyakit: string) => {
    setFormData((prev) => {
      const exists = prev.selectedPenyakit.includes(penyakit);
      if (exists) {
        return {
          ...prev,
          selectedPenyakit: prev.selectedPenyakit.filter((p) => p !== penyakit),
        };
      } else {
        return {
          ...prev,
          selectedPenyakit: [...prev.selectedPenyakit, penyakit],
        };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.nik || !formData.tanggalLahir) {
      alert('Mohon lengkapi NIK, Nama Lengkap, dan Tanggal Lahir.');
      return;
    }

    const created = addPatient({
      nik: formData.nik,
      nama: formData.nama,
      tanggalLahir: formData.tanggalLahir,
      jenisKelamin: formData.jenisKelamin,
      alamat: formData.alamat || 'Bontang, Kalimantan Timur',
      noHp: formData.noHp || '-',
      pekerjaan: formData.pekerjaan || 'Lainnya',
      golonganDarah: formData.golonganDarah,
      riwayatAlergi: formData.riwayatAlergi || 'Tidak Ada',
      riwayatPenyakit: formData.selectedPenyakit,
      statusKunjungan: 'Antrean',
      diagnosisMedisUtama: formData.diagnosisMedisUtama || 'Pemeriksaan Luka Kronik / Akut',
    });

    setSuccessMessage(`Pasien ${created.nama} berhasil didaftarkan dengan No. RM: ${created.noRm}`);
    // Reset form
    setFormData({
      nik: '',
      nama: '',
      tanggalLahir: '',
      jenisKelamin: 'Laki-laki',
      alamat: '',
      noHp: '',
      pekerjaan: '',
      golonganDarah: 'O',
      riwayatAlergi: '',
      diagnosisMedisUtama: '',
      selectedPenyakit: [],
    });

    setTimeout(() => {
      setSuccessMessage('');
    }, 6000);
  };

  const filteredPatients = patients.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.nama.toLowerCase().includes(q) || p.noRm.toLowerCase().includes(q) || p.nik.includes(q);
  });

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title="Pendaftaran Pasien & Rekam Medis"
        subtitle="Registrasi data demografi pasien, no. RM otomatis, dan riwayat klinis"
      />

      <main className="p-6 space-y-6 max-w-7xl w-full mx-auto">
        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-lg text-xs font-semibold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <Link
              href="/asesmen"
              className="bg-emerald-700 text-white px-3 py-1 rounded text-[11px] font-bold hover:bg-emerald-800 transition"
            >
              Lanjut ke Asesmen Luka &rarr;
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Pendaftaran Pasien Baru (5 kolom) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200 mb-5">
              <div className="w-8 h-8 rounded-lg bg-[#224b9b] text-white flex items-center justify-center">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800">Form Pasien Baru</h2>
                <p className="text-[11px] text-slate-500">Nomor Rekam Medis (RM) diterbitkan otomatis</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor Induk Kependudukan (NIK) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  value={formData.nik}
                  onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                  placeholder="16 digit NIK KTP..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b] font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Lengkap Pasien *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Contoh: Bpk. Sugeng Wibowo"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b] text-slate-800 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Lahir *</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggalLahir}
                    onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b] text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin *</label>
                  <select
                    value={formData.jenisKelamin}
                    onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as Pasien['jenisKelamin'] })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b] text-slate-800 bg-white"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    value={formData.noHp}
                    onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b] text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Golongan Darah</label>
                  <select
                    value={formData.golonganDarah}
                    onChange={(e) => setFormData({ ...formData, golonganDarah: e.target.value as Pasien['golonganDarah'] })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b] text-slate-800 bg-white"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                    <option value="-">- (Belum Tahu)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  placeholder="Jl. / RT / Kelurahan, Kota Bontang..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b] text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-rose-700 mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Riwayat Alergi (Plester, Kasa, Obat, Lateks)</span>
                </label>
                <input
                  type="text"
                  value={formData.riwayatAlergi}
                  onChange={(e) => setFormData({ ...formData, riwayatAlergi: e.target.value })}
                  placeholder="Contoh: Alergi plester karet / penisilin / Tidak ada"
                  className="w-full px-3 py-2 border border-rose-200 bg-rose-50/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-blue-700" />
                  <span>Riwayat Penyakit Penyerta (Komorbiditas)</span>
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {listPenyakitUmum.map((p) => {
                    const isChecked = formData.selectedPenyakit.includes(p);
                    return (
                      <label key={p} className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-700 select-none">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCheckboxPenyakit(p)}
                          className="rounded border-slate-300 text-[#224b9b] focus:ring-[#224b9b]"
                        />
                        <span>{p}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Diagnosa Medis Utama / Keluhan Luka Awal
                </label>
                <input
                  type="text"
                  value={formData.diagnosisMedisUtama}
                  onChange={(e) => setFormData({ ...formData, diagnosisMedisUtama: e.target.value })}
                  placeholder="Contoh: Ulkus Kaki Diabetik Pedis Dextra"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b] text-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#224b9b] hover:bg-[#1b3d7e] text-white font-bold rounded-lg transition shadow-xs flex items-center justify-center gap-2 mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Simpan & Daftarkan Pasien</span>
              </button>
            </form>
          </div>

          {/* Tabel Pasien Terdaftar (7 kolom) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3 mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Daftar Pasien Terdaftar</h2>
                <p className="text-[11px] text-slate-500">Total: {patients.length} Pasien Rekam Medis</p>
              </div>

              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama, RM, NIK..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#224b9b]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 max-h-[620px] pr-1">
              {filteredPatients.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Tidak ditemukan pasien dengan kata kunci tersebut.
                </div>
              ) : (
                filteredPatients.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{p.nama}</span>
                          <span className="text-[10px] bg-[#224b9b] text-white px-2 py-0.5 rounded font-mono font-semibold">
                            {p.noRm}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-1 flex-wrap">
                          <span>NIK: <span className="font-mono text-slate-700">{p.nik}</span></span>
                          <span>{p.jenisKelamin} | Gol: {p.golonganDarah}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{p.tanggalLahir}</span>
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Yakin ingin menghapus pasien ${p.nama} (${p.noRm})?`)) {
                            deletePatient(p.id);
                          }
                        }}
                        title="Hapus Pasien"
                        className="text-slate-400 hover:text-rose-600 transition p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-700 bg-white p-2.5 rounded border border-slate-200 space-y-1">
                      <div className="font-semibold text-slate-800">
                        Diagnosa: <span className="font-normal text-slate-700">{p.diagnosisMedisUtama}</span>
                      </div>
                      <div className="text-slate-500 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{p.alamat}</span>
                      </div>
                      {p.riwayatAlergi && p.riwayatAlergi !== 'Tidak Ada' && (
                        <div className="text-rose-700 font-medium">
                          Alergi: {p.riwayatAlergi}
                        </div>
                      )}
                      {p.riwayatPenyakit.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {p.riwayatPenyakit.map((rk) => (
                            <span key={rk} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                              {rk}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{p.noHp}</span>
                      </span>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/asesmen?pasienId=${p.id}`}
                          className="px-3 py-1 bg-[#224b9b] text-white text-[11px] font-semibold rounded hover:bg-[#193774] transition flex items-center gap-1 shadow-xs"
                        >
                          <Bandage className="w-3 h-3" />
                          <span>Asesmen Luka</span>
                        </Link>
                        <Link
                          href={`/rekam-medis?pasienId=${p.id}`}
                          className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 text-[11px] font-medium rounded hover:bg-slate-100 transition flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3 text-slate-500" />
                          <span>CPPT</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
