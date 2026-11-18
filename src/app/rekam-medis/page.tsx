'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
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
  ArrowLeft,
  CheckCircle2,
  X
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
  const [showAddForm, setShowAddForm] = useState(false);

  // Combobox Search Dropdown State
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPatientDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // New SOAP Form State
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
    const q = patientSearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.nama.toLowerCase().includes(q) ||
      p.noRm.toLowerCase().includes(q) ||
      p.nik.includes(q) ||
      p.diagnosisMedisUtama.toLowerCase().includes(q)
    );
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
      instruksiPPA: instruksi || 'Lanjutkan perawatan balutan steril dan evaluasi berkala.',
    });

    setSoapS('');
    setSoapO('');
    setSoapA('');
    setSoapP('');
    setInstruksi('');
    setShowAddForm(false);
  };

  return (
    <div className="w-full px-4 sm:px-6 py-4 sm:py-5 space-y-4 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200 no-print">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Rekam Medis & Lembar CPPT Terpadu</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Catatan Perkembangan Pasien Terintegrasi (SOAP) dan riwayat tindakan klinis PPA.
          </p>
        </div>

        {/* Action Controls: 2 Balanced Blocks on Mobile, 1 Inline Row on Desktop */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('interactive')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                viewMode === 'interactive'
                  ? 'bg-white text-blue-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Formulir Kerja</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('document')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                viewMode === 'document'
                  ? 'bg-white text-blue-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Format Cetak</span>
            </button>
          </div>

          {/* Action Buttons: 2 cols on mobile */}
          <div className="grid grid-cols-2 sm:flex items-center gap-2">
            {viewMode === 'interactive' && (
              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="py-2 px-3 sm:px-3.5 sm:py-1.5 bg-blue-50 text-blue-900 font-bold text-xs rounded-xl hover:bg-blue-100 transition border border-blue-200 flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <PlusCircle className="w-4 h-4 text-blue-700 shrink-0" />
                <span>{showAddForm ? 'Tutup Form' : '+ Catatan SOAP'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => window.print()}
              className="py-2 px-3 sm:px-4 sm:py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4 shrink-0" />
              <span>Cetak Dokumen</span>
            </button>
          </div>
        </div>
      </div>

      {/* UNIFIED PATIENT HEADER CARD */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.06)] space-y-3.5 no-print relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-blue-600">
        {/* Top Row: Patient Identity + Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {selectedPatient && (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base sm:text-lg font-mono shrink-0 shadow-xs">
                {selectedPatient.nama.charAt(0)}
              </div>
            )}

            <div className="flex-1 min-w-0" ref={dropdownRef}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Pasien Pemeriksaan:
                </span>
                {selectedPatient && (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Status: {selectedPatient.statusKunjungan}
                  </span>
                )}
              </div>

              {/* Combobox Dropdown Trigger */}
              <div className="relative max-w-lg">
                <button
                  type="button"
                  onClick={() => setIsPatientDropdownOpen(!isPatientDropdownOpen)}
                  className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/90 border border-slate-200 rounded-xl text-left text-xs transition flex items-center justify-between gap-2 shadow-2xs group"
                >
                  {selectedPatient ? (
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-bold text-slate-900 text-sm truncate">{selectedPatient.nama}</span>
                      <span className="font-mono text-[11px] text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded font-semibold shrink-0">
                        {selectedPatient.noRm}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400">Pilih pasien untuk membuka rekam medis...</span>
                  )}
                  <ChevronRight className={`w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform duration-200 shrink-0 ${isPatientDropdownOpen ? 'rotate-90' : ''}`} />
                </button>

                {/* Popover */}
                {isPatientDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1.5 w-full bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                    <div className="p-2.5 border-b border-slate-100 bg-slate-50/70">
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          autoFocus
                          placeholder="Ketik Nama, No. RM, NIK, atau Diagnosis..."
                          value={patientSearchQuery}
                          onChange={(e) => setPatientSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                      {filteredPatients.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400">
                          Tidak ditemukan pasien dengan kata kunci &quot;{patientSearchQuery}&quot;
                        </div>
                      ) : (
                        filteredPatients.map((p) => {
                          const isSelected = p.id === selectedPasienId;
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                setSelectedPasienId(p.id);
                                setIsPatientDropdownOpen(false);
                                setPatientSearchQuery('');
                              }}
                              className={`w-full text-left px-3.5 py-2.5 hover:bg-blue-50/60 transition flex items-center justify-between gap-3 text-xs ${
                                isSelected ? 'bg-blue-50/80 font-bold' : ''
                              }`}
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-slate-900 truncate">{p.nama}</span>
                                  <span className="font-mono text-[10px] text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded font-semibold">
                                    {p.noRm}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                  {p.diagnosisMedisUtama}
                                </p>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {selectedPatient && (
                <p className="text-[11px] text-slate-500 mt-1 font-mono truncate">
                  NIK: {selectedPatient.nik || '-'} • {selectedPatient.jenisKelamin} • Lahir: {selectedPatient.tanggalLahir}
                </p>
              )}
            </div>
          </div>

          {/* Quick Action Link */}
          {selectedPatient && (
            <div className="flex items-center gap-2 self-start sm:self-center shrink-0 w-full sm:w-auto">
              <Link
                href={`/asesmen?pasienId=${selectedPatient.id}`}
                className="w-full sm:w-auto px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold rounded-xl border border-blue-200 transition flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Bandage className="w-3.5 h-3.5 text-blue-700" />
                <span>Buka Lembar Asesmen</span>
              </Link>
            </div>
          )}
        </div>

        {/* 1. MOBILE CLINICAL CHIPS BAR (block sm:hidden) */}
        {selectedPatient && (
          <div className="block sm:hidden bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1.5 text-xs">
            <div className="flex items-start gap-1.5">
              <span className="font-bold text-slate-700 text-[10px] uppercase shrink-0 mt-0.5">Diagnosa:</span>
              <span className="font-semibold text-slate-900 text-xs leading-snug">{selectedPatient.diagnosisMedisUtama}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              {selectedPatient.riwayatAlergi && selectedPatient.riwayatAlergi !== 'Tidak Ada' ? (
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  Alergi: {selectedPatient.riwayatAlergi}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">Tanpa riwayat alergi</span>
              )}
              {selectedPatient.riwayatPenyakit.length > 0 && (
                <span className="text-[10px] text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  {selectedPatient.riwayatPenyakit.join(', ')}
                </span>
              )}
            </div>
          </div>
        )}

        {/* 2. DESKTOP CLINICAL INFO 3-CARD GRID (hidden sm:grid) */}
        {selectedPatient && (
          <div className="hidden sm:grid grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Diagnosa Utama:</span>
              <strong className="text-slate-900 text-xs block mt-1">{selectedPatient.diagnosisMedisUtama}</strong>
            </div>

            <div className={`p-3.5 rounded-xl border ${
              selectedPatient.riwayatAlergi && selectedPatient.riwayatAlergi !== 'Tidak Ada'
                ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                : 'bg-slate-50/80 border-slate-200 text-slate-700'
            }`}>
              <span className="text-[10px] font-bold uppercase tracking-wider block">Riwayat Alergi:</span>
              <strong className="text-xs block mt-1">
                {selectedPatient.riwayatAlergi && selectedPatient.riwayatAlergi !== 'Tidak Ada'
                  ? selectedPatient.riwayatAlergi
                  : 'Tidak Ada Riwayat Alergi'}
              </strong>
            </div>

            <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Komorbiditas / Penyakit:</span>
              <span className="text-slate-800 text-xs block mt-1">
                {selectedPatient.riwayatPenyakit.length > 0 ? selectedPatient.riwayatPenyakit.join(', ') : 'Tidak ada catatan komorbid'}
              </span>
            </div>
          </div>
        )}

        {/* Latest Wound Assessment Strip */}
        {selectedPatient?.asesmenTerakhir && (
          <div className="pt-2 border-t border-slate-100">
            <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-200/70 text-xs flex flex-col md:flex-row md:items-center justify-between gap-2.5">
              <div>
                <span className="text-[10px] font-bold uppercase text-blue-900 tracking-wider">Asesmen Luka Terakhir:</span>
                <div className="font-bold text-slate-900 mt-0.5">
                  {selectedPatient.asesmenTerakhir.lokasiLuka} ({selectedPatient.asesmenTerakhir.tipeLuka}) • {selectedPatient.asesmenTerakhir.ukuran.panjangCm}×{selectedPatient.asesmenTerakhir.ukuran.lebarCm} cm, dalam {selectedPatient.asesmenTerakhir.ukuran.kedalamanMm} mm
                </div>
              </div>
              <div className="text-slate-700 font-mono text-[11px] bg-white px-3 py-1 rounded-lg border border-blue-200 self-start md:self-auto shrink-0">
                Granulasi: <strong className="text-red-700">{selectedPatient.asesmenTerakhir.dasarLuka.persenGranulasi}%</strong> | Slough: <strong className="text-amber-700">{selectedPatient.asesmenTerakhir.dasarLuka.persenSlough}%</strong> | Nyeri: <strong className="text-blue-700">{selectedPatient.asesmenTerakhir.skorNyeri}/10</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SCREEN VIEW 1: PRATINJAU DOKUMEN RESMI (A4 Real-Paper Simulation) */}
      {viewMode === 'document' ? (
        <div className="no-print space-y-4">
          <div className="bg-blue-50/70 border border-blue-200/80 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-blue-950 font-bold block text-xs sm:text-sm">
                  Pratinjau Format Dokumen Resmi CPPT (Standar Rekam Medis PMK 24/2022)
                </strong>
                <span className="text-blue-800 text-[11px]">
                  Dokumen siap cetak atau simpan PDF secara rapi dan profesional.
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
                Silakan pilih pasien di atas untuk memuat lembar rekam medis.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* SCREEN VIEW 2: FORMULIR KERJA (1 Halaman Penuh Lega & Elegan) */
        <div className="space-y-4 no-print">
          {!selectedPatient ? (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-400 text-xs">
              Silakan pilih pasien pada dropdown di atas untuk membuka lembar rekam medis terpadu.
            </div>
          ) : (
            <>
              {/* Form Input SOAP Baru (Full Width Card) */}
              {showAddForm && (
                <div className="bg-white rounded-xl border-2 border-blue-500/80 p-5 sm:p-6 shadow-sm space-y-4">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                        <PlusCircle className="w-4 h-4 text-blue-600" />
                        <span>Tambah Catatan CPPT SOAP Baru</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Pencatatan oleh: <strong className="text-slate-800">{currentUser.nama}</strong> ({currentUser.role})
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleAddSOAP} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          S (Subjective) - Keluhan & Sensasi Nyeri Pasien:
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={soapS}
                          onChange={(e) => setSoapS(e.target.value)}
                          placeholder="Contoh: Pasien mengeluh luka perban rembes dan nyeri berdenyut skala 3..."
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          O (Objective) - Pemeriksaan Fisik Luka & TTV:
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={soapO}
                          onChange={(e) => setSoapO(e.target.value)}
                          placeholder="Contoh: TTV TD 130/80. Luka eksudat sedang serous, slough 20%, granulasi 70%..."
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          A (Assessment) - Analisis Klinis & Diagnosa Keperawatan:
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={soapA}
                          onChange={(e) => setSoapA(e.target.value)}
                          placeholder="Contoh: Gangguan integritas kulit b.d ulkus diabetikum membaik..."
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          P (Plan) - Tindakan Dressing & Rencana Terapi:
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={soapP}
                          onChange={(e) => setSoapP(e.target.value)}
                          placeholder="Contoh: Irigasi NaCl + PHMB, aplikasi cadexomer iodine + foam dressing..."
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Instruksi PPA (Profesional Pemberi Asuhan):
                      </label>
                      <input
                        type="text"
                        value={instruksi}
                        onChange={(e) => setInstruksi(e.target.value)}
                        placeholder="Contoh: Jaga balutan tetap kering, kontrol ganti balutan 3 hari lagi..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-xs"
                      >
                        Simpan Catatan CPPT
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* CPPT Timeline Entries (1 Halaman Lebar Penuh) */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.06)] overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between bg-gradient-to-r from-slate-50/90 via-white to-slate-50/60">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      Catatan Perkembangan Pasien Terintegrasi (CPPT)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Urutan kronologis riwayat asesmen medis dan catatan SOAP pasien
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs">
                    {patientCPPT.length} Catatan
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {patientCPPT.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 text-xs">
                      Belum ada catatan CPPT untuk pasien ini. Klik tombol <strong>+ Catatan SOAP</strong> di atas untuk membuat catatan baru.
                    </div>
                  ) : (
                    patientCPPT.map((item) => (
                      <div key={item.id} className="p-5 sm:p-6 space-y-3.5 hover:bg-slate-50/40 transition">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${
                              item.profesi === 'Dokter'
                                ? 'bg-purple-50 text-purple-900 border-purple-200'
                                : 'bg-blue-50 text-blue-900 border-blue-200'
                            }`}>
                              {item.profesi}
                            </span>
                            <strong className="text-xs sm:text-sm text-slate-900">{item.namaTenagaMedis}</strong>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{item.tanggalWaktu}</span>
                          </div>
                        </div>

                        {/* Clean Clinical SOAP View - Responsive Grid */}
                        <div className="bg-slate-50/70 p-3.5 sm:p-4 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                          <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                            <span className="font-bold text-blue-900 sm:text-slate-900 sm:w-28 shrink-0">S (Subjective):</span>
                            <span className="text-slate-800 leading-relaxed flex-1">{item.soap.subjective}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                            <span className="font-bold text-blue-900 sm:text-slate-900 sm:w-28 shrink-0">O (Objective):</span>
                            <span className="text-slate-800 leading-relaxed flex-1">{item.soap.objective}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                            <span className="font-bold text-blue-900 sm:text-slate-900 sm:w-28 shrink-0">A (Assessment):</span>
                            <span className="text-slate-800 leading-relaxed flex-1">{item.soap.assessment}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                            <span className="font-bold text-blue-900 sm:text-slate-900 sm:w-28 shrink-0">P (Plan):</span>
                            <span className="text-slate-800 leading-relaxed flex-1">{item.soap.plan}</span>
                          </div>
                        </div>

                        {item.instruksiPPA && (
                          <div className="text-xs bg-amber-50/80 p-3 rounded-lg border border-amber-200 flex items-start gap-2">
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
