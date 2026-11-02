'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useClinic } from '@/context/ClinicContext';

export default function DashboardPage() {
  const { patients, schedules, searchTerm, setSearchTerm, resetAllData, currentUser } = useClinic();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleReset = () => {
    if (window.confirm('Hapus/Reset semua data pasien ke data awal?')) {
      resetAllData();
    }
  };

  const todayStr = 'Kamis, 17 September 2026';

  // Counts
  const pasienDirawatHariIni = patients.length;
  const homecareCount = schedules.filter((s) => s.jenisLayanan === 'Home Care').length || 5;
  const khitanCount = schedules.filter((s) => s.jenisLayanan === 'Khitan').length || 6;
  const perluAsesmenCount = patients.filter((p) => !p.asesmenTerakhir).length || 5;

  return (
    <main className="main-content">
      {/* Headerbar */}
      <header className="header">
        <div className="header-title">
          <h1>Dashboard</h1>
          <p>Selamat datang kembali di Rumah Luka Borneo</p>
        </div>

        <div className="header-actions">
          <button
            id="btnHapusSemuaData"
            type="button"
            onClick={handleReset}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
            }}
          >
            <i className="ph ph-trash"></i> Hapus Semua Data Pasien
          </button>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Cari pasien, No. RM, atau NIK..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="ph ph-magnifying-glass"></i>
          </div>

          <div style={{ position: 'relative' }}>
            <div
              className="user-avatar"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            >
              {currentUser.nama.charAt(0)}
            </div>

            {profileDropdownOpen && (
              <div
                className="profile-dropdown"
                style={{
                  display: 'block',
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  width: '180px',
                  zIndex: 100,
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', fontSize: '12px' }}>
                  <strong style={{ display: 'block', color: '#1e293b' }}>{currentUser.nama}</strong>
                  <span style={{ color: '#64748b' }}>{currentUser.role}</span>
                </div>
                <Link
                  href="/kelola-pengguna"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    color: '#1e293b',
                    textDecoration: 'none',
                    fontSize: '13px',
                    borderBottom: '1px solid #e2e8f0',
                  }}
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <i className="ph ph-user"></i> Lihat Profil
                </Link>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setProfileDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    color: '#ef4444',
                    textDecoration: 'none',
                    fontSize: '13px',
                  }}
                >
                  <i className="ph ph-sign-out"></i> Log Out
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Banner */}
      <section className="banner">
        <div className="banner-content">
          <p className="banner-date">{todayStr}</p>
          <h2>Agenda Pelayanan Hari Ini</h2>
          <p className="banner-desc">Pantau perawatan wound care, kunjungan homecare, dan jadwal khitan.</p>
        </div>
        <div className="banner-stat">
          <h3>{pasienDirawatHariIni || 12}</h3>
          <p>Pasien dijadwalkan</p>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="summary-cards">
        <div className="card">
          <h4>Pasien Dirawat Hari Ini</h4>
          <h2>{pasienDirawatHariIni || 12}</h2>
          <p className="text-blue">Pasien aktif hari ini</p>
        </div>
        <div className="card">
          <h4>Jadwal Homecare</h4>
          <h2>{homecareCount}</h2>
          <p className="text-green">Kunjungan terjadwal</p>
        </div>
        <div className="card">
          <h4>Khitan Mendatang</h4>
          <h2>{khitanCount}</h2>
          <p className="text-purple">Reservasi berikutnya</p>
        </div>
        <div className="card">
          <h4>Perlu Asesmen</h4>
          <h2>{perluAsesmenCount}</h2>
          <p className="text-orange">Perlu diperbarui</p>
        </div>
      </section>

      {/* Data Lists */}
      <section className="data-lists">
        {/* List 1 */}
        <div className="list-card">
          <div className="list-header">
            <h3>Pasien yang Hari Ini Dirawat</h3>
            <p>Daftar pasien aktif berdasarkan jadwal</p>
          </div>
          <div className="list-content">
            <div className="list-item">
              <div className="time">08.00</div>
              <div className="details">
                <strong>Siti Rahmawati</strong>
                <i className="ph ph-bandaids" style={{ color: 'var(--primary-blue)', marginLeft: '4px', marginRight: '4px' }}></i>
                <span>Wound Care</span>
              </div>
              <div className="status status-aktif">Aktif</div>
            </div>
            <div className="list-item">
              <div className="time">09.30</div>
              <div className="details">
                <strong>Budi Santoso</strong>
                <span>Rawat Inap</span>
              </div>
              <div className="status status-aktif">Aktif</div>
            </div>
            <div className="list-item">
              <div className="time">11.00</div>
              <div className="details">
                <strong>Nur Aisyah</strong>
                <i className="ph ph-bandaids" style={{ color: 'var(--primary-blue)', marginLeft: '4px', marginRight: '4px' }}></i>
                <span>Wound Care</span>
              </div>
              <div className="status status-menunggu">Menunggu</div>
            </div>
            <div className="list-item">
              <div className="time">13.30</div>
              <div className="details">
                <strong>Dewi Lestari</strong>
                <span>Rawat Inap</span>
              </div>
              <div className="status status-aktif">Aktif</div>
            </div>
            <div className="list-item">
              <div className="time">15.00</div>
              <div className="details">
                <strong>Rizky Maulana</strong>
                <i className="ph ph-bandaids" style={{ color: 'var(--primary-blue)', marginLeft: '4px', marginRight: '4px' }}></i>
                <span>Wound Care</span>
              </div>
              <div className="status status-terjadwal">Terjadwal</div>
            </div>
          </div>
          <Link href="/pendaftaran" className="view-all">
            Lihat semua pasien &rarr;
          </Link>
        </div>

        {/* List 2 */}
        <div className="list-card">
          <div className="list-header">
            <h3>Pasien Homecare Akan Dirawat</h3>
            <p>Kunjungan rumah mendatang</p>
          </div>
          <div className="list-content">
            <div className="list-item">
              <div className="time">08.00</div>
              <div className="details">
                <strong>Ibu Sulastri</strong>
                <span>Samarinda Ulu</span>
              </div>
              <div className="status status-terjadwal">Terjadwal</div>
            </div>
            <div className="list-item">
              <div className="time">10.00</div>
              <div className="details">
                <strong>Bapak Karno</strong>
                <span>Sungai Kunjang</span>
              </div>
              <div className="status status-terjadwal">Terjadwal</div>
            </div>
            <div className="list-item">
              <div className="time">13.00</div>
              <div className="details">
                <strong>Ibu Ratna</strong>
                <span>Loa Janan</span>
              </div>
              <div className="status status-terjadwal">Terjadwal</div>
            </div>
            <div className="list-item">
              <div className="time">15.00</div>
              <div className="details">
                <strong>Bapak Yusuf</strong>
                <span>Samarinda Ilir</span>
              </div>
              <div className="status status-terjadwal">Terjadwal</div>
            </div>
            <div className="list-item">
              <div className="time">16.00</div>
              <div className="details">
                <strong>Ibu Nurhayati</strong>
                <span>Samarinda Ulu</span>
              </div>
              <div className="status status-terjadwal">Terjadwal</div>
            </div>
          </div>
          <Link href="/jadwal" className="view-all">
            Lihat jadwal homecare &rarr;
          </Link>
        </div>

        {/* List 3 */}
        <div className="list-card">
          <div className="list-header">
            <h3>Jadwal Khitan Mendatang</h3>
            <p>Pasien sekali perawatan</p>
          </div>
          <div className="list-content">
            <div className="list-item">
              <div className="date-col">18 Sep</div>
              <div className="details">
                <strong>Raka Pratama</strong>
                <span>Jam 09.00</span>
              </div>
              <div className="status status-terjadwal">Terjadwal</div>
            </div>
            <div className="list-item">
              <div className="date-col">19 Sep</div>
              <div className="details">
                <strong>Fajar Setiawan</strong>
                <span>Jam 10.00</span>
              </div>
              <div className="status status-terjadwal">Terjadwal</div>
            </div>
            <div className="list-item">
              <div className="date-col">20 Sep</div>
              <div className="details">
                <strong>Muhammad Ali</strong>
                <span>Jam 08.30</span>
              </div>
              <div className="status status-terjadwal">Terjadwal</div>
            </div>
            <div className="list-item">
              <div className="date-col">21 Sep</div>
              <div className="details">
                <strong>Rizky Maulana</strong>
                <span>Jam 13.00</span>
              </div>
              <div className="status status-terjadwal">Terjadwal</div>
            </div>
            <div className="list-item">
              <div className="date-col">22 Sep</div>
              <div className="details">
                <strong>Ahmad Dani</strong>
                <span>Jam 09.30</span>
              </div>
              <div className="status status-terjadwal">Terjadwal</div>
            </div>
            <div className="list-item">
              <div className="date-col">23 Sep</div>
              <div className="details">
                <strong>Aditia Putra</strong>
                <span>Jam 11.00</span>
              </div>
              <div className="status status-terjadwal">Terjadwal</div>
            </div>
          </div>
          <Link href="/jadwal" className="view-all">
            Lihat seluruh jadwal &rarr;
          </Link>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions-section">
        <div className="quick-header">
          <h3>Akses Cepat</h3>
          <p>Mulai aktivitas baru</p>
        </div>
        <div className="quick-buttons">
          <Link href="/pendaftaran" className="quick-btn" style={{ textDecoration: 'none' }}>
            <i className="ph ph-plus"></i>
            Pendaftaran Pasien
          </Link>
          <Link href="/asesmen" className="quick-btn" style={{ textDecoration: 'none' }}>
            <i className="ph ph-file-text"></i>
            Update Asesmen
          </Link>
          <Link href="/jadwal" className="quick-btn" style={{ textDecoration: 'none' }}>
            <i className="ph ph-house-line"></i>
            Pendaftaran Homecare
          </Link>
          <Link href="/jadwal" className="quick-btn" style={{ textDecoration: 'none' }}>
            <i className="ph ph-scissors"></i>
            Jadwal Khitan
          </Link>
        </div>
      </section>
    </main>
  );
}
