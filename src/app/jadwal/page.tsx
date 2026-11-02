'use client';

import React, { useState } from 'react';
import { useClinic } from '@/context/ClinicContext';

export default function JadwalPage() {
  const { schedules, addSchedule, patients } = useClinic();
  const [currentMonth, setCurrentMonth] = useState('September 2026');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [pasienNama, setPasienNama] = useState('');
  const [noRm, setNoRm] = useState('');
  const [tglPerawatan, setTglPerawatan] = useState('17 September 2026');
  const [tindakan, setTindakan] = useState('Wound Care');
  const [catatan, setCatatan] = useState('Perawatan wound care sesuai jadwal.');

  const handlePatientSelect = (pId: string) => {
    const p = patients.find((item) => item.id === pId);
    if (p) {
      setPasienNama(p.nama);
      setNoRm(p.noRm);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasienNama) {
      alert('Nama pasien wajib diisi');
      return;
    }

    addSchedule({
      pasienId: `PAS-${Date.now()}`,
      namaPasien: pasienNama,
      noRm: noRm || 'RM-2026-AUTO',
      tanggalJadwal: '2026-09-17',
      jam: '09:00',
      jenisLayanan: tindakan as any || 'Wound Care Klinik',
      namaPerawat: 'Ns. Hendra Wijaya, S.Kep., CWCCA',
      status: 'Menunggu',
      catatan,
    });

    setShowAddModal(false);
    setPasienNama('');
    setNoRm('');
  };

  // Calendar days grid sample (30 days for September)
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <main className="main-content">
      {/* Headerbar */}
      <header className="header">
        <div className="header-title">
          <h1 style={{ color: 'var(--primary-blue)', fontSize: '22px', fontWeight: 700 }}>
            Kalender Perawatan
          </h1>
        </div>
        <div className="header-actions">
          <div className="search-bar">
            <input type="text" placeholder="Cari pasien atau No. RM..." />
            <i className="ph ph-magnifying-glass"></i>
          </div>
        </div>
      </header>

      {/* Calendar Controls Banner */}
      <section className="calendar-controls">
        <div className="month-title">
          <h2 id="currentMonthLabel">{currentMonth}</h2>
        </div>
        <div className="nav-buttons">
          <button className="nav-btn" id="prevMonth" title="Bulan Sebelumnya">
            <i className="ph ph-caret-left"></i>
          </button>
          <button className="nav-btn" id="nextMonth" title="Bulan Berikutnya">
            <i className="ph ph-caret-right"></i>
          </button>
          <button className="btn-today" id="btnToday">
            Hari Ini
          </button>
        </div>
      </section>

      {/* Summary Cards for Calendar */}
      <section className="summary-cards calendar-summary">
        <div className="card cal-stat">
          <h4>Jadwal Hari Ini</h4>
          <div className="stat-value">
            <h2>{schedules.length || 1}</h2>
            <span>pasien</span>
          </div>
        </div>
        <div className="card cal-stat">
          <h4>Pasien Woundcare</h4>
          <div className="stat-value">
            <h2>3</h2>
            <span>terjadwal</span>
          </div>
        </div>
        <div className="card cal-stat">
          <h4>Menunggu Konfirmasi</h4>
          <div className="stat-value">
            <h2>2</h2>
            <span>pasien</span>
          </div>
        </div>
        <div className="card cal-stat action-card">
          <h4>Aksi Cepat</h4>
          <button
            className="btn-add-schedule"
            onClick={() => setShowAddModal(true)}
          >
            + Tambah Jadwal Baru
          </button>
        </div>
      </section>

      {/* Calendar Grid */}
      <section className="calendar-container">
        <div className="calendar-header-days">
          <div>Sen</div>
          <div>Sel</div>
          <div>Rab</div>
          <div>Kam</div>
          <div>Jum</div>
          <div>Sab</div>
          <div>Min</div>
        </div>
        <div className="calendar-grid" id="calendarGrid">
          {calendarDays.map((day) => {
            const isToday = day === 17;
            const hasEvent = day === 17 || day === 18 || day === 21;
            return (
              <div
                key={day}
                className={`calendar-day ${isToday ? 'today' : ''}`}
                onClick={() => setShowAddModal(true)}
                style={{
                  minHeight: '80px',
                  padding: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: isToday ? '#f0f9ff' : 'white',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                <div style={{ fontWeight: isToday ? 700 : 500, color: isToday ? 'var(--primary-blue)' : '#1e293b' }}>
                  {day}
                </div>
                {hasEvent && (
                  <div
                    style={{
                      marginTop: '6px',
                      backgroundColor: isToday ? '#0ea5e9' : '#e0f2fe',
                      color: isToday ? 'white' : '#0369a1',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {isToday ? '12 Pasien' : 'Wound Care'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="calendar-footer">
          <p>Klik tanggal untuk memasukkan pasien dan membuat jadwal.</p>
        </div>
      </section>

      {/* Modal Add Schedule */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              maxWidth: '480px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Tambah Jadwal Wound Care</h3>
                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Kamis, 17 September 2026</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>Pilih Pasien Terdaftar</label>
                <select
                  onChange={(e) => handlePatientSelect(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                >
                  <option value="">-- Pasien Baru / Bebas --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama} ({p.noRm})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nama Pasien *</label>
                <input
                  type="text"
                  required
                  value={pasienNama}
                  onChange={(e) => setPasienNama(e.target.value)}
                  placeholder="Masukkan nama pasien"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>No. RM</label>
                <input
                  type="text"
                  value={noRm}
                  onChange={(e) => setNoRm(e.target.value)}
                  placeholder="Nomor Rekam Medis"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>Tindakan</label>
                <input
                  type="text"
                  value={tindakan}
                  onChange={(e) => setTindakan(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>Catatan</label>
                <textarea
                  rows={2}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '10px 16px', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 20px', background: 'var(--primary-blue)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
