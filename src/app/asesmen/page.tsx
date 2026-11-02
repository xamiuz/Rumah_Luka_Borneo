'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Activity, 
  MapPin, 
  Check, 
  Layers, 
  Thermometer, 
  Sparkles, 
  Save, 
  ArrowLeft,
  ShieldAlert,
  Sliders,
  FileText
} from 'lucide-react';
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
    if (queryPasienId) setSelectedPasienId(queryPasienId);
  }, [queryPasienId]);

  const selectedPatient = patients.find((p) => p.id === selectedPasienId);

  // Form State
  const [lokasiLuka, setLokasiLuka] = useState('Plantar Pedis Dextra (Kaki Kanan Bawah)');
  const [pin, setPin] = useState<{ x: number; y: number }>({ x: 55, y: 88 });
  const [tipeLuka, setTipeLuka] = useState<TipeLuka>('Ulkus Diabetikum (Diabetic Foot)');
  const [stadiumLuka, setStadiumLuka] = useState('Wagner Grade 3 (Ulkus dalam dengan keterlibatan tulang/abses)');

  // Dimension
  const [panjangCm, setPanjangCm] = useState<number>(4.5);
  const [lebarCm, setLebarCm] = useState<number>(3.2);
  const [kedalamanMm, setKedalamanMm] = useState<number>(6);
  const [underminingCm, setUnderminingCm] = useState<number>(1.0);

  // TIME Tissue Bed (%)
  const [granulasi, setGranulasi] = useState<number>(60);
  const [slough, setSlough] = useState<number>(30);
  const [nekrotik, setNekrotik] = useState<number>(0);
  const [epitelisasi, setEpitelisasi] = useState<number>(10);

  // Exudate & Peri-wound
  const [eksudatJumlah, setEksudatJumlah] = useState<'Tidak Ada' | 'Sedikit' | 'Sedang' | 'Banyak'>('Sedang');
  const [eksudatWarna, setEksudatWarna] = useState<'Serous' | 'Haemoserous' | 'Sanguineous' | 'Purulent (Nanah)'>('Haemoserous');
  const [eksudatBau, setEksudatBau] = useState<'Tidak Berbau' | 'Khas' | 'Berbau Busuk'>('Khas');
  const [kulitSekitar, setKulitSekitar] = useState<'Sehat' | 'Maserasi' | 'Eritema / Kemerahan' | 'Kering / Hiperkeratosis' | 'Oedema'>('Maserasi');
  const [tepiLuka, setTepiLuka] = useState<'Menyatu' | 'Menebal / Kalus' | 'Menggulung (Epibole)' | 'Nekrotik'>('Menebal / Kalus');

  // Infection & Pain
  const [tandaInfeksi, setTandaInfeksi] = useState({
    dolorNyeri: true,
    calorHangat: true,
    ruborKemerahan: true,
    tumorBengkak: false,
    functioLaesa: true,
  });
  const [skorNyeri, setSkorNyeri] = useState<number>(4);

  // Dressing & Treatment
  const [cairanPencuci, setCairanPencuci] = useState('NaCl 0.9% hangat + Polyhexanide (Prontosan Soak 15 menit)');
  const [teknikDebridement, setTeknikDebridement] = useState('Sharp removal kalus tebal & autolytic debridement slough');
  const [primaryDressing, setPrimaryDressing] = useState('Cadexomer Iodine Ointment + Calcium Alginate cavity filler');
  const [secondaryDressing, setSecondaryDressing] = useState('Polyurethane Foam Dressing waterproof non-adhesive + Perban elastis');
  const [targetEvaluasi, setTargetEvaluasi] = useState('Kontrol ganti balutan 3 hari lagi (target reduksi slough & maserasi)');

  const [isSaved, setIsSaved] = useState(false);

  const handleBodyMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setPin({ x, y });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    addAssessment(selectedPatient.id, {
      pasienId: selectedPatient.id,
      perawatPemeriksa: currentUser.nama,
      lokasiLuka,
      lokasiKoordinat: pin,
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
      intervensiKeperawatan: `Rawat luka modern dengan protokol TIME. Pembersihan biofilm dan maserasi peri-wound.`,
      targetEvaluasi,
    });

    setIsSaved(true);
    setTimeout(() => {
      router.push(`/rekam-medis?pasienId=${selectedPatient.id}`);
    }, 1200);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Patient Selector Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Pilih Pasien Pemeriksaan:</label>
          <select
            value={selectedPasienId}
            onChange={(e) => setSelectedPasienId(e.target.value)}
            className="text-xs font-semibold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 bg-slate-50 text-slate-800 min-w-[280px]"
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
            <span>Usia/Lahir: <strong className="text-slate-800">{selectedPatient.tanggalLahir}</strong></span>
            {selectedPatient.riwayatAlergi && selectedPatient.riwayatAlergi !== 'Tidak Ada' && (
              <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Alergi: {selectedPatient.riwayatAlergi}
              </span>
            )}
            <span>Pemeriksa: <strong className="text-blue-900">{currentUser.nama}</strong></span>
          </div>
        )}
      </div>

      {isSaved && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-lg text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Hasil asesmen berhasil disimpan dan otomatis tersinkron ke lembar rekam medis CPPT! Mengalihkan...</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Body Map & Infection Cardinal Signs (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Peta Tubuh Interaktif (Body Map)</h3>
                  <p className="text-xs text-slate-500">Klik pada gambar tubuh untuk menandai koordinat lokasi luka</p>
                </div>
                <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                  X:{pin.x}% Y:{pin.y}%
                </span>
              </div>

              {/* Body Map Canvas */}
              <div
                onClick={handleBodyMapClick}
                className="relative bg-slate-50/80 rounded-xl border border-slate-200 overflow-hidden cursor-crosshair flex items-center justify-center p-3 select-none min-h-[380px]"
                title="Klik untuk memindahkan pin lokasi luka"
              >
                <Image
                  src="/body-map.png"
                  alt="Peta Anatomi Tubuh"
                  width={320}
                  height={400}
                  className="max-h-[360px] w-auto object-contain pointer-events-none select-none"
                  priority
                />

                {/* Animated Marker */}
                <div
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-full pointer-events-none transition-all duration-150 flex flex-col items-center"
                >
                  <div className="bg-rose-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                    Luka
                  </div>
                  <MapPin className="w-6 h-6 text-rose-600 fill-rose-600 drop-shadow-md" />
                </div>
              </div>

              <div className="text-xs space-y-1.5">
                <label className="block font-semibold text-slate-700">Nama Lokasi Anatomis Luka *</label>
                <input
                  type="text"
                  required
                  value={lokasiLuka}
                  onChange={(e) => setLokasiLuka(e.target.value)}
                  placeholder="Contoh: Plantar Pedis Dextra, Regio Sakrum, dsb."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 text-slate-800 font-medium"
                />
              </div>
            </div>

            {/* Tanda Kardinal Infeksi Lokal */}
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Thermometer className="w-4 h-4 text-rose-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Tanda Kardinal Infeksi Lokal
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                {[
                  { key: 'dolorNyeri', label: 'Dolor (Rasa Nyeri)' },
                  { key: 'calorHangat', label: 'Calor (Kulit Hangat)' },
                  { key: 'ruborKemerahan', label: 'Rubor (Kemerahan)' },
                  { key: 'tumorBengkak', label: 'Tumor (Edema Bengkak)' },
                  { key: 'functioLaesa', label: 'Functio Laesa (Gangguan Fungsi)' },
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

              {/* Skor Nyeri */}
              <div className="pt-3 border-t border-slate-100 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-700">Skor Nyeri (VAS 0 - 10):</span>
                  <span className="font-bold font-mono px-2 py-0.5 bg-slate-100 rounded text-slate-800">
                    {skorNyeri} / 10 ({skorNyeri <= 3 ? 'Ringan' : skorNyeri <= 6 ? 'Sedang' : 'Berat'})
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={skorNyeri}
                  onChange={(e) => setSkorNyeri(Number(e.target.value))}
                  className="w-full accent-blue-900 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Right Column: TIME Wound Bed, Dimensions & Dressing (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Card 1: Etiologi & Dimensi Luka */}
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Etiologi & Dimensi Luka</h3>
                <p className="text-xs text-slate-500">Pengukuran ukuran fisik luka secara teliti</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipe / Etiologi Luka</label>
                  <select
                    value={tipeLuka}
                    onChange={(e) => setTipeLuka(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 text-slate-800"
                  >
                    <option value="Ulkus Diabetikum (Diabetic Foot)">Ulkus Diabetikum (Diabetic Foot)</option>
                    <option value="Luka Tekan (Pressure Injury / Decubitus)">Luka Tekan (Decubitus)</option>
                    <option value="Ulkus Venosum / Arteriosum">Ulkus Venosum / Arteriosum</option>
                    <option value="Luka Bedah / Post Operasi">Luka Bedah / Post Operasi</option>
                    <option value="Luka Bakar (Combustio)">Luka Bakar (Combustio)</option>
                    <option value="Luka Trauma / Laserasi">Luka Trauma / Laserasi</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stadium / Derajat Luka</label>
                  <input
                    type="text"
                    value={stadiumLuka}
                    onChange={(e) => setStadiumLuka(e.target.value)}
                    placeholder="Contoh: Wagner Grade 3"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 text-slate-800"
                  />
                </div>
              </div>

              {/* 4 Dimension Inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Panjang (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={panjangCm}
                    onChange={(e) => setPanjangCm(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lebar (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={lebarCm}
                    onChange={(e) => setLebarCm(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kedalaman (mm)</label>
                  <input
                    type="number"
                    step="1"
                    value={kedalamanMm}
                    onChange={(e) => setKedalamanMm(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Undermining / Goa (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={underminingCm}
                    onChange={(e) => setUnderminingCm(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Dasar Jaringan Luka (Wound Bed - TIME Principle) */}
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Dasar Jaringan Luka (Wound Bed - TIME)</h3>
                  <p className="text-xs text-slate-500">Evaluasi proporsi jaringan granulasi, slough, nekrotik, dan epitel</p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-700">
                  Total: {granulasi + slough + nekrotik + epitelisasi}%
                </span>
              </div>

              {/* Composition Progress Bar */}
              <div className="h-4 rounded-md overflow-hidden flex bg-slate-200 text-[10px] font-bold text-white text-center leading-4 shadow-inner">
                <div style={{ width: `${granulasi}%` }} className="bg-red-600 truncate" title="Granulasi (Merah)">
                  {granulasi > 10 ? `${granulasi}%` : ''}
                </div>
                <div style={{ width: `${slough}%` }} className="bg-amber-400 text-slate-900 truncate" title="Slough (Kuning)">
                  {slough > 10 ? `${slough}%` : ''}
                </div>
                <div style={{ width: `${nekrotik}%` }} className="bg-slate-900 truncate" title="Nekrotik (Hitam)">
                  {nekrotik > 10 ? `${nekrotik}%` : ''}
                </div>
                <div style={{ width: `${epitelisasi}%` }} className="bg-pink-400 text-slate-900 truncate" title="Epitelisasi (Pink)">
                  {epitelisasi > 10 ? `${epitelisasi}%` : ''}
                </div>
              </div>

              {/* 4 Proportion Inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-red-50/70 rounded-lg border border-red-200">
                  <span className="font-bold text-red-900 block">Granulasi (Merah)</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={granulasi}
                      onChange={(e) => setGranulasi(Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-white border border-red-300 rounded font-mono font-bold text-red-900"
                    />
                    <span>%</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200">
                  <span className="font-bold text-amber-900 block">Slough (Kuning)</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={slough}
                      onChange={(e) => setSlough(Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-white border border-amber-300 rounded font-mono font-bold text-amber-900"
                    />
                    <span>%</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-100 rounded-lg border border-slate-300">
                  <span className="font-bold text-slate-900 block">Nekrotik (Hitam)</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={nekrotik}
                      onChange={(e) => setNekrotik(Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-slate-900"
                    />
                    <span>%</span>
                  </div>
                </div>

                <div className="p-3 bg-pink-50/70 rounded-lg border border-pink-200">
                  <span className="font-bold text-pink-900 block">Epitel (Pink)</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={epitelisasi}
                      onChange={(e) => setEpitelisasi(Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-white border border-pink-300 rounded font-mono font-bold text-pink-900"
                    />
                    <span>%</span>
                  </div>
                </div>
              </div>

              {/* Exudate & Edge */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Eksudat (Jumlah)</label>
                  <select
                    value={eksudatJumlah}
                    onChange={(e) => setEksudatJumlah(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md"
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
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md"
                  >
                    <option value="Serous">Serous (Bening)</option>
                    <option value="Haemoserous">Haemoserous (Merah muda)</option>
                    <option value="Sanguineous">Sanguineous (Berdarah)</option>
                    <option value="Purulent (Nanah)">Purulent (Nanah)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kulit Sekitar (Peri-wound)</label>
                  <select
                    value={kulitSekitar}
                    onChange={(e) => setKulitSekitar(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md"
                  >
                    <option value="Sehat">Sehat</option>
                    <option value="Maserasi">Maserasi</option>
                    <option value="Eritema / Kemerahan">Eritema</option>
                    <option value="Kering / Hiperkeratosis">Hiperkeratosis</option>
                    <option value="Oedema">Oedema (Bengkak)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tepi Luka</label>
                  <select
                    value={tepiLuka}
                    onChange={(e) => setTepiLuka(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md"
                  >
                    <option value="Menyatu">Menyatu</option>
                    <option value="Menebal / Kalus">Menebal / Kalus</option>
                    <option value="Menggulung (Epibole)">Epibole (Menggulung)</option>
                    <option value="Nekrotik">Nekrotik</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Card 3: Resep Dressing Modern & Rencana Tindakan */}
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Resep Modern Dressing & Rencana Tindakan</h3>
                <p className="text-xs text-slate-500">Pemberian cairan pencuci, debridement, dan balutan luka primer/sekunder</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cairan Pencuci Luka</label>
                  <input
                    type="text"
                    value={cairanPencuci}
                    onChange={(e) => setCairanPencuci(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Teknik Debridement</label>
                  <input
                    type="text"
                    value={teknikDebridement}
                    onChange={(e) => setTeknikDebridement(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Primary Dressing (Kontak Luka)</label>
                  <input
                    type="text"
                    value={primaryDressing}
                    onChange={(e) => setPrimaryDressing(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Secondary Dressing (Penutup & Fiksasi)</label>
                  <input
                    type="text"
                    value={secondaryDressing}
                    onChange={(e) => setSecondaryDressing(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                  />
                </div>
              </div>

              <div className="text-xs pt-1">
                <label className="block font-semibold text-slate-700 mb-1">Target Evaluasi & Jadwal Kontrol Ganti Balutan</label>
                <input
                  type="text"
                  value={targetEvaluasi}
                  onChange={(e) => setTargetEvaluasi(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                />
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Asesmen & Sinkronkan ke Lembar CPPT</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function AsesmenPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Memuat modul asesmen...</div>}>
      <AsesmenContent />
    </Suspense>
  );
}
