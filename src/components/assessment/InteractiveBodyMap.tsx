'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Crosshair, 
  Footprints, 
  User, 
  Check, 
  Sparkles,
  Info,
  ShieldAlert
} from 'lucide-react';
import { TitikLukaPeta } from '@/types';

interface InteractiveBodyMapProps {
  lokasiLuka: string;
  onLokasiLukaChange: (lokasi: string) => void;
  titikLukaList: TitikLukaPeta[];
  onTitikLukaListChange: (list: TitikLukaPeta[]) => void;
  activeTitikId: string;
  onActiveTitikIdChange: (id: string) => void;
}

export function InteractiveBodyMap({
  lokasiLuka,
  onLokasiLukaChange,
  titikLukaList,
  onTitikLukaListChange,
  activeTitikId,
  onActiveTitikIdChange,
}: InteractiveBodyMapProps) {
  const [activeView, setActiveView] = useState<'anterior' | 'posterior' | 'foot'>('foot');

  // Active pin reference
  const activePin = titikLukaList.find((p) => p.id === activeTitikId) || titikLukaList[0];

  // Auto-sync activeView when activePin or its perspective view changes
  React.useEffect(() => {
    if (activePin?.view && activePin.view !== activeView) {
      setActiveView(activePin.view);
    }
  }, [activePin?.id, activePin?.view]);

  // Auto-detect anatomical region based on view and (x, y) %
  const detectRegion = (view: 'anterior' | 'posterior' | 'foot', x: number, y: number): string => {
    if (view === 'foot') {
      // Foot diagram split: Left side is Plantar (Bottom), Right side is Dorsal (Top)
      // or split by Left foot (x < 50%) and Right foot (x >= 50%)
      const isRightFoot = x >= 50;
      const footSide = isRightFoot ? 'Dextra (Kanan)' : 'Sinistra (Kiri)';

      if (y < 22) {
        if (x > 38 && x < 62) return `Hallux / Ibu Jari Kaki ${footSide}`;
        return `Digiti II - V (Jari-Jari Kaki) ${footSide}`;
      } else if (y < 45) {
        return `Ball of Foot (Kaput Metatarsal I-V) ${footSide} - Rentan Ulkus`;
      } else if (y < 68) {
        if (x > 25 && x < 75) return `Midfoot (Lengkung Medial / Plantar Tengah) ${footSide}`;
        return `Tepi Lateral Kaki ${footSide}`;
      } else if (y < 88) {
        return `Kalkaneus / Tumit (Plantar Heel) ${footSide} - Area Tekanan Tinggi`;
      } else {
        return `Tendo Achilles & Pergelangan Kaki ${footSide}`;
      }
    }

    if (view === 'anterior') {
      if (y < 16) return 'Regio Caput / Facialis (Kepala / Wajah)';
      if (y < 28) return 'Regio Thoracalis (Dada)';
      if (y < 42) return 'Regio Abdominalis (Perut)';
      if (y < 52) return 'Regio Pelvis / Inguinalis (Panggul / Selangkangan)';
      
      // Arms
      if (y >= 22 && y <= 60) {
        if (x < 28) return 'Extremitas Superior Sinistra (Lengan Kiri)';
        if (x > 72) return 'Extremitas Superior Dextra (Lengan Kanan)';
      }

      // Legs
      if (y < 70) {
        return x < 50 ? 'Regio Femoris Sinistra (Paha Kiri)' : 'Regio Femoris Dextra (Paha Kanan)';
      }
      if (y < 85) {
        return x < 50 ? 'Regio Cruris Anterior Sinistra (Tulang Kering / Betis Kiri)' : 'Regio Cruris Anterior Dextra (Tulang Kering / Betis Kanan)';
      }
      return x < 50 ? 'Dorsum Pedis Sinistra (Punggung Kaki Kiri)' : 'Dorsum Pedis Dextra (Punggung Kaki Kanan)';
    }

    if (view === 'posterior') {
      if (y < 16) return 'Regio Occipitalis (Kepala Belakang / Tengkuk)';
      if (y < 35) return 'Regio Scapularis (Punggung Atas / Belikat)';
      if (y < 48) return 'Regio Lumbalis / Sakrum (Punggung Bawah & Tulang Ekor) - Rentan Dekubitus';
      if (y < 62) {
        return x < 50 ? 'Regio Glutealis Sinistra (Bokong Kiri) - Dekubitus' : 'Regio Glutealis Dextra (Bokong Kanan) - Dekubitus';
      }
      if (y < 80) {
        return x < 50 ? 'Regio Suralis Sinistra (Betis Belakang Kiri)' : 'Regio Suralis Dextra (Betis Belakang Kanan)';
      }
      return x < 50 ? 'Kalkaneus Sinistra (Tumit Belakang Kiri)' : 'Kalkaneus Dextra (Tumit Belakang Kanan)';
    }

    return 'Regio Anatomis Tubuh';
  };

  // Click on Canvas to reposition or add pin
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const regionName = detectRegion(activeView, x, y);

    if (activePin) {
      // Update existing active pin
      const updatedList = titikLukaList.map((p) =>
        p.id === activePin.id
          ? { ...p, x, y, view: activeView, regioAnatomi: regionName }
          : p
      );
      onTitikLukaListChange(updatedList);
      onLokasiLukaChange(regionName);
    } else {
      // Add first pin
      const newPin: TitikLukaPeta = {
        id: `PIN-${Date.now()}`,
        nomor: 1,
        label: 'Luka Utama',
        view: activeView,
        x,
        y,
        regioAnatomi: regionName,
      };
      onTitikLukaListChange([newPin]);
      onActiveTitikIdChange(newPin.id);
      onLokasiLukaChange(regionName);
    }
  };

  // Add another wound pin (Multi-Wound)
  const handleAddNewPin = () => {
    const nextNomor = titikLukaList.length + 1;
    const defaultRegion = activeView === 'foot' ? 'Plantar Pedis Dextra (Tumit Kanan)' : 'Regio Sakrum (Dekubitus)';
    const newPin: TitikLukaPeta = {
      id: `PIN-${Date.now()}`,
      nomor: nextNomor,
      label: `Luka ${nextNomor}`,
      view: activeView,
      x: 50,
      y: activeView === 'foot' ? 75 : 50,
      regioAnatomi: defaultRegion,
    };

    const newList = [...titikLukaList, newPin];
    onTitikLukaListChange(newList);
    onActiveTitikIdChange(newPin.id);
    onLokasiLukaChange(defaultRegion);
  };

  // Remove a wound pin
  const handleRemovePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (titikLukaList.length <= 1) return; // Keep at least one
    const updated = titikLukaList.filter((p) => p.id !== id);
    onTitikLukaListChange(updated);
    if (activeTitikId === id && updated.length > 0) {
      onActiveTitikIdChange(updated[0].id);
      onLokasiLukaChange(updated[0].regioAnatomi);
    }
  };

  // Quick Clinical Presets
  const clinicalPresets = [
    { label: 'Tumit Kanan (Heel)', view: 'foot' as const, x: 74, y: 78, name: 'Kalkaneus / Tumit Kanan (Plantar Dextra)' },
    { label: 'Jempol Kaki Kanan (Hallux)', view: 'foot' as const, x: 62, y: 15, name: 'Hallux Pedis Dextra (Jempol Kaki Kanan)' },
    { label: 'Telapak Kaki Depan (Metatarsal)', view: 'foot' as const, x: 72, y: 35, name: 'Ball of Foot / Metatarsal Plantar Dextra' },
    { label: 'Tumit Kiri (Calcaneus)', view: 'foot' as const, x: 26, y: 78, name: 'Kalkaneus / Tumit Kiri (Plantar Sinistra)' },
    { label: 'Sakrum / Tulang Ekor (Dekubitus)', view: 'posterior' as const, x: 50, y: 48, name: 'Regio Sakrum / Coccygis (Luka Tekan / Dekubitus)' },
    { label: 'Betis Kiri Depan (Ulkus Vena)', view: 'anterior' as const, x: 42, y: 78, name: 'Regio Cruris Anterior Sinistra (Betis Depan Kiri)' },
    { label: 'Paha / Trochanter (Dekubitus)', view: 'posterior' as const, x: 62, y: 55, name: 'Regio Trochanter Dextra (Panggul Kanan Dekubitus)' },
  ];

  const applyPreset = (preset: typeof clinicalPresets[0]) => {
    setActiveView(preset.view);
    if (activePin) {
      const updatedList = titikLukaList.map((p) =>
        p.id === activePin.id
          ? { ...p, x: preset.x, y: preset.y, view: preset.view, regioAnatomi: preset.name }
          : p
      );
      onTitikLukaListChange(updatedList);
      onLokasiLukaChange(preset.name);
    }
  };

  return (
    <div className="space-y-4">
      {/* 2-Column Responsive Clinical Workstation Layout (lg:grid lg:grid-cols-12 lg:gap-6), 1-Column on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: Large Interactive Anatomy Viewport (7 cols on lg, 8 on xl) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-3.5">
          {/* Header Bar: Perspective Switcher Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-blue-600" />
                <span>Peta Anatomi & Pemetaan Luka</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Klik langsung pada kanvas diagram untuk memposisikan titik luka secara presisi.
              </p>
            </div>

            {/* View Switcher Tabs (3 Perspectives) */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto border border-slate-200/60 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setActiveView('foot');
                  if (activePin) {
                    onTitikLukaListChange(
                      titikLukaList.map((p) => (p.id === activePin.id ? { ...p, view: 'foot' } : p))
                    );
                  }
                }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 text-xs ${
                  activeView === 'foot'
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Footprints className="w-4 h-4" />
                <span>Telapak Kaki (Plantar)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveView('anterior');
                  if (activePin) {
                    onTitikLukaListChange(
                      titikLukaList.map((p) => (p.id === activePin.id ? { ...p, view: 'anterior' } : p))
                    );
                  }
                }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 text-xs ${
                  activeView === 'anterior'
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Tampak Depan</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveView('posterior');
                  if (activePin) {
                    onTitikLukaListChange(
                      titikLukaList.map((p) => (p.id === activePin.id ? { ...p, view: 'posterior' } : p))
                    );
                  }
                }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 text-xs ${
                  activeView === 'posterior'
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <User className="w-4 h-4 rotate-180" />
                <span>Tampak Belakang (Sakrum)</span>
              </button>
            </div>
          </div>

          {/* Main Anatomy Canvas Card */}
          <div className="bg-slate-50/70 border border-slate-200/90 rounded-2xl overflow-hidden p-4 sm:p-5 select-none flex flex-col items-center justify-center shadow-xs">
            {/* Canvas Status & Perspective Bar */}
            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-2 border-b border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
                  Diagram Aktif:
                </span>
                <span className="font-bold text-slate-800 text-xs sm:text-sm">
                  {activeView === 'foot' && 'Peta Telapak Kaki Bilateral (Plantar Pedis Dextra & Sinistra)'}
                  {activeView === 'anterior' && 'Anatomi Tubuh Tampak Depan (Anterior View)'}
                  {activeView === 'posterior' && 'Anatomi Tubuh Tampak Belakang & Regio Sakrum (Posterior View)'}
                </span>
              </div>

              {activePin && (
                <div className="bg-white border border-slate-200 px-3 py-1 rounded-lg text-xs font-mono font-bold text-blue-700 shadow-2xs self-start sm:self-auto flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  <span>#{activePin.nomor} {activePin.label}: X {activePin.x}% • Y {activePin.y}%</span>
                </div>
              )}
            </div>

            {/* Clickable Anatomy Canvas Container (Large & Square for Optimal Precision) */}
            <div
              onClick={handleCanvasClick}
              className="relative w-full max-w-[560px] sm:max-w-[620px] aspect-square cursor-crosshair flex items-center justify-center my-2 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden"
            >
              {/* VIEW 1: DIABETIC FOOT BILATERAL (PLANTER PEDIS DEXTRA & SINISTRA) */}
              {activeView === 'foot' && (
                <svg
                  viewBox="0 0 340 340"
                  className="w-full h-full drop-shadow-xs pointer-events-none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="340" height="340" rx="16" fill="#f8fafc" />

                  {/* Grid Lines Subtle */}
                  <line x1="170" y1="20" x2="170" y2="320" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1.5" />
                  <line x1="20" y1="80" x2="320" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="20" y1="160" x2="320" y2="160" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="20" y1="250" x2="320" y2="250" stroke="#f1f5f9" strokeWidth="1" />

                  {/* Labels for Left / Right */}
                  <text x="85" y="32" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">
                    Kaki Kiri (Sinistra)
                  </text>
                  <text x="255" y="32" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">
                    Kaki Kanan (Dextra)
                  </text>

                  {/* LEFT FOOT (SINISTRA) - PLANTAR SOLE */}
                  <g id="foot-left" transform="translate(10, 20)">
                    {/* Toes (Jari Kaki Kiri) */}
                    {/* Hallux / Jempol (Medial - right side of left foot) */}
                    <ellipse cx="125" cy="50" rx="14" ry="19" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
                    <ellipse cx="98" cy="46" rx="8" ry="13" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
                    <ellipse cx="78" cy="49" rx="7" ry="12" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
                    <ellipse cx="61" cy="54" rx="6.5" ry="11" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
                    <ellipse cx="46" cy="62" rx="6" ry="10" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />

                    {/* Foot Pad / Sole Body */}
                    <path
                      d="M40 75 C 35 110, 42 160, 55 190 C 65 215, 62 230, 60 250 C 58 275, 75 285, 95 285 C 115 285, 128 275, 125 250 C 122 220, 100 170, 115 130 C 125 105, 138 85, 135 75 C 110 70, 60 70, 40 75 Z"
                      fill="#f1f5f9"
                      stroke="#64748b"
                      strokeWidth="2"
                    />

                    {/* High Pressure Risk Zones Overlay (Kaput Metatarsal & Heel) */}
                    <ellipse cx="88" cy="100" rx="36" ry="14" fill="#fee2e2" stroke="#fca5a5" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="88" y="103" textAnchor="middle" fill="#991b1b" fontSize="8" fontWeight="bold">Metatarsal</text>

                    <ellipse cx="92" cy="255" rx="24" ry="18" fill="#fee2e2" stroke="#fca5a5" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="92" y="258" textAnchor="middle" fill="#991b1b" fontSize="8" fontWeight="bold">Tumit / Heel</text>
                  </g>

                  {/* RIGHT FOOT (DEXTRA) - PLANTAR SOLE */}
                  <g id="foot-right" transform="translate(180, 20)">
                    {/* Toes (Jari Kaki Kanan) */}
                    {/* Hallux / Jempol (Medial - left side of right foot) */}
                    <ellipse cx="25" cy="50" rx="14" ry="19" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
                    <ellipse cx="52" cy="46" rx="8" ry="13" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
                    <ellipse cx="72" cy="49" rx="7" ry="12" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
                    <ellipse cx="89" cy="54" rx="6.5" ry="11" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
                    <ellipse cx="104" cy="62" rx="6" ry="10" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />

                    {/* Foot Pad / Sole Body */}
                    <path
                      d="M15 75 C 12 85, 25 105, 35 130 C 50 170, 28 220, 25 250 C 22 275, 35 285, 55 285 C 75 285, 92 275, 90 250 C 88 230, 85 215, 95 190 C 108 160, 115 110, 110 75 C 90 70, 40 70, 15 75 Z"
                      fill="#f1f5f9"
                      stroke="#64748b"
                      strokeWidth="2"
                    />

                    {/* High Pressure Risk Zones Overlay (Kaput Metatarsal & Heel) */}
                    <ellipse cx="62" cy="100" rx="36" ry="14" fill="#fee2e2" stroke="#fca5a5" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="62" y="103" textAnchor="middle" fill="#991b1b" fontSize="8" fontWeight="bold">Metatarsal</text>

                    <ellipse cx="58" cy="255" rx="24" ry="18" fill="#fee2e2" stroke="#fca5a5" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="58" y="258" textAnchor="middle" fill="#991b1b" fontSize="8" fontWeight="bold">Tumit / Heel</text>
                  </g>
                </svg>
              )}

              {/* VIEW 2: ANTERIOR (TAMPAK DEPAN) */}
              {activeView === 'anterior' && (
                <svg
                  viewBox="0 0 340 340"
                  className="w-full h-full drop-shadow-xs pointer-events-none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="340" height="340" rx="16" fill="#f8fafc" />

                  {/* Anatomy Outline Anterior */}
                  <g transform="translate(70, 15)">
                    {/* Head */}
                    <ellipse cx="100" cy="28" rx="20" ry="24" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
                    {/* Neck */}
                    <path d="M94 51 L94 62 L106 62 L106 51 Z" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
                    {/* Torso & Pelvis */}
                    <path
                      d="M70 65 L60 85 L65 140 L76 160 L100 170 L124 160 L135 140 L140 85 L130 65 Z"
                      fill="#f1f5f9"
                      stroke="#64748b"
                      strokeWidth="2"
                    />
                    {/* Chest Guide */}
                    <line x1="75" y1="95" x2="125" y2="95" stroke="#cbd5e1" strokeDasharray="2 2" strokeWidth="1" />
                    {/* Abdomen Guide */}
                    <line x1="75" y1="130" x2="125" y2="130" stroke="#cbd5e1" strokeDasharray="2 2" strokeWidth="1" />

                    {/* Left Arm (Patient Right) */}
                    <path d="M60 85 L35 145 L25 190 L18 190 L30 145 L50 80 Z" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.5" />
                    {/* Right Arm (Patient Left) */}
                    <path d="M140 85 L165 145 L175 190 L182 190 L170 145 L150 80 Z" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.5" />

                    {/* Left Leg */}
                    <path
                      d="M76 160 L70 220 L75 270 L72 305 L88 305 L92 270 L95 220 L98 170 Z"
                      fill="#f1f5f9"
                      stroke="#64748b"
                      strokeWidth="1.8"
                    />
                    {/* Right Leg */}
                    <path
                      d="M124 160 L130 220 L125 270 L128 305 L112 305 L108 270 L105 220 L102 170 Z"
                      fill="#f1f5f9"
                      stroke="#64748b"
                      strokeWidth="1.8"
                    />

                    {/* Knee Patella Highlights */}
                    <circle cx="83" cy="225" r="7" fill="#fee2e2" stroke="#fca5a5" strokeWidth="1" strokeDasharray="2 2" />
                    <circle cx="117" cy="225" r="7" fill="#fee2e2" stroke="#fca5a5" strokeWidth="1" strokeDasharray="2 2" />
                  </g>
                </svg>
              )}

              {/* VIEW 3: POSTERIOR (TAMPAK BELAKANG & SAKRUM) */}
              {activeView === 'posterior' && (
                <svg
                  viewBox="0 0 340 340"
                  className="w-full h-full drop-shadow-xs pointer-events-none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="340" height="340" rx="16" fill="#f8fafc" />

                  {/* Anatomy Outline Posterior */}
                  <g transform="translate(70, 15)">
                    {/* Head (Occiput) */}
                    <ellipse cx="100" cy="28" rx="20" ry="24" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
                    {/* Neck */}
                    <path d="M94 51 L94 62 L106 62 L106 51 Z" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
                    
                    {/* Back / Spine / Gluteus */}
                    <path
                      d="M70 65 L60 85 L65 135 L68 165 C 68 185, 100 185, 100 170 C 100 185, 132 185, 132 165 L135 135 L140 85 L130 65 Z"
                      fill="#f1f5f9"
                      stroke="#64748b"
                      strokeWidth="2"
                    />

                    {/* Scapula lines */}
                    <path d="M75 80 L88 100 L78 115" stroke="#cbd5e1" strokeWidth="1.5" fill="none" />
                    <path d="M125 80 L112 100 L122 115" stroke="#cbd5e1" strokeWidth="1.5" fill="none" />

                    {/* SACRUM / COCCYX DECUBITUS CRITICAL ZONE HIGHLIGHT */}
                    <ellipse cx="100" cy="155" rx="16" ry="12" fill="#fee2e2" stroke="#e11d48" strokeWidth="1.5" strokeDasharray="3 3" />
                    <text x="100" y="158" textAnchor="middle" fill="#9f1239" fontSize="8" fontWeight="bold">Sakrum / Ekor</text>

                    {/* Left Arm Posterior */}
                    <path d="M60 85 L35 145 L25 190 L18 190 L30 145 L50 80 Z" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.5" />
                    {/* Right Arm Posterior */}
                    <path d="M140 85 L165 145 L175 190 L182 190 L170 145 L150 80 Z" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.5" />

                    {/* Left Leg Posterior */}
                    <path
                      d="M74 175 L70 230 L74 275 L71 305 L87 305 L91 275 L95 230 L98 175 Z"
                      fill="#f1f5f9"
                      stroke="#64748b"
                      strokeWidth="1.8"
                    />
                    {/* Right Leg Posterior */}
                    <path
                      d="M126 175 L130 230 L126 275 L129 305 L113 305 L109 275 L105 230 L102 175 Z"
                      fill="#f1f5f9"
                      stroke="#64748b"
                      strokeWidth="1.8"
                    />

                    {/* Calcaneus Heel Decubitus Zones */}
                    <ellipse cx="79" cy="300" rx="8" ry="5" fill="#fee2e2" stroke="#e11d48" strokeWidth="1" strokeDasharray="2 2" />
                    <ellipse cx="121" cy="300" rx="8" ry="5" fill="#fee2e2" stroke="#e11d48" strokeWidth="1" strokeDasharray="2 2" />
                  </g>
                </svg>
              )}

              {/* RENDER PINS ON TOP OF THE CANVAS */}
              {titikLukaList.map((pt) => {
                // Render pin if it belongs to current view OR user is viewing it
                const isCurrentView = pt.view === activeView;
                const isSelected = pt.id === (activePin?.id);

                if (!isCurrentView) return null;

                return (
                  <div
                    key={pt.id}
                    style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-full pointer-events-none transition-all duration-200 flex flex-col items-center z-20"
                  >
                    <div className={`px-2.5 py-1 rounded-full text-xs font-black shadow-md flex items-center gap-1.5 leading-none ${
                      isSelected 
                        ? 'bg-rose-600 text-white ring-2 ring-white scale-110' 
                        : 'bg-slate-800 text-slate-100 opacity-90'
                    }`}>
                      <span>#{pt.nomor}</span>
                      <span className="font-semibold text-[11px]">{pt.label}</span>
                    </div>
                    <MapPin className={`w-7 h-7 drop-shadow-md ${
                      isSelected 
                        ? 'text-rose-600 fill-rose-600 scale-110' 
                        : 'text-slate-800 fill-slate-800'
                    }`} />
                  </div>
                );
              })}
            </div>

            {/* Informative Hint Bar below diagram */}
            <div className="mt-2 text-center">
              <p className="text-xs text-slate-500 font-medium">
                💡 <strong className="text-slate-700">Tips:</strong> Klik pada bagian anatomi di atas untuk menggeser pin lokasi luka secara akurat.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Control Panel & Clinical Intelligence (5 cols on lg, 4 on xl) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          
          {/* Card 1: Multi-Wound Pins Manager */}
          <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Daftar Titik Luka Pasien:</span>
              </span>
              <button
                type="button"
                onClick={handleAddNewPin}
                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                title="Tambah titik luka sekunder pada pasien ini"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Luka Baru</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {titikLukaList.map((pt) => {
                const isActive = pt.id === (activePin?.id);
                return (
                  <div
                    key={pt.id}
                    onClick={() => {
                      onActiveTitikIdChange(pt.id);
                      onLokasiLukaChange(pt.regioAnatomi);
                      setActiveView(pt.view);
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition select-none ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-300'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                      isActive ? 'bg-white text-blue-700 font-black' : 'bg-slate-200 text-slate-700 font-bold'
                    }`}>
                      {pt.nomor}
                    </span>
                    <span>{pt.label}</span>
                    {titikLukaList.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => handleRemovePin(pt.id, e)}
                        className={`p-0.5 rounded hover:bg-rose-50 hover:text-rose-600 transition ${
                          isActive ? 'text-blue-200 hover:text-rose-200 hover:bg-blue-700' : 'text-slate-400'
                        }`}
                        title="Hapus titik luka ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2: Detected Anatomical Location & Manual Override */}
          <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-600" />
                <span>Nama Lokasi Anatomis Terdeteksi:</span>
              </label>
              <span className="text-[10px] text-blue-700 font-mono font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Target: {activePin?.label || 'Luka Utama'}
              </span>
            </div>
            <input
              type="text"
              required
              value={lokasiLuka}
              onChange={(e) => {
                onLokasiLukaChange(e.target.value);
                if (activePin) {
                  const updated = titikLukaList.map((p) =>
                    p.id === activePin.id ? { ...p, regioAnatomi: e.target.value } : p
                  );
                  onTitikLukaListChange(updated);
                }
              }}
              placeholder="Contoh: Plantar Pedis Dextra (Tumit Kanan)..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 font-bold text-xs sm:text-sm shadow-inner transition"
            />
            <p className="text-[11px] text-slate-500">
              *Tersinkronisasi otomatis ke lembar rekam medis CPPT & resume klinis PPA.
            </p>
          </div>

          {/* Card 3: Quick Clinical Presets */}
          <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Preset Lokasi Sering Dirawat:</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">1-Klik auto-set pin</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {clinicalPresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="text-xs font-semibold bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition shadow-2xs flex items-center gap-1.5"
                >
                  <span>{preset.view === 'foot' ? '🦶' : '👤'}</span>
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Card 4: Clinical Advisory / Offloading Guidance */}
          <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/70 text-xs text-blue-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-blue-700 shrink-0" />
              <span>Protokol Klinis Perawatan Luka Modern:</span>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              {activeView === 'foot' 
                ? 'Pada ulkus kaki diabetik (DFU), pastikan selalu melakukan debridement kalus hiperkeratotik di sekitar luka dan edukasikan penggunaan alas kaki offloading khusus.'
                : activeView === 'posterior'
                ? 'Pada luka tekan regio sakrum/gluteal, terapkan protokol reposisi miring kanan-kiri setiap 2 jam, gunakan balutan foam silikon untuk mengurangi shear, dan jaga kebersihan peri-anal.'
                : 'Pada ulkus tungkai bawah / cruris, pastikan evaluasi pulsasi distal dan tanda insufisiensi vena sebelum tindakan kompresi.'}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

