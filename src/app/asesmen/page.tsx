'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Bandage, 
  MapPin, 
  Check, 
  Activity, 
  ShieldAlert, 
  Sparkles, 
  Save, 
  ArrowLeft,
  FileCheck2,
  Sliders,
  Layers,
  Thermometer
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useClinic } from '@/context/ClinicContext';
import { TipeLuka } from '@/types';

function AsesmenContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { patients, addAssessment, currentUser } = useClinic();

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

  // Form State
  const [lokasiLuka, setLokasiLuka] = useState('Plantar Pedis Dextra (Kaki Kanan Bawah)');
  const [pinCoordinates, setPinCoordinates] = useState<{ x: number; y: number }>({ x: 55, y: 88 });
  const [tipeLuka, setTipeLuka] = useState<TipeLuka>('Ulkus Diabetikum (Diabetic Foot)');
  const [stadiumLuka, setStadiumLuka] = useState('Wagner Grade 2 / Stadium II (Full Thickness)');
  
  // Ukuran
  const [panjangCm, setPanjangCm] = useState<number>(4.0);
  const [lebarCm, setLebarCm] = useState<number>(3.0);
  const [kedalamanMm, setKedalamanMm] = useState<number>(5);
  const [underminingCm, setUnderminingCm] = useState<number>(0.5);

  // Dasar Luka (%)
  const [granulasi, setGranulasi] = useState<number>(60);
  const [slough, setSlough] = useState<number>(30);
  const [nekrotik, setNekrotik] = useState<number>(0);
  const [epitelisasi, setEpitelisasi] = useState<number>(10);

  // Eksudat & Kulit Sekitar
  const [eksudatJumlah, setEksudatJumlah] = useState<'Tidak Ada' | 'Sedikit' | 'Sedang' | 'Banyak'>('Sedang');
  const [eksudatWarna, setEksudatWarna] = useState<'Serous' | 'Haemoserous' | 'Sanguineous' | 'Purulent (Nanah)'>('Haemoserous');
  const [eksudatBau, setEksudatBau] = useState<'Tidak Berbau' | 'Khas' | 'Berbau Busuk'>('Khas');
  const [kulitSekitar, setKulitSekitar] = useState<'Sehat' | 'Maserasi' | 'Eritema / Kemerahan' | 'Kering / Hiperkeratosis' | 'Oedema'>('Maserasi');
  const [tepiLuka, setTepiLuka] = useState<'Menyatu' | 'Menebal / Kalus' | 'Menggulung (Epibole)' | 'Nekrotik'>('Menebal / Kalus');

  // Tanda Infeksi & Nyeri
  const [tandaInfeksi, setTandaInfeksi] = useState({
    dolorNyeri: true,
    calorHangat: true,
    ruborKemerahan: true,
    tumorBengkak: false,
    functioLaesa: true,
  });
  const [skorNyeri, setSkorNyeri] = useState<number>(4);

  // Tindakan Wound Care
  const [cairanPencuci, setCairanPencuci] = useState('NaCl 0.9% + PHMB Prontosan (Soak 15 Menit)');
  const [teknikDebridement, setTeknikDebridement] = useState('Mechanical & Sharp Debridement kalus/slough');
  const [primaryDressing, setPrimaryDressing] = useState('Cadexomer Iodine Ointment + Calcium Alginate');
  const [secondaryDressing, setSecondaryDressing] = useState('Hydrophilic Polyurethane Foam + Kasa Steril & Fixomull');
  const [intervensi, setIntervensi] = useState('Rawat luka modern, kontrol eksudat, offloading beban kaki.');
  const [targetEvaluasi, setTargetEvaluasi] = useState('Kontrol ganti balutan 3 hari kemudian (reduksi slough).');

  const [isSaved, setIsSaved] = useState(false);

  // Handle Body Map Click
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setPinCoordinates({ x, y });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) {
      alert('Pilih pasien terlebih dahulu.');
      return;
    }

    addAssessment(selectedPatient.id, {
      pasienId: selectedPatient.id,
      perawatPemeriksa: currentUser.nama,
      lokasiLuka,
      lokasiKoordinat: pinCoordinates,
      tipeLuka,
      stadiumLuka,
      ukuran: {
        panjangCm: Number(panjangCm),
        lebarCm: Number(lebarCm),
        kedalamanMm: Number(kedalamanMm),
        underminingGoaCm: Number(underminingCm),
      },
      dasarLuka: {
        persenGranulasi: Number(granulasi),
        persenSlough: Number(slough),
        persenNekrotik: Number(nekrotik),
        persenEpitelisasi: Number(epitelisasi),
      },
      eksudat: {
        jumlah: eksudatJumlah,
        warna: eksudatWarna,
        bau: eksudatBau,
      },
      kulitSekitar,
      tepiLuka,
      tandaInfeksi,
      skorNyeri: Number(skorNyeri),
      tindakanWoundCare: {
        cairanPencuci,
        teknikDebridement,
        primaryDressing,
        secondaryDressing,
      },
      intervensiKeperawatan: intervensi,
      targetEvaluasi,
    });

    setIsSaved(true);
    setTimeout(() => {
      router.push(`/rekam-medis?pasienId=${selectedPatient.id}`);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title="Asesmen Keperawatan Luka (Wound Care)"
        subtitle="Evaluasi karakteristik luka, TIME management, body map, dan resep dressing modern"
      />

      <main className="p-6 space-y-6 max-w-7xl w-full mx-auto">
        {/* Pasien Selector Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Pilih Pasien:</span>
            <select
              value={selectedPasienId}
              onChange={(e) => setSelectedPasienId(e.target.value)}
              className="text-xs font-semibold px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b] bg-slate-50 text-slate-800 min-w-[260px]"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama} ({p.noRm}) - {p.diagnosisMedisUtama}
                </option>
              ))}
            </select>
          </div>

          {selectedPatient && (
            <div className="text-xs text-slate-600 flex items-center gap-4 flex-wrap">
              <span>Usia/TTL: <strong className="text-slate-800">{selectedPatient.tanggalLahir}</strong></span>
              <span>Alergi: <strong className="text-rose-700">{selectedPatient.riwayatAlergi}</strong></span>
              <span>Pemeriksa: <strong className="text-[#224b9b]">{currentUser.nama}</strong></span>
            </div>
          )}
        </div>

        {isSaved && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-lg text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Asesmen luka berhasil disimpan dan tercatat otomatis ke Lembar Rekam Medis (CPPT)! Mengalihkan...</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Kolom Kiri: Body Map Interaktif (5 kolom) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Body Map Anatomis</h3>
                  <p className="text-[11px] text-slate-500">Klik area tubuh untuk menandai letak titik luka</p>
                </div>
                <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                  X:{pinCoordinates.x}% Y:{pinCoordinates.y}%
                </span>
              </div>

              {/* Body Map Canvas */}
              <div
                onClick={handleMapClick}
                className="relative bg-slate-50 rounded-lg border border-slate-300 overflow-hidden cursor-crosshair flex items-center justify-center p-2 select-none group min-h-[380px]"
                title="Klik untuk memindahkan pin lokasi luka"
              >
                <Image
                  src="/body-map.png"
                  alt="Anatomi Tubuh Manusia - Body Map"
                  width={340}
                  height={420}
                  className="max-h-[380px] w-auto object-contain pointer-events-none select-none opacity-90 group-hover:opacity-100 transition"
                  priority
                />

                {/* Pin Lokasi */}
                <div
                  style={{ left: `${pinCoordinates.x}%`, top: `${pinCoordinates.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-full pointer-events-none transition-all duration-150 flex flex-col items-center"
                >
                  <div className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                    Titik Luka
                  </div>
                  <MapPin className="w-6 h-6 text-rose-600 drop-shadow-md fill-rose-600" />
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <label className="block font-semibold text-slate-700">Deskripsi Lokasi Anatomis Luka *</label>
                <input
                  type="text"
                  required
                  value={lokasiLuka}
                  onChange={(e) => setLokasiLuka(e.target.value)}
                  placeholder="Contoh: Plantar Pedis Dextra, Regio Sakrum, dsb."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b] text-slate-800 font-medium"
                />
              </div>

              {/* Tanda Infeksi Lokal */}
              <div className="mt-5 pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-rose-600" />
                  <span>Tanda Kardinal Infeksi Lokal</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { key: 'dolorNyeri', label: 'Dolor (Rasa Nyeri)' },
                    { key: 'calorHangat', label: 'Calor (Kulit Hangat)' },
                    { key: 'ruborKemerahan', label: 'Rubor (Kemerahan)' },
                    { key: 'tumorBengkak', label: 'Tumor (Edema/Bengkak)' },
                    { key: 'functioLaesa', label: 'Functio Laesa (Penurunan Fungsi)' },
                  ].map((inf) => (
                    <label key={inf.key} className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={tandaInfeksi[inf.key as keyof typeof tandaInfeksi]}
                        onChange={(e) =>
                          setTandaInfeksi({ ...tandaInfeksi, [inf.key]: e.target.checked })
                        }
                        className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                      />
                      <span className="text-[11px] text-slate-700">{inf.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Karakteristik, TIME Wound Bed & Tindakan (7 kolom) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Card 1: Karakteristik & Dimensi Luka */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
                  <Bandage className="w-4 h-4 text-[#224b9b]" />
                  <h3 className="text-sm font-bold text-slate-800">Karakteristik & Dimensi Luka</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Etiologi / Tipe Luka *</label>
                    <select
                      value={tipeLuka}
                      onChange={(e) => setTipeLuka(e.target.value as TipeLuka)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b] bg-white text-slate-800"
                    >
                      <option value="Ulkus Diabetikum (Diabetic Foot)">Ulkus Diabetikum (Diabetic Foot)</option>
                      <option value="Luka Tekan (Pressure Injury / Decubitus)">Luka Tekan (Decubitus)</option>
                      <option value="Ulkus Venosum / Arteriosum">Ulkus Venosum / Arteriosum</option>
                      <option value="Luka Bedah / Post Operasi">Luka Bedah / Post Operasi</option>
                      <option value="Luka Bakar (Combustio)">Luka Bakar (Combustio)</option>
                      <option value="Luka Trauma / Laserasi">Luka Trauma / Laserasi</option>
                      <option value="Luka Kanker">Luka Kanker</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Stadium / Derajat Luka</label>
                    <input
                      type="text"
                      value={stadiumLuka}
                      onChange={(e) => setStadiumLuka(e.target.value)}
                      placeholder="Contoh: Wagner 2 / Stadium III Dermis"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b] text-slate-800"
                    />
                  </div>
                </div>

                {/* Dimensi */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Panjang (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={panjangCm}
                      onChange={(e) => setPanjangCm(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#224b9b] bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Lebar (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={lebarCm}
                      onChange={(e) => setLebarCm(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#224b9b] bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Kedalaman (mm)</label>
                    <input
                      type="number"
                      step="1"
                      value={kedalamanMm}
                      onChange={(e) => setKedalamanMm(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#224b9b] bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Undermining/Goa (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={underminingCm}
                      onChange={(e) => setUnderminingCm(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#224b9b] bg-white font-mono"
                    />
                  </div>
                </div>

                {/* Skor Nyeri 0-10 */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Skor Nyeri Pasien (VAS 0 - 10):
                    </label>
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-300">
                      {skorNyeri} / 10 ({skorNyeri <= 3 ? 'Ringan' : skorNyeri <= 6 ? 'Sedang' : 'Berat'})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={skorNyeri}
                    onChange={(e) => setSkorNyeri(Number(e.target.value))}
                    className="w-full accent-[#224b9b] cursor-pointer"
                  />
                </div>
              </div>

              {/* Card 2: Dasar Jaringan Luka (Wound Bed Composition - TIME) */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm font-bold text-slate-800">Komposisi Dasar Jaringan Luka (Wound Bed)</h3>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Total: {granulasi + slough + nekrotik + epitelisasi}%
                  </span>
                </div>

                {/* Visual Proportion Bar */}
                <div className="h-4 rounded-md overflow-hidden flex border border-slate-300 text-[10px] font-bold text-white text-center leading-4">
                  <div style={{ width: `${granulasi}%` }} className="bg-red-600 truncate" title={`Granulasi: ${granulasi}%`}>
                    {granulasi > 10 ? `${granulasi}%` : ''}
                  </div>
                  <div style={{ width: `${slough}%` }} className="bg-amber-400 text-slate-900 truncate" title={`Slough: ${slough}%`}>
                    {slough > 10 ? `${slough}%` : ''}
                  </div>
                  <div style={{ width: `${nekrotik}%` }} className="bg-slate-900 truncate" title={`Nekrotik: ${nekrotik}%`}>
                    {nekrotik > 10 ? `${nekrotik}%` : ''}
                  </div>
                  <div style={{ width: `${epitelisasi}%` }} className="bg-pink-400 text-slate-900 truncate" title={`Epitelisasi: ${epitelisasi}%`}>
                    {epitelisasi > 10 ? `${epitelisasi}%` : ''}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-red-50/60 p-2.5 rounded-lg border border-red-200">
                    <span className="font-bold text-red-800 block">Granulasi (Merah)</span>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={granulasi}
                        onChange={(e) => setGranulasi(Number(e.target.value))}
                        className="w-16 px-2 py-1 border border-red-300 rounded font-mono font-bold text-red-900 bg-white"
                      />
                      <span>%</span>
                    </div>
                  </div>

                  <div className="bg-amber-50/60 p-2.5 rounded-lg border border-amber-200">
                    <span className="font-bold text-amber-800 block">Slough (Kuning)</span>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={slough}
                        onChange={(e) => setSlough(Number(e.target.value))}
                        className="w-16 px-2 py-1 border border-amber-300 rounded font-mono font-bold text-amber-900 bg-white"
                      />
                      <span>%</span>
                    </div>
                  </div>

                  <div className="bg-slate-100 p-2.5 rounded-lg border border-slate-300">
                    <span className="font-bold text-slate-800 block">Nekrotik (Hitam)</span>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={nekrotik}
                        onChange={(e) => setNekrotik(Number(e.target.value))}
                        className="w-16 px-2 py-1 border border-slate-400 rounded font-mono font-bold text-slate-900 bg-white"
                      />
                      <span>%</span>
                    </div>
                  </div>

                  <div className="bg-pink-50/60 p-2.5 rounded-lg border border-pink-200">
                    <span className="font-bold text-pink-800 block">Epitel (Pink)</span>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={epitelisasi}
                        onChange={(e) => setEpitelisasi(Number(e.target.value))}
                        className="w-16 px-2 py-1 border border-pink-300 rounded font-mono font-bold text-pink-900 bg-white"
                      />
                      <span>%</span>
                    </div>
                  </div>
                </div>

                {/* Eksudat & Tepi */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Jumlah Eksudat</label>
                    <select
                      value={eksudatJumlah}
                      onChange={(e) => setEksudatJumlah(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white"
                    >
                      <option value="Tidak Ada">Tidak Ada</option>
                      <option value="Sedikit">Sedikit</option>
                      <option value="Sedang">Sedang</option>
                      <option value="Banyak">Banyak</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Warna Eksudat</label>
                    <select
                      value={eksudatWarna}
                      onChange={(e) => setEksudatWarna(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white"
                    >
                      <option value="Serous">Serous (Bening)</option>
                      <option value="Haemoserous">Haemoserous (Merah muda)</option>
                      <option value="Sanguineous">Sanguineous (Berdarah)</option>
                      <option value="Purulent (Nanah)">Purulent (Nanah keruh)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Kulit Sekitar (Peri-wound)</label>
                    <select
                      value={kulitSekitar}
                      onChange={(e) => setKulitSekitar(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white"
                    >
                      <option value="Sehat">Sehat</option>
                      <option value="Maserasi">Maserasi (Lembek basah)</option>
                      <option value="Eritema / Kemerahan">Eritema / Kemerahan</option>
                      <option value="Kering / Hiperkeratosis">Kering / Hiperkeratosis</option>
                      <option value="Oedema">Oedema (Bengkak)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tepi Luka</label>
                    <select
                      value={tepiLuka}
                      onChange={(e) => setTepiLuka(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white"
                    >
                      <option value="Menyatu">Menyatu</option>
                      <option value="Menebal / Kalus">Menebal / Kalus</option>
                      <option value="Menggulung (Epibole)">Menggulung (Epibole)</option>
                      <option value="Nekrotik">Nekrotik</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Card 3: Rencana Tindakan & Modern Dressing */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
                  <Sparkles className="w-4 h-4 text-[#224b9b]" />
                  <h3 className="text-sm font-bold text-slate-800">Tindakan Wound Care & Resep Dressing Modern</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Cairan Pencuci Luka</label>
                    <input
                      type="text"
                      value={cairanPencuci}
                      onChange={(e) => setCairanPencuci(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Teknik Debridement</label>
                    <input
                      type="text"
                      value={teknikDebridement}
                      onChange={(e) => setTeknikDebridement(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Primary Dressing (Kontak Dasar Luka)</label>
                    <input
                      type="text"
                      value={primaryDressing}
                      onChange={(e) => setPrimaryDressing(e.target.value)}
                      placeholder="Hydrogel / Calcium Alginate / Silver foam"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Secondary Dressing (Penutup & Fiksasi)</label>
                    <input
                      type="text"
                      value={secondaryDressing}
                      onChange={(e) => setSecondaryDressing(e.target.value)}
                      placeholder="Polyurethane Foam / Film / Fixomull"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Intervensi Keperawatan</label>
                    <textarea
                      rows={2}
                      value={intervensi}
                      onChange={(e) => setIntervensi(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Target Evaluasi & Jadwal Kontrol</label>
                    <textarea
                      rows={2}
                      value={targetEvaluasi}
                      onChange={(e) => setTargetEvaluasi(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b9b]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#224b9b] hover:bg-[#1b3d7e] text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Asesmen & Sinkronkan ke CPPT</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function AsesmenPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Memuat modul asesmen...</div>}>
      <AsesmenContent />
    </Suspense>
  );
}

