'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  ArrowRight,
  ShieldAlert,
  FileText,
  Camera,
  UploadCloud,
  AlertTriangle,
  ImageIcon,
  Trash2,
  CheckCircle2,
  Search,
  ChevronRight,
  Ruler,
  Crosshair
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import { TipeLuka, FotoPerkembanganLuka, TitikLukaPeta } from '@/types';
import { InteractiveBodyMap } from '@/components/assessment/InteractiveBodyMap';

function AsesmenContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { patients, addAssessment, currentUser, woundPhotos, addWoundPhoto, deleteWoundPhoto } = useClinic();

  const queryPasienId = searchParams.get('pasienId');
  const [selectedPasienId, setSelectedPasienId] = useState<string>(
    queryPasienId || (patients.length > 0 ? patients[0].id : '')
  );

  useEffect(() => {
    if (queryPasienId) setSelectedPasienId(queryPasienId);
  }, [queryPasienId]);

  const selectedPatient = patients.find((p) => p.id === selectedPasienId);
  const patientPhotos = woundPhotos.filter((p) => p.pasienId === selectedPasienId);

  // Combobox Search State
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPatientDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Step Mode State: strictly 1 page per stage
  const [activeStep, setActiveStep] = useState<number>(1);

  // Form State
  const [lokasiLuka, setLokasiLuka] = useState('Kalkaneus / Tumit Kanan (Plantar Dextra)');
  const [titikLukaList, setTitikLukaList] = useState<TitikLukaPeta[]>([
    {
      id: 'PIN-1',
      nomor: 1,
      label: 'Luka Utama',
      view: 'foot',
      x: 74,
      y: 78,
      regioAnatomi: 'Kalkaneus / Tumit Kanan (Plantar Dextra)',
    },
  ]);
  const [activeTitikId, setActiveTitikId] = useState<string>('PIN-1');
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

  // Synchronize anatomical map & clinical assessment fields dynamically when patient changes
  useEffect(() => {
    if (!selectedPatient) return;

    const asm = selectedPatient.asesmenTerakhir;
    if (asm) {
      setLokasiLuka(asm.lokasiLuka);
      if (asm.daftarTitikLuka && asm.daftarTitikLuka.length > 0) {
        setTitikLukaList(asm.daftarTitikLuka);
        setActiveTitikId(asm.daftarTitikLuka[0].id);
      } else {
        const view: 'foot' | 'anterior' | 'posterior' =
          asm.lokasiKoordinat?.view ||
          (asm.lokasiLuka.toLowerCase().includes('pedis') ||
          asm.lokasiLuka.toLowerCase().includes('kaki') ||
          asm.lokasiLuka.toLowerCase().includes('tumit')
            ? 'foot'
            : asm.lokasiLuka.toLowerCase().includes('sakrum') ||
              asm.lokasiLuka.toLowerCase().includes('punggung') ||
              asm.lokasiLuka.toLowerCase().includes('pantat') ||
              asm.lokasiLuka.toLowerCase().includes('gluteal')
            ? 'posterior'
            : 'anterior');
        const newPin: TitikLukaPeta = {
          id: `PIN-${selectedPatient.id}-1`,
          nomor: 1,
          label: 'Luka Utama',
          view,
          x: asm.lokasiKoordinat?.x ?? 50,
          y: asm.lokasiKoordinat?.y ?? 50,
          regioAnatomi: asm.lokasiLuka,
        };
        setTitikLukaList([newPin]);
        setActiveTitikId(newPin.id);
      }

      setTipeLuka(asm.tipeLuka);
      setStadiumLuka(asm.stadiumLuka);
      if (asm.ukuran) {
        setPanjangCm(asm.ukuran.panjangCm);
        setLebarCm(asm.ukuran.lebarCm);
        setKedalamanMm(asm.ukuran.kedalamanMm);
        setUnderminingCm(asm.ukuran.underminingGoaCm || 0);
      }

      if (asm.dasarLuka) {
        setGranulasi(asm.dasarLuka.persenGranulasi);
        setSlough(asm.dasarLuka.persenSlough);
        setNekrotik(asm.dasarLuka.persenNekrotik);
        setEpitelisasi(asm.dasarLuka.persenEpitelisasi);
      }

      if (asm.eksudat) {
        setEksudatJumlah(asm.eksudat.jumlah);
        setEksudatWarna(asm.eksudat.warna);
        setEksudatBau(asm.eksudat.bau);
      }

      setKulitSekitar(asm.kulitSekitar);
      setTepiLuka(asm.tepiLuka);

      if (asm.tandaInfeksi) {
        setTandaInfeksi({
          dolorNyeri: asm.tandaInfeksi.dolorNyeri,
          calorHangat: asm.tandaInfeksi.calorHangat,
          ruborKemerahan: asm.tandaInfeksi.ruborKemerahan,
          tumorBengkak: asm.tandaInfeksi.tumorBengkak,
          functioLaesa: asm.tandaInfeksi.functioLaesa,
        });
      }
      setSkorNyeri(asm.skorNyeri ?? 4);

      if (asm.tindakanWoundCare) {
        setCairanPencuci(asm.tindakanWoundCare.cairanPencuci);
        setTeknikDebridement(asm.tindakanWoundCare.teknikDebridement);
        setPrimaryDressing(asm.tindakanWoundCare.primaryDressing);
        setSecondaryDressing(asm.tindakanWoundCare.secondaryDressing);
      }
      setTargetEvaluasi(asm.targetEvaluasi || '');
    }
  }, [selectedPatient]);

  // Synchronize field values when active pin changes
  const handleActiveTitikChange = (newTitikId: string) => {
    setActiveTitikId(newTitikId);
    const pin = titikLukaList.find((p) => p.id === newTitikId);
    if (pin) {
      setLokasiLuka(pin.regioAnatomi);
    }
  };

  // Photo Upload States
  const [photoFase, setPhotoFase] = useState<'Sebelum Tindakan' | 'Sesudah Debridement' | 'Setelah Balutan Selesai'>('Sebelum Tindakan');
  const [photoCatatan, setPhotoCatatan] = useState('');
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = () => {
    if (!previewPhoto || !selectedPasienId) return;

    const newPhoto: FotoPerkembanganLuka = {
      id: `FOTO-${Date.now()}`,
      pasienId: selectedPasienId,
      tanggal: new Date().toISOString().split('T')[0],
      fase: photoFase,
      dataUrl: previewPhoto,
      catatan: photoCatatan || (photoFase === 'Sebelum Tindakan' ? 'Kondisi luka sebelum debridement' : 'Hasil pasca dressing'),
      perawat: currentUser.nama,
    };

    addWoundPhoto(newPhoto);
    setPreviewPhoto(null);
    setPhotoCatatan('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Real-time Allergy Cross-Check Guard
  const allergyCheck = () => {
    if (!selectedPatient?.riwayatAlergi || selectedPatient.riwayatAlergi === 'Tidak Ada') return null;
    const allergyLower = selectedPatient.riwayatAlergi.toLowerCase();
    const prescriptionText = `${primaryDressing} ${secondaryDressing} ${cairanPencuci}`.toLowerCase();

    const dangerKeywords = [
      { key: 'karet', label: 'Plester Karet / Perekat Karet' },
      { key: 'latex', label: 'Latex / Karet' },
      { key: 'plester', label: 'Plester Perekat Standar' },
      { key: 'iodine', label: 'Iodine / Betadine / Cadexomer' },
      { key: 'silver', label: 'Silver / Perak' },
      { key: 'sulfa', label: 'Sulfadiazine / Sulfa' },
    ];

    for (const item of dangerKeywords) {
      if (allergyLower.includes(item.key) && prescriptionText.includes(item.key)) {
        return item.label;
      }
    }
    return null;
  };

  const detectedAllergyKeyword = allergyCheck();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPasienId) return;

    const activePin = titikLukaList.find((p) => p.id === activeTitikId) || titikLukaList[0];

    const assessmentPayload = {
      pasienId: selectedPasienId,
      perawatPemeriksa: currentUser.nama,
      lokasiLuka,
      daftarTitikLuka: titikLukaList,
      lokasiKoordinat: {
        x: activePin?.x ?? 50,
        y: activePin?.y ?? 50,
        view: activePin?.view || 'foot',
      },
      tipeLuka,
      stadiumLuka,
      ukuran: {
        panjangCm,
        lebarCm,
        kedalamanMm,
        underminingGoaCm: underminingCm,
      },
      dasarLuka: {
        persenGranulasi: granulasi,
        persenSlough: slough,
        persenNekrotik: nekrotik,
        persenEpitelisasi: epitelisasi,
      },
      eksudat: {
        jumlah: eksudatJumlah,
        warna: eksudatWarna,
        bau: eksudatBau,
      },
      kulitSekitar,
      tepiLuka,
      tandaInfeksi,
      skorNyeri,
      tindakanWoundCare: {
        cairanPencuci,
        teknikDebridement,
        primaryDressing,
        secondaryDressing,
      },
      intervensiKeperawatan: `Perawatan luka modern pada ${lokasiLuka} (${tipeLuka} - ${stadiumLuka})`,
      targetEvaluasi,
      fotoLukaUrl: patientPhotos.length > 0 ? patientPhotos[0].dataUrl : undefined,
    };

    addAssessment(selectedPasienId, assessmentPayload);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      router.push(`/rekam-medis?pasienId=${selectedPasienId}`);
    }, 1500);
  };

  const steps = [
    { id: 1, title: '1. Peta Anatomi', subtitle: 'Lokasi & Titik Tubuh' },
    { id: 2, title: '2. Etiologi & Dimensi', subtitle: 'Ukuran P×L×T & Derajat' },
    { id: 3, title: '3. Jaringan & Infeksi', subtitle: 'TIME, Eksudat & VAS' },
    { id: 4, title: '4. Dressing & Foto', subtitle: 'Balutan & Dokumentasi' },
  ];

  return (
    <div className="w-full px-4 sm:px-6 py-4 sm:py-5 space-y-4 max-w-5xl mx-auto pb-12">
      {/* Page Title Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <span>Asesmen Luka & Peta Anatomi</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Alur pengkajian klinis bertahap spesialis perawatan luka modern (Wound Care).
        </p>
      </div>

      {/* Patient Selection Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative w-full md:w-96" ref={dropdownRef}>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Pilih Pasien Pemeriksaan:
          </label>
          <button
            type="button"
            onClick={() => setIsPatientDropdownOpen(!isPatientDropdownOpen)}
            className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg text-left text-xs font-medium text-slate-800 transition flex items-center justify-between gap-2 shadow-2xs"
          >
            {selectedPatient ? (
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{selectedPatient.nama}</span>
                  <span className="font-mono text-[10px] text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded font-semibold">
                    {selectedPatient.noRm}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {selectedPatient.diagnosisMedisUtama}
                </p>
              </div>
            ) : (
              <span className="text-slate-400">Pilih pasien untuk asesmen luka...</span>
            )}
            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isPatientDropdownOpen ? 'rotate-90' : ''}`} />
          </button>

          {/* Search Dropdown Popover */}
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
                        className={`w-full text-left px-3 py-2 hover:bg-blue-50/60 transition flex items-center justify-between gap-3 text-xs ${
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
          <div className="text-xs text-slate-600 flex items-center gap-3.5 flex-wrap">
            <span>Usia/Lahir: <strong className="text-slate-800">{selectedPatient.tanggalLahir}</strong></span>
            {selectedPatient.riwayatAlergi && selectedPatient.riwayatAlergi !== 'Tidak Ada' && (
              <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Alergi: {selectedPatient.riwayatAlergi}
              </span>
            )}
            <span>Pemeriksa: <strong className="text-blue-700">{currentUser.nama}</strong></span>
          </div>
        )}
      </div>

      {/* Stepper Navigation Bar (Clickable tabs to switch steps) */}
      <div className="bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)]">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {steps.map((step) => {
            const isActive = activeStep === step.id;
            const isCompleted = activeStep > step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id)}
                className={`p-2.5 rounded-lg text-left transition flex items-center gap-2.5 border ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : isCompleted
                    ? 'bg-blue-50/70 text-blue-900 border-blue-200 hover:bg-blue-100/70'
                    : 'bg-slate-50/70 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                    isActive
                      ? 'bg-white text-blue-700'
                      : isCompleted
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.id}
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                    {step.title}
                  </div>
                  <div className={`text-[10px] truncate ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                    {step.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {isSaved && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Hasil asesmen berhasil disimpan dan otomatis tersinkron ke lembar rekam medis CPPT! Mengalihkan...</span>
        </div>
      )}

      {/* Main Form Content - Strictly 1 Page per Step */}
      <form onSubmit={handleSave} className="space-y-4">
        
        {/* ========================================================= */}
        {/* STEP 1: PETA ANATOMI & TITIK LUKA (LEBAR & LEGA PENUH)    */}
        {/* ========================================================= */}
        {activeStep === 1 && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.06)] space-y-5 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-blue-600">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Tahap 1: Peta Anatomi & Pemetaan Titik Luka</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Klik langsung pada diagram tubuh atau telapak kaki untuk menandai posisi luka pasien.
                </p>
              </div>

              {activeTitikId && (
                <span className="text-xs font-mono font-bold bg-blue-50 text-blue-800 px-3 py-1 rounded-lg border border-blue-200 self-start sm:self-auto">
                  Target Pin: {titikLukaList.find((p) => p.id === activeTitikId)?.label || 'Luka Utama'}
                </span>
              )}
            </div>

            {/* Interactive Body Map */}
            <div className="max-w-3xl mx-auto">
              <InteractiveBodyMap
                lokasiLuka={lokasiLuka}
                onLokasiLukaChange={setLokasiLuka}
                titikLukaList={titikLukaList}
                onTitikLukaListChange={setTitikLukaList}
                activeTitikId={activeTitikId}
                onActiveTitikIdChange={handleActiveTitikChange}
              />
            </div>

            {/* Step 1 Navigation */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Lokasi terdeteksi: <strong className="text-slate-800">{lokasiLuka}</strong>
              </div>
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-2"
              >
                <span>Lanjut ke Etiologi & Dimensi Luka</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 2: ETIOLOGI & DIMENSI LUKA (SETELAH PETA ANATOMI)   */}
        {/* ========================================================= */}
        {activeStep === 2 && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.06)] space-y-5 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-blue-600">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-blue-600" />
                  <span>Tahap 2: Etiologi, Derajat & Dimensi Fisik Luka</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pengukuran dimensi luka secara objektif dan klasifikasi klinis untuk lokasi terpilih.
                </p>
              </div>

              <div className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200 font-medium self-start sm:self-auto">
                Lokasi: <span className="font-bold text-slate-900">{lokasiLuka}</span>
              </div>
            </div>

            {/* Sub-Section A: Etiologi & Derajat Klinis */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>A. Klasifikasi & Stadium Klinis</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipe / Etiologi Luka</label>
                  <select
                    value={tipeLuka}
                    onChange={(e) => setTipeLuka(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 text-xs font-medium"
                  >
                    <option value="Ulkus Diabetikum (Diabetic Foot)">Ulkus Diabetikum (Diabetic Foot)</option>
                    <option value="Luka Tekan (Pressure Injury / Decubitus)">Luka Tekan (Pressure Injury / Decubitus)</option>
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
                    placeholder="Contoh: Wagner Grade 3 (Ulkus dalam dengan abses)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Sub-Section B: Pengukuran Dimensi Fisik (3D) */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  <span>B. Pengukuran Dimensi Fisik 3D</span>
                </h4>
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                  Estimasi Luas: {(panjangCm * lebarCm).toFixed(1)} cm²
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <label className="block font-semibold text-slate-700 mb-1">Panjang (cm)</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={panjangCm}
                      onChange={(e) => setPanjangCm(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-900 text-center text-sm"
                    />
                    <span className="text-slate-500 font-bold">cm</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <label className="block font-semibold text-slate-700 mb-1">Lebar (cm)</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={lebarCm}
                      onChange={(e) => setLebarCm(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-900 text-center text-sm"
                    />
                    <span className="text-slate-500 font-bold">cm</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <label className="block font-semibold text-slate-700 mb-1">Kedalaman (mm)</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={kedalamanMm}
                      onChange={(e) => setKedalamanMm(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-900 text-center text-sm"
                    />
                    <span className="text-slate-500 font-bold">mm</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <label className="block font-semibold text-slate-700 mb-1">Goa / Undermining</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={underminingCm}
                      onChange={(e) => setUnderminingCm(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-900 text-center text-sm"
                    />
                    <span className="text-slate-500 font-bold">cm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Section C: Karakteristik Tepi Luka & Kulit Sekitar */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>C. Karakteristik Tepi Luka & Kulit Sekitar (Peri-Wound)</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kondisi Tepi Luka (Edge)</label>
                  <select
                    value={tepiLuka}
                    onChange={(e) => setTepiLuka(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 text-xs font-medium"
                  >
                    <option value="Menyatu">Menyatu (Epitelisasi Baik)</option>
                    <option value="Menebal / Kalus">Menebal / Kalus (Hiperkeratosis)</option>
                    <option value="Menggulung (Epibole)">Menggulung (Epibole / Non-advancing)</option>
                    <option value="Nekrotik">Nekrotik / Iskemik</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kulit Sekitar Luka (Peri-Wound)</label>
                  <select
                    value={kulitSekitar}
                    onChange={(e) => setKulitSekitar(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 text-xs font-medium"
                  >
                    <option value="Sehat">Sehat / Intak</option>
                    <option value="Maserasi">Maserasi (Lembap Berlebih / Keputihan)</option>
                    <option value="Eritema / Kemerahan">Eritema / Kemerahan (Inflamasi)</option>
                    <option value="Kering / Hiperkeratosis">Kering / Hiperkeratosis / Bersisik</option>
                    <option value="Oedema">Oedema (Bengkak Perifer)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2 Navigation */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Peta Anatomi</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-2"
              >
                <span>Lanjut ke Dasar Jaringan (TIME) & Infeksi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 3: DASAR JARINGAN (TIME) & TANDA INFEKSI / NYERI     */}
        {/* ========================================================= */}
        {activeStep === 3 && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.06)] space-y-5 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-blue-600">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Tahap 3: Dasar Jaringan (TIME), Eksudat & Tanda Infeksi</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Proporsi jaringan dasar luka (Wound Bed), karakter cairan, tanda inflamasi, dan evaluasi nyeri VAS.
                </p>
              </div>

              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-md border self-start sm:self-auto ${
                granulasi + slough + nekrotik + epitelisasi === 100 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                Total: {granulasi + slough + nekrotik + epitelisasi}% {granulasi + slough + nekrotik + epitelisasi === 100 ? '✓' : '(Target 100%)'}
              </span>
            </div>

            {/* Sub-Section A: Wound Bed (TIME) Proportion Bar */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>A. Proporsi Dasar Jaringan Luka (Wound Bed)</span>
              </h4>

              {/* Visual Proportion Bar */}
              <div className="h-5 rounded-lg overflow-hidden flex bg-slate-200 text-xs font-bold text-white text-center leading-5 shadow-inner">
                <div style={{ width: `${granulasi}%` }} className="bg-red-600 truncate transition-all duration-300" title="Granulasi (Merah)">
                  {granulasi > 10 ? `Granulasi ${granulasi}%` : granulasi > 0 ? `${granulasi}%` : ''}
                </div>
                <div style={{ width: `${slough}%` }} className="bg-amber-400 text-slate-900 truncate transition-all duration-300" title="Slough (Kuning)">
                  {slough > 10 ? `Slough ${slough}%` : slough > 0 ? `${slough}%` : ''}
                </div>
                <div style={{ width: `${nekrotik}%` }} className="bg-slate-900 truncate transition-all duration-300" title="Nekrotik (Hitam)">
                  {nekrotik > 10 ? `Nekrotik ${nekrotik}%` : nekrotik > 0 ? `${nekrotik}%` : ''}
                </div>
                <div style={{ width: `${epitelisasi}%` }} className="bg-pink-400 text-slate-900 truncate transition-all duration-300" title="Epitel (Pink)">
                  {epitelisasi > 10 ? `Epitel ${epitelisasi}%` : epitelisasi > 0 ? `${epitelisasi}%` : ''}
                </div>
              </div>

              {/* 4 Proportion Inputs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
                <div className="p-2.5 bg-red-50/70 rounded-lg border border-red-200">
                  <span className="font-bold text-red-900 block text-xs">Granulasi (Merah)</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={granulasi}
                      onChange={(e) => setGranulasi(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-red-300 rounded font-mono font-bold text-red-900 text-center"
                    />
                    <span className="font-bold text-red-800">%</span>
                  </div>
                </div>

                <div className="p-2.5 bg-amber-50/70 rounded-lg border border-amber-200">
                  <span className="font-bold text-amber-900 block text-xs">Slough (Kuning)</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={slough}
                      onChange={(e) => setSlough(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-amber-300 rounded font-mono font-bold text-amber-900 text-center"
                    />
                    <span className="font-bold text-amber-800">%</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-100 rounded-lg border border-slate-300">
                  <span className="font-bold text-slate-900 block text-xs">Nekrotik (Hitam)</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={nekrotik}
                      onChange={(e) => setNekrotik(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-slate-900 text-center"
                    />
                    <span className="font-bold text-slate-800">%</span>
                  </div>
                </div>

                <div className="p-2.5 bg-pink-50/70 rounded-lg border border-pink-200">
                  <span className="font-bold text-pink-900 block text-xs">Epitel (Pink)</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={epitelisasi}
                      onChange={(e) => setEpitelisasi(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-pink-300 rounded font-mono font-bold text-pink-900 text-center"
                    />
                    <span className="font-bold text-pink-800">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Section B: Eksudat Luka */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>B. Karakteristik Cairan Luka (Eksudat)</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jumlah Eksudat</label>
                  <select
                    value={eksudatJumlah}
                    onChange={(e) => setEksudatJumlah(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                  >
                    <option value="Tidak Ada">Tidak Ada (Kering)</option>
                    <option value="Sedikit">Sedikit (Moist)</option>
                    <option value="Sedang">Sedang (Wet)</option>
                    <option value="Banyak">Banyak (Saturated / Banjir)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Warna Eksudat</label>
                  <select
                    value={eksudatWarna}
                    onChange={(e) => setEksudatWarna(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                  >
                    <option value="Serous">Serous (Bening / Kuning Jernih)</option>
                    <option value="Haemoserous">Haemoserous (Merah Muda Encer)</option>
                    <option value="Sanguineous">Sanguineous (Merah Darah Segar)</option>
                    <option value="Purulent (Nanah)">Purulent (Keruh / Nanah Kuning-Hijau)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Aroma / Bau Eksudat</label>
                  <select
                    value={eksudatBau}
                    onChange={(e) => setEksudatBau(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                  >
                    <option value="Tidak Berbau">Tidak Berbau</option>
                    <option value="Khas">Khas (Khas Luka Lembut)</option>
                    <option value="Berbau Busuk">Berbau Busuk / Malodour (Indikasi Anaerob)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sub-Section C: Tanda Kardinal Infeksi Lokal & Sensasi Nyeri */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                <span>C. Tanda Kardinal Infeksi Lokal & Skala Nyeri</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
                {[
                  { key: 'dolorNyeri', label: 'Dolor (Rasa Nyeri)' },
                  { key: 'calorHangat', label: 'Calor (Kulit Hangat)' },
                  { key: 'ruborKemerahan', label: 'Rubor (Kemerahan)' },
                  { key: 'tumorBengkak', label: 'Tumor (Edema Bengkak)' },
                  { key: 'functioLaesa', label: 'Functio Laesa (Gangguan Fungsi)' },
                ].map((inf) => (
                  <label key={inf.key} className="flex items-center gap-2 p-2 bg-slate-50 hover:bg-slate-100/80 rounded-lg border border-slate-200 cursor-pointer select-none transition">
                    <input
                      type="checkbox"
                      checked={tandaInfeksi[inf.key as keyof typeof tandaInfeksi]}
                      onChange={(e) =>
                        setTandaInfeksi({ ...tandaInfeksi, [inf.key]: e.target.checked })
                      }
                      className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-3.5 h-3.5"
                    />
                    <span className="text-[11px] text-slate-700 font-semibold">{inf.label}</span>
                  </label>
                ))}
              </div>

              {/* Skor Nyeri Slider */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">Tingkat Nyeri Pasien (VAS 0 - 10):</span>
                  <span className={`font-bold font-mono px-2.5 py-0.5 rounded text-xs ${
                    skorNyeri <= 3 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : skorNyeri <= 6 
                      ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}>
                    {skorNyeri} / 10 ({skorNyeri <= 3 ? 'Nyeri Ringan' : skorNyeri <= 6 ? 'Nyeri Sedang' : 'Nyeri Berat'})
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={skorNyeri}
                  onChange={(e) => setSkorNyeri(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0 (Bebas Nyeri)</span>
                  <span>5 (Nyeri Sedang)</span>
                  <span>10 (Nyeri Tak Tertahankan)</span>
                </div>
              </div>
            </div>

            {/* Step 3 Navigation */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Dimensi Luka</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(4)}
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-2"
              >
                <span>Lanjut ke Resep Balutan & Foto</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 4: RESEP DRESSING, RENCANA & FOTO DOKUMENTASI       */}
        {/* ========================================================= */}
        {activeStep === 4 && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.06)] space-y-5 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-blue-600">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Tahap 4: Resep Modern Dressing, Rencana & Foto Dokumentasi</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Protokol pencucian luka, debridement, pemilihan balutan primer-sekunder, serta arsip foto Before-After.
                </p>
              </div>
            </div>

            {/* Real-time Clinical Safety Alert Guard */}
            {detectedAllergyKeyword ? (
              <div className="p-3.5 bg-rose-50 border-2 border-rose-500 rounded-xl flex items-start gap-2.5 shadow-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-black text-rose-900 uppercase tracking-wide flex items-center gap-2">
                    <span>PERINGATAN BAHAYA ALERGI PASIEN!</span>
                    <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.2 rounded font-mono font-bold">
                      DANGER
                    </span>
                  </h5>
                  <p className="text-xs text-rose-800 mt-0.5 leading-snug">
                    Terdeteksi kata kunci <strong>&quot;{detectedAllergyKeyword.toUpperCase()}&quot;</strong> pada resep balutan Anda! Pasien ini memiliki riwayat alergi: <strong>{selectedPatient?.riwayatAlergi}</strong>.
                  </p>
                  <p className="text-[11px] text-rose-700 font-semibold mt-1 bg-white/70 p-2 rounded-lg border border-rose-200">
                    Rekomendasi Aman: Ganti perekat karet dengan <strong>Silicone Adhesive Border Foam</strong> atau fiksasi <strong>Kasa Gulung Non-Adhesive / Tubular Bandage</strong> untuk mencegah kulit melepuh dan maserasi parah.
                  </p>
                </div>
              </div>
            ) : selectedPatient?.riwayatAlergi && selectedPatient.riwayatAlergi !== 'Tidak Ada' ? (
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg flex items-center gap-2 text-xs text-amber-900">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>Peringatan Pasien Berisiko:</strong> Pasien tercatat alergi terhadap <strong>{selectedPatient.riwayatAlergi}</strong>. Pastikan tidak meresepkan plester/balutan dengan perekat karet atau bahan pemicu alergi.
                </span>
              </div>
            ) : null}

            {/* Sub-Section A: Modern Dressing Formulation */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>A. Rincian Resep & Tindakan Perawatan</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cairan Pencuci Luka (Wound Cleanser)</label>
                  <input
                    type="text"
                    value={cairanPencuci}
                    onChange={(e) => setCairanPencuci(e.target.value)}
                    placeholder="Contoh: NaCl 0.9% hangat + PHMB Prontosan"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Teknik Debridement</label>
                  <input
                    type="text"
                    value={teknikDebridement}
                    onChange={(e) => setTeknikDebridement(e.target.value)}
                    placeholder="Contoh: Sharp debridement kalus tebal + autolytic"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Primary Dressing (Kontak Langsung Luka)</label>
                  <input
                    type="text"
                    value={primaryDressing}
                    onChange={(e) => setPrimaryDressing(e.target.value)}
                    placeholder="Contoh: Cadexomer Iodine Ointment / Hydrogel Alginate"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Secondary Dressing (Penutup & Fiksasi)</label>
                  <input
                    type="text"
                    value={secondaryDressing}
                    onChange={(e) => setSecondaryDressing(e.target.value)}
                    placeholder="Contoh: Polyurethane Foam + Perban Elastis"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="text-xs pt-1">
                <label className="block font-semibold text-slate-700 mb-1">Target Evaluasi & Jadwal Kontrol Ganti Balutan</label>
                <input
                  type="text"
                  value={targetEvaluasi}
                  onChange={(e) => setTargetEvaluasi(e.target.value)}
                  placeholder="Contoh: Kontrol ganti balutan 3 hari lagi (target slough berkurang 50%)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                />
              </div>
            </div>

            {/* Sub-Section B: Photo Documentation */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>B. Dokumentasi Foto Perkembangan Luka</span>
              </h4>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Upload Form (5 cols) */}
                <div className="lg:col-span-5 p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800">Unggah Foto Luka Baru</span>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer w-full"
                  />

                  {previewPhoto && (
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <div className="h-28 rounded-lg bg-white overflow-hidden border border-slate-200 flex items-center justify-center">
                        <img src={previewPhoto} alt="Preview" className="max-h-full max-w-full object-contain" />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Fase:</label>
                          <select
                            value={photoFase}
                            onChange={(e) => setPhotoFase(e.target.value as any)}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                          >
                            <option value="Sebelum Tindakan">Sebelum Tindakan</option>
                            <option value="Sesudah Debridement">Sesudah Debridement</option>
                            <option value="Setelah Balutan Selesai">Setelah Balutan Selesai</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Catatan:</label>
                          <input
                            type="text"
                            value={photoCatatan}
                            onChange={(e) => setPhotoCatatan(e.target.value)}
                            placeholder="Misal: Slough diangkat..."
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setPreviewPhoto(null)}
                          className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded transition"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={handleSavePhoto}
                          className="px-3 py-1 text-xs bg-blue-600 text-white font-bold rounded hover:bg-blue-700 shadow-xs flex items-center gap-1 transition"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Simpan Foto</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Gallery Thumbnails (7 cols) */}
                <div className="lg:col-span-7">
                  {patientPhotos.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50/50 rounded-lg border border-dashed border-slate-200 text-slate-400 text-xs">
                      Belum ada foto luka yang diunggah untuk pasien ini.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                      {patientPhotos.map((photo) => (
                        <div key={photo.id} className="p-2 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1 relative group shadow-2xs">
                          <div className="h-20 rounded bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                            <img src={photo.dataUrl} alt={photo.fase} className="max-h-full max-w-full object-contain" />
                          </div>
                          <div className="flex items-center justify-between text-[9px]">
                            <span className={`px-1.5 py-0.5 rounded font-bold ${
                              photo.fase === 'Sebelum Tindakan' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {photo.fase}
                            </span>
                            <span className="text-slate-400 font-mono">{photo.tanggal}</span>
                          </div>
                          {photo.catatan && (
                            <p className="text-[10px] text-slate-600 truncate" title={photo.catatan}>
                              {photo.catatan}
                            </p>
                          )}
                          <button
                            type="button"
                            onClick={() => deleteWoundPhoto(photo.id)}
                            className="absolute top-2.5 right-2.5 p-1 bg-white/95 text-slate-400 hover:text-rose-600 rounded shadow-xs opacity-0 group-hover:opacity-100 transition"
                            title="Hapus Foto"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step 4 Navigation & Save Button */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Jaringan TIME</span>
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Asesmen & Sinkronkan ke Lembar CPPT</span>
              </button>
            </div>
          </div>
        )}
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
