'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClinic } from '@/context/ClinicContext';
import { 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  Stethoscope,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, users } = useClinic();

  const [username, setUsername] = useState('hendra_rlb');
  const [password, setPassword] = useState('123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!username.trim() || !password) {
      setErrorMessage('Username dan password wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(username, password);
      if (res.success) {
        router.push('/');
      } else {
        setErrorMessage(res.message || 'Login gagal. Periksa kembali akun Anda.');
      }
    } catch {
      setErrorMessage('Terjadi kendala saat proses autentikasi.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (uname: string) => {
    setUsername(uname);
    setPassword('123');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-100 text-slate-800">
      {/* Left Brand Panel */}
      <div className="hidden md:flex md:w-5/12 lg:w-4/12 bg-slate-900 text-white flex-col justify-between p-8 lg:p-12 border-r border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl shadow-xs">
              <img src="/logo.png" alt="Rumah Luka Borneo" className="h-10 w-auto object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Rumah Luka Borneo</h1>
              <p className="text-xs text-slate-400">Truly Health Care Center</p>
            </div>
          </div>

          <div className="mt-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800 text-blue-300 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Sistem EHR Rekam Medis Terakreditasi
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white leading-snug">
              Manajemen Perawatan Luka Modern & Asesmen Klinis Terintegrasi.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Dokumentasi terstruktur standar CWCCA, kalkulasi otomatis skor BWAT & PUSH Tool, Peta Luka Interaktif, serta monitoring jadwal Home Care.
            </p>
          </div>
        </div>

        {/* Clinical Assurance Pillars */}
        <div className="space-y-3 pt-8 border-t border-slate-800">
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Kepatuhan Standar Privasi Pasien & Rekam Medis (CPPT)</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Dukungan Database MySQL & Operasional Offline Lokal</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Audit Trail & Hak Akses Berbasis Profesi (RBAC)</span>
          </div>
          <p className="text-[11px] text-slate-500 pt-3">
            &copy; 2026 Rumah Luka Borneo. Hak Cipta Dilindungi Undang-Undang.
          </p>
        </div>
      </div>

      {/* Right Login Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-14">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-10">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <img src="/logo.png" alt="Rumah Luka Borneo" className="h-10 w-auto object-contain" />
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-none">Rumah Luka Borneo</h1>
              <p className="text-[11px] text-slate-500 mt-1">Sistem EHR Rekam Medis</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Masuk Sistem</h3>
            <p className="text-xs text-slate-500 mt-1">
              Gunakan kredensial akun tenaga medis Anda untuk mengakses sistem rekam medis.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Username / NIP Petugas
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: hendra_rlb"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password Akun
                </label>
                <span className="text-[11px] text-slate-500">Default uji coba: <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700 font-mono font-bold">123</code></span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>Memproses Autentikasi...</>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Presets */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Login Instan (Akun Tim Medis Demo):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('hendra_rlb')}
                className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                  username === 'hendra_rlb'
                    ? 'border-blue-500 bg-blue-50/60 font-semibold text-blue-900'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="font-medium text-slate-900 truncate">Ns. Hendra</div>
                <div className="text-[10px] text-blue-600 font-medium">Perawat Luka</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin_kolifah')}
                className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                  username === 'admin_kolifah'
                    ? 'border-purple-500 bg-purple-50/60 font-semibold text-purple-900'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="font-medium text-slate-900 truncate">Bu Kolifah</div>
                <div className="text-[10px] text-purple-600 font-medium">Admin Klinik</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('dr_siti')}
                className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                  username === 'dr_siti'
                    ? 'border-emerald-500 bg-emerald-50/60 font-semibold text-emerald-900'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="font-medium text-slate-900 truncate">dr. Siti Sp.B</div>
                <div className="text-[10px] text-emerald-600 font-medium">Dokter Bedah</div>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
              Klik salah satu akun di atas untuk mengisi username secara instan, lalu klik tombol <strong>Masuk ke Dashboard</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

