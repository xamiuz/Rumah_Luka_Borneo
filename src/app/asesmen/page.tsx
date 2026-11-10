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
  ShieldAlert,
  Sliders,
  FileText,
  Camera,
  UploadCloud,
  AlertTriangle,
  ImageIcon,
  Trash2,
  CheckCircle2,
  Search,
  ChevronRight
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
  const patientDropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (patientDropdownRef.current && !patientDropdownRef.current.contains(event.target as Node)) {
        setIsPatientDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredPatients = patients.filter((p) => {
    const q = patientSearchQuery.toLowerCase();
    return (
      p.nama.toLowerCase().includes(q) ||
      p.noRm.toLowerCase().includes(q) ||
      (p.nik && p.nik.includes(q)) ||
      (p.diagnosisMedisUtama && p.diagnosisMedisUtama.toLowerCase().includes(q))
    );
  });

  // Photo Upload State
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoFase, setPhotoFase] = useState<FotoPerkembanganLuka['fase']>('Sebelum Tindakan');
  const [photoCatatan, setPhotoCatatan] = useState('');
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

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
      setPanjangCm(asm.ukuran.panjangCm);
      setLebarCm(asm.ukuran.lebarCm);
      setKedalamanMm(asm.ukuran.kedalamanMm);
      setUnderminingCm(asm.ukuran.underminingGoaCm ?? 0);

      setGranulasi(asm.dasarLuka.persenGranulasi);
      setSlough(asm.dasarLuka.persenSlough);
      setNekrotik(asm.dasarLuka.persenNekrotik);
      setEpitelisasi(asm.dasarLuka.persenEpitelisasi);

      setEksudatJumlah(asm.eksudat.jumlah);
      setEksudatWarna(asm.eksudat.warna);
      setEksudatBau(asm.eksudat.bau);

      setKulitSekitar(asm.kulitSekitar);
      setTepiLuka(asm.tepiLuka);
      setTandaInfeksi(asm.tandaInfeksi);
      setSkorNyeri(asm.skorNyeri);

      setCairanPencuci(asm.tindakanWoundCare.cairanPencuci);
      setTeknikDebridement(asm.tindakanWoundCare.teknikDebridement);
      setPrimaryDressing(asm.tindakanWoundCare.primaryDressing);
      setSecondaryDressing(asm.tindakanWoundCare.secondaryDressing);
      setTargetEvaluasi(asm.targetEvaluasi);
    } else {
      // Intelligent fallback derived from diagnosisMedisUtama
      const diag = (selectedPatient.diagnosisMedisUtama || '').toLowerCase();
      let defaultView: 'foot' | 'anterior' | 'posterior' = 'anterior';
      let defaultTipe: TipeLuka = 'Luka Trauma / Laserasi';
      let defaultStadium = 'Superficial Partial-Thickness';
      let defaultLokasi = 'Extremitas Superior Sinistra (Lengan Kiri)';
      let defX = 24;
      let defY = 45;

      if (diag.includes('diabet') || diag.includes('pedis') || diag.includes('kaki') || diag.includes('foot')) {
        defaultView = 'foot';
        defaultTipe = 'Ulkus Diabetikum (Diabetic Foot)';
        defaultStadium = 'Wagner Grade 2';
        defaultLokasi = 'Plantar Pedis Dextra (Telapak Kaki Kanan)';
        defX = 74;
        defY = 78;
      } else if (diag.includes('sakrum') || diag.includes('decubitus') || diag.includes('pressure') || diag.includes('tekan')) {
        defaultView = 'posterior';
        defaultTipe = 'Luka Tekan (Pressure Injury / Decubitus)';
        defaultStadium = 'Stadium 2 (Hilangnya sebagian ketebalan kulit)';
        defaultLokasi = 'Regio Sakrum / Os Koksi (Dekubitus)';
        defX = 50;
        defY = 48;
      } else if (diag.includes('venos') || diag.includes('cruris') || diag.includes('betis')) {
        defaultView = 'anterior';
        defaultTipe = 'Ulkus Venosum / Arteriosum';
        defaultStadium = 'Superficial Full-Thickness Dermis';
        defaultLokasi = 'Regio Cruris Anterior Sinistra (Betis Depan Kiri)';
        defX = 42;
        defY = 78;
      }

      const newPin: TitikLukaPeta = {
        id: `PIN-${selectedPatient.id}-1`,
        nomor: 1,
        label: 'Luka Utama',
        view: defaultView,
        x: defX,
        y: defY,
        regioAnatomi: defaultLokasi,
      };
      setTitikLukaList([newPin]);
      setActiveTitikId(newPin.id);
      setLokasiLuka(defaultLokasi);
      setTipeLuka(defaultTipe);
      setStadiumLuka(defaultStadium);
      setPanjangCm(3.0);
      setLebarCm(2.0);
      setKedalamanMm(3);
      setUnderminingCm(0);
      setGranulasi(80);
      setSlough(10);
      setNekrotik(0);
      setEpitelisasi(10);
      setEksudatJumlah('Sedikit');
      setEksudatWarna('Serous');
      setEksudatBau('Tidak Berbau');
      setKulitSekitar('Sehat');
      setTepiLuka('Menyatu');
      setTandaInfeksi({
        dolorNyeri: true,
        calorHangat: false,
        ruborKemerahan: true,
        tumorBengkak: false,
        functioLaesa: false,
      });
      setSkorNyeri(2);
      setCairanPencuci('NaCl 0.9% steril irigasi lembut');
      setTeknikDebridement('Mechanical cleansing & debridement tepi luka');
      setPrimaryDressing('Hydrogel dressing + Non-adherent wound contact layer');
      setSecondaryDressing('Sterile gauze pad + cohesive bandage');
      setTargetEvaluasi('Penutupan epitelial tepi luka dalam 5 hari');
    }
  }, [selectedPasienId, selectedPatient]);

  // Photo Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewPhoto(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = () => {
    if (!selectedPatient || !previewPhoto) return;

    addWoundPhoto({
      pasienId: selectedPatient.id,
      tanggal: new Date().toISOString().split('T')[0],
      fase: photoFase,
      dataUrl: previewPhoto,
      catatan: photoCatatan || `Dokumentasi luka ${photoFase}`,
      perawat: currentUser.nama,
    });

    setPreviewPhoto(null);
    setPhotoCatatan('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Real-time Clinical Safety Allergy Detector
  const detectedAllergyKeyword = React.useMemo(() => {
    if (!selectedPatient?.riwayatAlergi || selectedPatient.riwayatAlergi === 'Tidak Ada') return null;
    const allergyLower = selectedPatient.riwayatAlergi.toLowerCase();
    const dressingCombined = `${primaryDressing} ${secondaryDressing} ${cairanPencuci}`.toLowerCase();

    const dangerKeywords = ['plester', 'karet', 'latex', 'lateks', 'iodine', 'betadine', 'penisilin', 'sulfa'];
    for (const kw of dangerKeywords) {
      if (allergyLower.includes(kw) && dressingCombined.includes(kw)) {
        return kw;
      }
    }
    return null;
  }, [selectedPatient, primaryDressing, secondaryDressing, cairanPencuci]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const activePin = titikLukaList.find((p) => p.id === activeTitikId) || titikLukaList[0];

    addAssessment(selectedPatient.id, {
      pasienId: selectedPatient.id,
      perawatPemeriksa: currentUser.nama,
      lokasiLuka,
      lokasiKoordinat: activePin ? { x: activePin.x, y: activePin.y, view: activePin.view } : undefined,
      daftarTitikLuka: titikLukaList,
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
    <div className="w-full px-4 sm:px-6 py-5 space-y-5">
      {/* Patient Selector Bar with Searchable Combobox */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative w-full lg:w-[480px]" ref={patientDropdownRef}>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Pilih Pasien Pemeriksaan:
          </label>
          
          <button
            type="button"
            onClick={() => setIsPatientDropdownOpen(!isPatientDropdownOpen)}
            className="w-full text-left px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl text-xs transition flex items-center justify-between gap-2 cursor-pointer shadow-2xs"
          >
            {selectedPatient ? (
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 truncate">{selectedPatient.nama}</span>
                  <span className="font-mono text-[11px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 shrink-0">
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
            <div className="absolute top-full left-0 mt-1.5 w-full bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Quick Filter Search Box */}
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

              {/* Patient List */}
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
                            <span className="font-mono text-[10px] text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded">
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
          <div className="text-xs text-slate-600 flex items-center gap-4 flex-wrap">
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
            {/* Interactive Anatomical Body Map Component */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
              <InteractiveBodyMap
                lokasiLuka={lokasiLuka}
                onLokasiLukaChange={setLokasiLuka}
                titikLukaList={titikLukaList}
                onTitikLukaListChange={setTitikLukaList}
                activeTitikId={activeTitikId}
                onActiveTitikIdChange={setActiveTitikId}
              />
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

            {/* Card Galeri Foto Perkembangan Luka (Before-After) */}
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Foto Perkembangan Luka (Before-After)
                  </h4>
                </div>
                <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                  {patientPhotos.length} Foto
                </span>
              </div>

              {/* Upload & Capture Input */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="text-xs file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>

                {previewPhoto && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                    <div className="text-[11px] font-semibold text-slate-700">Preview Foto Baru:</div>
                    <div className="relative h-40 w-full rounded-md overflow-hidden bg-slate-900/5 border border-slate-200 flex items-center justify-center">
                      <img src={previewPhoto} alt="Preview Luka" className="max-h-full max-w-full object-contain" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Fase Dokumentasi:</label>
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
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Catatan Foto:</label>
                        <input
                          type="text"
                          value={photoCatatan}
                          onChange={(e) => setPhotoCatatan(e.target.value)}
                          placeholder="Misal: Slough diangkat 50%..."
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setPreviewPhoto(null)}
                        className="px-2.5 py-1 text-[11px] text-slate-600 hover:bg-slate-200 rounded"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={handleSavePhoto}
                        className="px-3 py-1 text-[11px] bg-blue-600 text-white font-bold rounded hover:bg-blue-700 shadow-xs flex items-center gap-1"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Simpan Foto ke Galeri</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Photo Timeline / Gallery */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Riwayat Visual Luka Pasien:
                </span>
                {patientPhotos.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    Belum ada foto luka yang diunggah untuk pasien ini.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5 max-h-60 overflow-y-auto">
                    {patientPhotos.map((photo) => (
                      <div key={photo.id} className="p-2 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5 relative group">
                        <div className="h-28 rounded bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                          <img src={photo.dataUrl} alt={photo.fase} className="max-h-full max-w-full object-contain" />
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className={`px-1.5 py-0.2 rounded font-bold ${
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
                          className="absolute top-3 right-3 p-1 bg-white/90 text-slate-400 hover:text-rose-600 rounded shadow-xs opacity-0 group-hover:opacity-100 transition"
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
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Resep Modern Dressing & Rencana Tindakan</h3>
                  <p className="text-xs text-slate-500">Pemberian cairan pencuci, debridement, dan balutan luka primer/sekunder</p>
                </div>
              </div>

              {/* Real-time Clinical Safety Alert Guard */}
              {detectedAllergyKeyword ? (
                <div className="p-4 bg-rose-50 border-2 border-rose-500 rounded-xl flex items-start gap-3 shadow-xs animate-in zoom-in-95 duration-150">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-black text-rose-900 uppercase tracking-wide flex items-center gap-2">
                      <span>PERINGATAN BAHAYA ALERGI PASIEN!</span>
                      <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
                        DANGER
                      </span>
                    </h5>
                    <p className="text-[11px] text-rose-800 mt-1 leading-snug">
                      Terdeteksi kata kunci <strong>&quot;{detectedAllergyKeyword.toUpperCase()}&quot;</strong> pada resep balutan Anda! Pasien ini memiliki riwayat alergi: <strong>{selectedPatient?.riwayatAlergi}</strong>.
                    </p>
                    <p className="text-[10px] text-rose-700 font-semibold mt-1 bg-white/70 p-2 rounded border border-rose-200">
                      Rekomendasi Aman: Ganti perekat karet dengan <strong>Silicone Adhesive Border Foam</strong> atau fiksasi <strong>Kasa Gulung Non-Adhesive / Tubular Bandage</strong> untuk mencegah kulit melepuh dan maserasi parah.
                    </p>
                  </div>
                </div>
              ) : selectedPatient?.riwayatAlergi && selectedPatient.riwayatAlergi !== 'Tidak Ada' ? (
                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg flex items-center gap-2 text-xs text-amber-900">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    <strong>Peringatan Pasien Berisiko:</strong> Pasien tercatat alergi terhadap <strong>{selectedPatient.riwayatAlergi}</strong>. Pastikan tidak meresepkan plester/balutan dengan perekat karet atau bahan pemicu.
                  </span>
                </div>
              ) : null}

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
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center gap-2"
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
