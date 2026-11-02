'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useClinic } from '@/context/ClinicContext';

function RekamMedisContent() {
  const searchParams = useSearchParams();
  const { patients, cpptRecords, addCPPT, currentUser } = useClinic();

  const queryPasienId = searchParams.get('pasienId');
  const [selectedPasienId, setSelectedPasienId] = useState<string>(
    queryPasienId || (patients.length > 0 ? patients[0].id : '')
  );
  const [searchRM, setSearchRM] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New SOAP
  const [soapS, setSoapS] = useState('');
  const [soapO, setSoapO] = useState('');
  const [soapA, setSoapA] = useState('');
  const [soapP, setSoapP] = useState('');
  const [instruksi, setInstruksi] = useState('');

  useEffect(() => {
    if (queryPasienId) {
      setSelectedPasienId(queryPasienId);
    }
  }, [queryPasienId]);

  const selectedPatient = patients.find((p) => p.id === selectedPasienId);
  const patientCPPT = cpptRecords.filter((c) => c.pasienId === selectedPasienId);

  const filteredPatients = patients.filter((p) => {
    if (!searchRM) return true;
    const q = searchRM.toLowerCase();
    return p.nama.toLowerCase().includes(q) || p.noRm.toLowerCase().includes(q);
  });

  const handleAddCatatan = (e: React.FormEvent) => {
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
      instruksiPPA: instruksi || 'Pertahankan balutan tetap bersih dan kering.',
    });

    setSoapS('');
    setSoapO('');
    setSoapA('');
    setSoapP('');
    setInstruksi('');
    setShowAddModal(false);
  };

  return (
    <main
      className="main-content"
      style={{
        padding: 0,
        backgroundColor: '#f8fafc',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Headerbar */}
      <header
        className="header"
        style={{
          background: '#fff',
          borderBottom: '1px solid #e2e8f0',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div className="header-title">
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
            Rekam Medis Pasien
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Manajemen data dan riwayat medis pasien
          </p>
        </div>

        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => window.print()}
            style={{
              padding: '8px 16px',
              backgroundColor: 'white',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <i className="ph ph-printer"></i> Cetak CPPT
          </button>
          <div className="user-avatar">{currentUser.nama.charAt(0)}</div>
        </div>
      </header>

      {/* RM Dual-Pane Container */}
      <div
        className="rm-container"
        style={{
          display: 'flex',
          gap: '12px',
          height: 'calc(100vh - 100px)',
          padding: '16px',
          boxSizing: 'border-box',
        }}
      >
        {/* Left Sidebar: Patient List */}
        <div
          className="rm-sidebar"
          style={{
            width: '280px',
            flexShrink: 0,
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
          }}
        >
          <div
            className="rm-header"
            style={{
              backgroundColor: '#0ea5e9',
              color: 'white',
              padding: '12px 16px',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            Daftar Pasien ({filteredPatients.length})
          </div>

          <div className="rm-search" style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
            <input
              type="text"
              placeholder="Cari berdasarkan RM atau nama"
              value={searchRM}
              onChange={(e) => setSearchRM(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          <div
            className="rm-patient-list"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {filteredPatients.map((p) => {
              const isSelected = p.id === selectedPasienId;
              return (
                <div
                  key={p.id}
                  className="rm-patient-card"
                  onClick={() => setSelectedPasienId(p.id)}
                  style={{
                    border: isSelected ? '2px solid #0ea5e9' : '1px solid #e2e8f0',
                    backgroundColor: isSelected ? '#f0f9ff' : 'white',
                    borderRadius: '8px',
                    padding: '16px',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  <div className="rm-patient-name" style={{ fontWeight: 700, fontSize: '13px', color: '#1e293b', marginBottom: '6px' }}>
                    {p.nama}
                  </div>
                  <div className="rm-patient-details" style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>
                    {p.noRm} • {p.jenisKelamin}
                  </div>
                  <div className="rm-patient-date" style={{ fontSize: '11px', color: '#64748b' }}>
                    {p.tanggalDaftar || 'Hari ini'}
                  </div>
                  <div
                    className="rm-badge-bpjs"
                    style={{
                      position: 'absolute',
                      bottom: '16px',
                      right: '16px',
                      backgroundColor: '#ecfdf5',
                      color: '#10b981',
                      border: '1px solid #10b981',
                      padding: '4px 12px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 700,
                    }}
                  >
                    UMUM / BPJS
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Main Pane: Patient Details & CPPT */}
        <div
          className="rm-main"
          style={{
            flex: 1,
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
          }}
        >
          <div
            className="rm-header"
            style={{
              backgroundColor: '#0ea5e9',
              color: 'white',
              padding: '12px 16px',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            Data Diri Pasien
          </div>

          {!selectedPatient ? (
            <div
              className="rm-placeholder"
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
              }}
            >
              <i className="ph-fill ph-lock-key" style={{ fontSize: '80px', color: '#f87171', marginBottom: '20px' }}></i>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#475569' }}>
                SILAHKAN PILIH PASIEN TERLEBIH DAHULU
              </h3>
            </div>
          ) : (
            <div
              className="rm-detail"
              style={{
                padding: '24px',
                overflowY: 'auto',
                height: '100%',
              }}
            >
              {/* Profile Card */}
              <div
                className="profile-card"
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '24px',
                  display: 'flex',
                  gap: '32px',
                  marginBottom: '24px',
                  background: '#fff',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'flex-start', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      backgroundColor: '#cbd5e1',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                      fontWeight: 700,
                      color: '#1e293b',
                    }}
                  >
                    {selectedPatient.nama.charAt(0)}
                  </div>
                  <Link
                    href={`/asesmen?pasienId=${selectedPatient.id}`}
                    style={{
                      border: '1px solid #0ea5e9',
                      color: '#0ea5e9',
                      background: 'transparent',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Buka Asesmen
                  </Link>
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: '15px',
                      marginBottom: '16px',
                      color: '#1e293b',
                    }}
                  >
                    {selectedPatient.nama} / RM: {selectedPatient.noRm} / NIK: {selectedPatient.nik} / {selectedPatient.jenisKelamin.toUpperCase()}
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                      fontSize: '12px',
                      color: '#1e293b',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', marginBottom: '8px' }}>
                        <span style={{ width: '110px', color: '#64748b' }}>Tgl Lahir</span>
                        <span>: {selectedPatient.tanggalLahir}</span>
                      </div>
                      <div style={{ display: 'flex', marginBottom: '8px' }}>
                        <span style={{ width: '110px', color: '#64748b' }}>No. Telepon</span>
                        <span>: {selectedPatient.noHp}</span>
                      </div>
                      <div style={{ display: 'flex', marginBottom: '8px' }}>
                        <span style={{ width: '110px', color: '#64748b' }}>Pekerjaan</span>
                        <span>: {selectedPatient.pekerjaan}</span>
                      </div>
                      <div style={{ display: 'flex' }}>
                        <span style={{ width: '110px', color: '#64748b' }}>Gol. Darah</span>
                        <span>: {selectedPatient.golonganDarah}</span>
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', marginBottom: '8px' }}>
                        <span style={{ width: '110px', color: '#64748b' }}>Alamat</span>
                        <span>: {selectedPatient.alamat}</span>
                      </div>
                      <div style={{ display: 'flex', marginBottom: '8px' }}>
                        <span style={{ width: '110px', color: '#64748b' }}>Diagnosa</span>
                        <span>: <strong>{selectedPatient.diagnosisMedisUtama}</strong></span>
                      </div>
                      <div style={{ display: 'flex', marginBottom: '8px' }}>
                        <span style={{ width: '110px', color: '#64748b' }}>Alergi</span>
                        <span style={{ color: '#ef4444' }}>: {selectedPatient.riwayatAlergi}</span>
                      </div>
                      <div style={{ display: 'flex' }}>
                        <span style={{ width: '110px', color: '#64748b' }}>Komorbid</span>
                        <span>: {selectedPatient.riwayatPenyakit.join(', ') || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CPPT Header Banner */}
              <div
                style={{
                  backgroundColor: '#14b8a6',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>CPPT</h3>
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>
                    Catatan Perkembangan Pasien Terintegrasi
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  style={{
                    backgroundColor: 'white',
                    color: '#14b8a6',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  + Tambah Catatan
                </button>
              </div>

              {/* Modal Tambah Catatan */}
              {showAddModal && (
                <div
                  style={{
                    backgroundColor: '#fff',
                    border: '2px solid #14b8a6',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '24px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  }}
                >
                  <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: '#1e293b' }}>
                    Tambah Catatan SOAP Baru ({currentUser.nama} - {currentUser.role})
                  </h4>

                  <form onSubmit={handleAddCatatan} style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                    <div>
                      <label style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>S (Subjective)</label>
                      <textarea
                        required
                        rows={2}
                        value={soapS}
                        onChange={(e) => setSoapS(e.target.value)}
                        placeholder="Keluhan pasien, rasa nyeri, dsb..."
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>O (Objective)</label>
                      <textarea
                        required
                        rows={2}
                        value={soapO}
                        onChange={(e) => setSoapO(e.target.value)}
                        placeholder="Pemeriksaan fisik, kondisi luka, TTV..."
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>A (Assessment)</label>
                      <textarea
                        required
                        rows={2}
                        value={soapA}
                        onChange={(e) => setSoapA(e.target.value)}
                        placeholder="Diagnosa medis / keperawatan..."
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>P (Plan)</label>
                      <textarea
                        required
                        rows={2}
                        value={soapP}
                        onChange={(e) => setSoapP(e.target.value)}
                        placeholder="Rencana tindakan, resep dressing, kontrol..."
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>Instruksi PPA</label>
                      <input
                        type="text"
                        value={instruksi}
                        onChange={(e) => setInstruksi(e.target.value)}
                        placeholder="Instruksi profesional pemberi asuhan..."
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        style={{ padding: '8px 16px', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        style={{ padding: '8px 20px', background: '#14b8a6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Simpan Catatan
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* CPPT Entries List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {patientCPPT.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '13px', background: '#f8fafc', borderRadius: '8px' }}>
                    Belum ada riwayat catatan CPPT untuk pasien ini.
                  </div>
                ) : (
                  patientCPPT.map((cppt) => (
                    <div
                      key={cppt.id}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '16px',
                        backgroundColor: '#fff',
                        fontSize: '13px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          borderBottom: '1px solid #f1f5f9',
                          paddingBottom: '8px',
                          marginBottom: '12px',
                        }}
                      >
                        <div>
                          <strong style={{ color: '#0ea5e9', marginRight: '8px' }}>[{cppt.profesi}]</strong>
                          <strong>{cppt.namaTenagaMedis}</strong>
                        </div>
                        <span style={{ color: '#64748b', fontSize: '12px' }}>{cppt.tanggalWaktu}</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                          <strong style={{ display: 'block', color: '#1e293b', marginBottom: '4px' }}>S (Subjective):</strong>
                          <p style={{ margin: 0, color: '#334155' }}>{cppt.soap.subjective}</p>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                          <strong style={{ display: 'block', color: '#1e293b', marginBottom: '4px' }}>O (Objective):</strong>
                          <p style={{ margin: 0, color: '#334155' }}>{cppt.soap.objective}</p>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                          <strong style={{ display: 'block', color: '#1e293b', marginBottom: '4px' }}>A (Assessment):</strong>
                          <p style={{ margin: 0, color: '#334155' }}>{cppt.soap.assessment}</p>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                          <strong style={{ display: 'block', color: '#1e293b', marginBottom: '4px' }}>P (Plan):</strong>
                          <p style={{ margin: 0, color: '#334155' }}>{cppt.soap.plan}</p>
                        </div>
                      </div>

                      {cppt.instruksiPPA && (
                        <div style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: '#fef3c7', borderRadius: '6px', color: '#92400e' }}>
                          <strong>Instruksi PPA:</strong> {cppt.instruksiPPA}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function RekamMedisPage() {
  return (
    <Suspense fallback={<div style={{ padding: '24px' }}>Memuat rekam medis...</div>}>
      <RekamMedisContent />
    </Suspense>
  );
}
