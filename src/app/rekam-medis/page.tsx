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
  ChevronRight,
  Search,
  ShieldAlert,
  ArrowRight,
  Eye,
  FileCheck,
  ArrowLeft
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import { OfficialCPPTDocument } from '@/components/clinical/OfficialCPPTDocument';

function RekamMedisContent() {
  const searchParams = useSearchParams();
  const { patients, cpptRecords, addCPPT, currentUser } = useClinic();

  const queryPasienId = searchParams.get('pasienId');
  const [selectedPasienId, setSelectedPasienId] = useState<string>(
    queryPasienId || (patients.length > 0 ? patients[0].id : '')
  );
  const [viewMode, setViewMode] = useState<'interactive' | 'document'>('interactive');
  const [searchRM, setSearchRM] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // New SOAP
  const [soapS, setSoapS] = useState('');
  const [soapO, setSoapO] = useState('');
  const [soapA, setSoapA] = useState('');
  const [soapP, setSoapP] = useState('');
  const [instruksi, setInstruksi] = useState('');

  useEffect(() => {
    if (queryPasienId) setSelectedPasienId(queryPasienId);
  }, [queryPasienId]);

  const selectedPatient = patients.find((p) => p.id === selectedPasienId);
  const patientCPPT = cpptRecords.filter((c) => c.pasienId === selectedPasienId);

  const filteredPatients = patients.filter((p) => {
    if (!searchRM) return true;
    const q = searchRM.toLowerCase();
    return p.nama.toLowerCase().includes(q) || p.noRm.toLowerCase().includes(q);
  });

  const handleAddSOAP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    addCPPT({
      pasienId: selectedPatient.id,
      profesi: currentUser.role === 'Dokter' ? 'Dokter' : 'Perawat',
      namaTenagaMedis: currentUser.nama,
      soap: {
        subjective: soapS,
        objective: soapO,
        assessment: soapA,
        plan: soapP,
      },
      instruksiPPA: instruksi || 'Lanjutkan perawatan balutan steril dan offloading beban.',
    });

    setSoapS('');
    setSoapO('');
    setSoapA('');
    setSoapP('');
    setInstruksi('');
    setShowAddForm(false);
  };

  return (
    <div className="w-full px-4 sm:px-6 py-5 space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Rekam Medis & Lembar CPPT Terpadu
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Catatan Perkembangan Pasien Terintegrasi (SOAP), riwayat luka kronis, dan verifikasi tindakan PPA.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode Switcher Pill */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setViewMode('interactive')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                viewMode === 'interactive'
                  ? 'bg-white text-blue-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Formulir Kerja</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('document')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                viewMode === 'document'
                  ? 'bg-white text-blue-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Format Dokumen Resmi</span>
            </button>
          </div>

          {viewMode === 'interactive' && (
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3.5 py-2 bg-blue-50 text-blue-900 font-semibold text-xs rounded-xl hover:bg-blue-100 transition border border-blue-200 flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{showAddForm ? 'Tutup Form' : '+ Catatan SOAP'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen CPPT</span>
          </button>
        </div>
      </div>

      {/* SCREEN VIEW 1: PRATINJAU DOKUMEN RESMI (A4 Real-Paper Simulation) */}
      {viewMode === 'document' ? (
        <div className="no-print space-y-4">
          <div className="bg-blue-50/70 border border-blue-200/80 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-blue-950 font-bold block text-sm">
                  Pratinjau Format Dokumen Resmi CPPT (Standar Rekam Medis)
                </strong>
                <span className="text-blue-800 text-[11px]">
                  Dokumen dicetak dalam format formulir standar Permenkes No. 24/2022 (Bebas dari kotak UI web).
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('interactive')}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Formulir</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak / Simpan PDF</span>
              </button>
            </div>
          </div>

          {/* Paper Sheet Preview Container */}
          <div className="bg-slate-200/70 p-4 sm:p-8 rounded-2xl border border-slate-300 shadow-inner flex justify-center overflow-x-auto">
            {selectedPatient ? (
              <div className="bg-white shadow-xl rounded-sm border border-slate-300 w-full max-w-[850px] overflow-hidden">
                <OfficialCPPTDocument
                  patient={selectedPatient}
                  records={patientCPPT}
                  currentUser={currentUser}
                />
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 text-xs bg-white rounded-xl border border-slate-300">
                Silakan pilih pasien di tab formulir kerja terlebih dahulu untuk memuat lembar rekam medis.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* SCREEN VIEW 2: FORMULIR KERJA (Interaktif Master-Detail) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start no-print">
          {/* Left: Patient Directory List (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari pasien (Nama, No. RM)..."
                  value={searchRM}
                  onChange={(e) => setSearchRM(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto">
              {filteredPatients.map((p) => {
                const isSelected = p.id === selectedPasienId;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPasienId(p.id)}
                    className={`p-4 cursor-pointer transition ${
                      isSelected
                        ? 'bg-blue-50/80 border-l-4 border-blue-800'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-xs text-slate-900">{p.nama}</span>
                      <span className="text-[10px] font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200 text-blue-900">
                        {p.noRm}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 truncate">{p.diagnosisMedisUtama}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                      <span>{p.jenisKelamin} • {p.tanggalLahir}</span>
                      <span className="text-emerald-700 font-semibold">{p.statusKunjungan}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Patient Chart & CPPT Timeline (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {!selectedPatient ? (
              <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-400 text-xs">
                Pilih salah satu pasien di daftar sebelah kiri untuk membuka lembar rekam medis.
              </div>
            ) : (
              <>
                {/* Patient Profile Header Card */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg font-mono shrink-0 shadow-xs">
                        {selectedPatient.nama.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-bold text-slate-900">{selectedPatient.nama}</h2>
                          <span className="text-xs font-mono font-bold bg-blue-100 text-blue-950 px-2 py-0.5 rounded">
                            {selectedPatient.noRm}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 font-mono">
                          NIK: {selectedPatient.nik} • {selectedPatient.jenisKelamin} • Lahir: {selectedPatient.tanggalLahir} • Gol: {selectedPatient.golonganDarah}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setViewMode('document')}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition flex items-center gap-1.5"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-blue-700" />
                        <span>Lihat Dokumen</span>
                      </button>
                      <Link
                        href={`/asesmen?pasienId=${selectedPatient.id}`}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-semibold rounded-lg border border-blue-200 transition flex items-center gap-1.5"
                      >
                        <Bandage className="w-3.5 h-3.5" />
                        <span>Buka Lembar Asesmen</span>
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Diagnosa Utama:</span>
                      <strong className="text-slate-800 text-xs block mt-1">{selectedPatient.diagnosisMedisUtama}</strong>
                    </div>
                    <div className="bg-rose-50/60 p-3 rounded-lg border border-rose-200">
                      <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Riwayat Alergi:</span>
                      <strong className="text-rose-900 text-xs block mt-1">{selectedPatient.riwayatAlergi}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Komorbiditas:</span>
                      <span className="text-slate-800 text-xs block mt-1">
                        {selectedPatient.riwayatPenyakit.join(', ') || 'Tidak ada catatan komorbid'}
                      </span>
                    </div>
                  </div>

                  {/* Latest Assessment Summary */}
                  {selectedPatient.asesmenTerakhir && (
                    <div className="pt-2 border-t border-slate-100">
                      <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-200 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Asesmen Luka Terakhir:</span>
                          <div className="font-bold text-slate-900 mt-0.5">
                            {selectedPatient.asesmenTerakhir.lokasiLuka} ({selectedPatient.asesmenTerakhir.ukuran.panjangCm}x{selectedPatient.asesmenTerakhir.ukuran.lebarCm} cm)
                          </div>
                        </div>
                        <div className="text-slate-600 font-mono text-[11px]">
                          Granulasi: <strong>{selectedPatient.asesmenTerakhir.dasarLuka.persenGranulasi}%</strong> | Slough: <strong>{selectedPatient.asesmenTerakhir.dasarLuka.persenSlough}%</strong> | Nyeri: <strong>{selectedPatient.asesmenTerakhir.skorNyeri}/10</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Form Input SOAP Baru */}
                {showAddForm && (
                  <div className="bg-white rounded-xl border border-blue-200 p-6 shadow-sm space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-bold text-slate-900">
                        Tambah Catatan CPPT Baru ({currentUser.role}: {currentUser.nama})
                      </h3>
                      <p className="text-xs text-slate-500">Catatan SOAP perkembangan kondisi pasien terintegrasi</p>
                    </div>

                    <form onSubmit={handleAddSOAP} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          S (Subjective) - Keluhan & Sensasi Nyeri Pasien:
                        </label>
                        <textarea
                          required
                          rows={2}
                          value={soapS}
                          onChange={(e) => setSoapS(e.target.value)}
                          placeholder="Contoh: Pasien mengeluh perban rembes dan nyeri berdenyut skala 3..."
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          O (Objective) - Pemeriksaan Fisik Luka & TTV:
                        </label>
                        <textarea
                          required
                          rows={2}
                          value={soapO}
                          onChange={(e) => setSoapO(e.target.value)}
                          placeholder="Contoh: TTV TD 130/80. Luka eksudat sedang serous, slough 20%, granulasi 70%..."
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          A (Assessment) - Analisis Klinis & Diagnosa:
                        </label>
                        <textarea
                          required
                          rows={2}
                          value={soapA}
                          onChange={(e) => setSoapA(e.target.value)}
                          placeholder="Contoh: Gangguan integritas kulit b.d ulkus diabetikum membaik..."
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          P (Plan) - Tindakan Dressing & Edukasi:
                        </label>
                        <textarea
                          required
                          rows={2}
                          value={soapP}
                          onChange={(e) => setSoapP(e.target.value)}
                          placeholder="Contoh: Irigasi NaCl + PHMB, aplikasi cadexomer iodine + foam dressing..."
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Instruksi PPA (Profesional Pemberi Asuhan):
                        </label>
                        <input
                          type="text"
                          value={instruksi}
                          onChange={(e) => setInstruksi(e.target.value)}
                          placeholder="Instruksi khusus kepada keluarga/pasien..."
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddForm(false)}
                          className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
                        >
                          Simpan Catatan CPPT
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* CPPT Timeline Entries */}
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
                  <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Catatan Perkembangan Pasien Terintegrasi (CPPT)</h3>
                      <p className="text-xs text-slate-500">Urutan kronologis tindakan medis dan catatan SOAP</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-600 bg-white px-2.5 py-1 rounded border border-slate-200">
                      {patientCPPT.length} Catatan
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {patientCPPT.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs">
                        Belum ada catatan CPPT untuk pasien ini.
                      </div>
                    ) : (
                      patientCPPT.map((item) => (
                        <div key={item.id} className="p-6 space-y-3 hover:bg-slate-50/40 transition">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                item.profesi === 'Dokter'
                                  ? 'bg-purple-50 text-purple-900 border-purple-200'
                                  : 'bg-blue-50 text-blue-900 border-blue-200'
                              }`}>
                                {item.profesi}
                              </span>
                              <strong className="text-xs text-slate-900">{item.namaTenagaMedis}</strong>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{item.tanggalWaktu}</span>
                            </div>
                          </div>

                          {/* Clean Clinical SOAP View */}
                          <div className="bg-slate-50/60 p-3.5 rounded-lg border border-slate-200 space-y-2 text-xs">
                            <div className="flex items-start gap-2">
                              <span className="font-bold text-slate-900 w-24 shrink-0">S (Subjective):</span>
                              <span className="text-slate-700 leading-relaxed flex-1">{item.soap.subjective}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="font-bold text-slate-900 w-24 shrink-0">O (Objective):</span>
                              <span className="text-slate-700 leading-relaxed flex-1">{item.soap.objective}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="font-bold text-slate-900 w-24 shrink-0">A (Assessment):</span>
                              <span className="text-slate-700 leading-relaxed flex-1">{item.soap.assessment}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="font-bold text-slate-900 w-24 shrink-0">P (Plan):</span>
                              <span className="text-slate-700 leading-relaxed flex-1">{item.soap.plan}</span>
                            </div>
                          </div>

                          {item.instruksiPPA && (
                            <div className="text-xs bg-amber-50/70 p-3 rounded-lg border border-amber-200 flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                              <div>
                                <strong className="text-amber-900">Instruksi PPA: </strong>
                                <span className="text-amber-800">{item.instruksiPPA}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* DEDICATED PRINT DOCUMENT: Rendered on paper/PDF whenever window.print() is called */}
      {selectedPatient && (
        <div className="hidden print:block print-only-document">
          <OfficialCPPTDocument
            patient={selectedPatient}
            records={patientCPPT}
            currentUser={currentUser}
          />
        </div>
      )}
    </div>
  );
}

export default function RekamMedisPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Memuat rekam medis...</div>}>
      <RekamMedisContent />
    </Suspense>
  );
}
