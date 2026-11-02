'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FileText, 
  Printer, 
  PlusCircle, 
  Clock, 
  User, 
  Bandage, 
  AlertCircle, 
  Check, 
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useClinic } from '@/context/ClinicContext';

function RekamMedisContent() {
  const searchParams = useSearchParams();
  const { patients, cpptRecords, addCPPT, currentUser } = useClinic();

  const queryPasienId = searchParams.get('pasienId');
  const [selectedPasienId, setSelectedPasienId] = useState<string>(
    queryPasienId || (patients.length > 0 ? patients[0].id : '')
  );

  useEffect(() => {
    if (queryPasienId) {
      setSelectedPasienId(queryPasienId);
    }
  }, [queryPasienId]);

  const selectedPatient = patients.find((p) => p.id === selectedPasienId);
  const patientCPPT = cpptRecords.filter((c) => c.pasienId === selectedPasienId);

  // New CPPT Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');
  const [instruksiPPA, setInstruksiPPA] = useState('');

  const handleAddCPPT = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    addCPPT({
      pasienId: selectedPatient.id,
      profesi: currentUser.role === 'Dokter' ? 'Dokter' : 'Perawat',
      namaTenagaMedis: currentUser.nama,
      soap: {
        subjective,
        objective,
        assessment,
        plan,
      },
      instruksiPPA: instruksiPPA || 'Lanjutkan pemantauan klinis rutin.',
    });

    setSubjective('');
    setObjective('');
    setAssessment('');
    setPlan('');
    setInstruksiPPA('');
    setShowAddForm(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="print:hidden">
        <Header
          title="Rekam Medis & Catatan Perkembangan (CPPT)"
          subtitle="Catatan Perkembangan Pasien Terintegrasi (SOAP) dan lembar riwayat klinis"
        />
      </div>

      <main className="p-6 space-y-6 max-w-7xl w-full mx-auto print:p-0 print:m-0">
        {/* Pasien Selector & Print Button (Hidden in print) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Pilih Pasien:</span>
            <select
              value={selectedPasienId}
              onChange={(e) => setSelectedPasienId(e.target.value)}
              className="text-xs font-semibold px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b] bg-slate-50 text-slate-800 min-w-[280px]"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama} ({p.noRm}) - {p.diagnosisMedisUtama}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-2 bg-blue-50 text-[#224b9b] font-semibold text-xs rounded-lg hover:bg-blue-100 transition border border-blue-200 flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'Tutup Form SOAP' : 'Tambah Catatan SOAP'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 bg-[#224b9b] text-white font-semibold text-xs rounded-lg hover:bg-[#1b3d7e] transition shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Lembar CPPT</span>
            </button>
          </div>
        </div>

        {selectedPatient ? (
          <div className="space-y-6">
            {/* Header Informasi Pasien (Printable) */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs print:border-none print:shadow-none print:p-0">
              <div className="border-b border-slate-200 pb-4 mb-4 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-slate-900">{selectedPatient.nama}</h2>
                    <span className="bg-[#224b9b] text-white text-xs font-mono font-bold px-2.5 py-0.5 rounded">
                      {selectedPatient.noRm}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-mono">
                    NIK: {selectedPatient.nik} | {selectedPatient.jenisKelamin} | Lahir: {selectedPatient.tanggalLahir} | Gol. Darah: {selectedPatient.golonganDarah}
                  </p>
                </div>
                <div className="text-right text-xs">
                  <span className="text-slate-500 block">Status Pelayanan:</span>
                  <span className="font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {selectedPatient.statusKunjungan}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 block">Diagnosa Utama:</span>
                  <strong className="text-slate-800 text-xs block mt-0.5">{selectedPatient.diagnosisMedisUtama}</strong>
                </div>
                <div className="bg-rose-50/60 p-3 rounded-lg border border-rose-200">
                  <span className="text-[11px] font-semibold text-rose-700 block">Riwayat Alergi:</span>
                  <strong className="text-rose-900 text-xs block mt-0.5">{selectedPatient.riwayatAlergi}</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 block">Penyakit Penyerta:</span>
                  <div className="text-slate-800 text-xs mt-0.5">
                    {selectedPatient.riwayatPenyakit.length > 0
                      ? selectedPatient.riwayatPenyakit.join(', ')
                      : 'Tidak ada komorbiditas tercatat'}
                  </div>
                </div>
              </div>
            </div>

            {/* Asesmen Luka Aktif (Ringkasan) */}
            {selectedPatient.asesmenTerakhir && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs print:border print:border-slate-300">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                  <div className="flex items-center gap-2">
                    <Bandage className="w-4 h-4 text-[#224b9b]" />
                    <h3 className="text-sm font-bold text-slate-800">Ringkasan Asesmen Luka Terakhir</h3>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Pemeriksa: <strong>{selectedPatient.asesmenTerakhir.perawatPemeriksa}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Lokasi Luka:</span>
                    <strong className="text-slate-800">{selectedPatient.asesmenTerakhir.lokasiLuka}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Ukuran (PxLxT):</span>
                    <strong className="text-slate-800 font-mono">
                      {selectedPatient.asesmenTerakhir.ukuran.panjangCm} x {selectedPatient.asesmenTerakhir.ukuran.lebarCm} cm (dalam {selectedPatient.asesmenTerakhir.ukuran.kedalamanMm} mm)
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Dasar Luka:</span>
                    <span className="text-slate-800 font-medium">
                      G: {selectedPatient.asesmenTerakhir.dasarLuka.persenGranulasi}% | S: {selectedPatient.asesmenTerakhir.dasarLuka.persenSlough}% | N: {selectedPatient.asesmenTerakhir.dasarLuka.persenNekrotik}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Eksudat:</span>
                    <strong className="text-slate-800">
                      {selectedPatient.asesmenTerakhir.eksudat.jumlah} ({selectedPatient.asesmenTerakhir.eksudat.warna})
                    </strong>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 bg-slate-50 p-3 rounded-lg text-xs space-y-1">
                  <div>
                    <span className="font-semibold text-slate-700">Dressing Primer:</span>{' '}
                    <span className="text-slate-800">{selectedPatient.asesmenTerakhir.tindakanWoundCare.primaryDressing}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Dressing Sekunder:</span>{' '}
                    <span className="text-slate-800">{selectedPatient.asesmenTerakhir.tindakanWoundCare.secondaryDressing}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Form Tambah SOAP Baru (Conditional) */}
            {showAddForm && (
              <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm print:hidden space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
                  <PlusCircle className="w-4 h-4 text-[#224b9b]" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Input Catatan CPPT Baru ({currentUser.role}: {currentUser.nama})
                  </h3>
                </div>

                <form onSubmit={handleAddCPPT} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      S (Subjective) - Keluhan Pasien, Sensasi Nyeri, Riwayat Kejadian:
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={subjective}
                      onChange={(e) => setSubjective(e.target.value)}
                      placeholder="Contoh: Pasien mengeluh nyeri pada balutan perban kaki kanan..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      O (Objective) - Hasil Pemeriksaan Fisik, TTV, Karakteristik Luka:
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                      placeholder="Contoh: TTV TD 130/80. Luka eksudat sedang serous, slough 20%..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      A (Assessment) - Analisis Klinis / Diagnosa Keperawatan:
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={assessment}
                      onChange={(e) => setAssessment(e.target.value)}
                      placeholder="Contoh: Kerusakan integritas kulit b.d insufisiensi sirkulasi perifer..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      P (Plan) - Rencana Tindakan, Perawatan Luka, Edukasi:
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={plan}
                      onChange={(e) => setPlan(e.target.value)}
                      placeholder="Contoh: 1. Rawat luka NaCl + Foam dressing. 2. Kontrol 3 hari lagi..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Instruksi PPA (Profesional Pemberi Asuhan):
                    </label>
                    <input
                      type="text"
                      value={instruksiPPA}
                      onChange={(e) => setInstruksiPPA(e.target.value)}
                      placeholder="Contoh: Pertahankan balutan kering, edukasi diit rendah gula"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-200 transition"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#224b9b] text-white font-bold text-xs rounded-lg hover:bg-[#1b3d7e] transition shadow-xs"
                    >
                      Simpan Catatan CPPT
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Riwayat Lembar CPPT Terintegrasi */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden print:border print:border-slate-400">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Catatan Perkembangan Pasien Terintegrasi (CPPT)</h3>
                  <p className="text-xs text-slate-500">Urutan kronologis catatan SOAP tenaga kesehatan</p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-600 bg-white px-2.5 py-1 rounded border border-slate-200">
                  {patientCPPT.length} Catatan Masuk
                </span>
              </div>

              {patientCPPT.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Belum ada catatan CPPT untuk pasien ini. Klik tombol "Tambah Catatan SOAP" di atas untuk menambahkan.
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {patientCPPT.map((cppt) => (
                    <div key={cppt.id} className="p-6 space-y-4 hover:bg-slate-50/50 transition">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                            cppt.profesi === 'Dokter'
                              ? 'bg-purple-50 text-purple-800 border-purple-200'
                              : 'bg-blue-50 text-blue-800 border-blue-200'
                          }`}>
                            {cppt.profesi}
                          </span>
                          <strong className="text-xs text-slate-900">{cppt.namaTenagaMedis}</strong>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{cppt.tanggalWaktu}</span>
                        </div>
                      </div>

                      {/* SOAP Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                          <span className="font-bold text-slate-800 block mb-1">S (Subjective):</span>
                          <p className="text-slate-700 leading-relaxed">{cppt.soap.subjective}</p>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                          <span className="font-bold text-slate-800 block mb-1">O (Objective):</span>
                          <p className="text-slate-700 leading-relaxed">{cppt.soap.objective}</p>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                          <span className="font-bold text-slate-800 block mb-1">A (Assessment):</span>
                          <p className="text-slate-700 leading-relaxed">{cppt.soap.assessment}</p>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                          <span className="font-bold text-slate-800 block mb-1">P (Plan):</span>
                          <p className="text-slate-700 leading-relaxed">{cppt.soap.plan}</p>
                        </div>
                      </div>

                      {cppt.instruksiPPA && (
                        <div className="text-xs bg-amber-50/70 p-3 rounded-lg border border-amber-200 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-amber-900">Instruksi PPA: </span>
                            <span className="text-amber-800">{cppt.instruksiPPA}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500 text-xs">
            Tidak ada pasien yang dipilih. Silakan pilih pasien dari menu dropdown di atas atau daftar pasien baru.
          </div>
        )}
      </main>
    </div>
  );
}

export default function RekamMedisPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Memuat rekam medis...</div>}>
      <RekamMedisContent />
    </Suspense>
  );
}
