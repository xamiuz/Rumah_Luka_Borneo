'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useClinic } from '@/context/ClinicContext';

export default function PendaftaranPage() {
  const { patients, addPatient, deletePatient } = useClinic();

  const [nama, setNama] = useState('');
  const [noRm, setNoRm] = useState('');
  const [nik, setNik] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [agama, setAgama] = useState('Islam');
  const [noHp, setNoHp] = useState('');
  const [statusNikah, setStatusNikah] = useState('Menikah');
  const [pendidikan, setPendidikan] = useState('SMA');
  const [pekerjaan, setPekerjaan] = useState('');
  const [suku, setSuku] = useState('');
  const [alamat, setAlamat] = useState('');
  const [kontakDarurat, setKontakDarurat] = useState('');
  const [hubungan, setHubungan] = useState('');

  // Service selection
  const [selectedService, setSelectedService] = useState<'rawat-jalan' | 'wound-care' | 'home-care' | 'khitan'>('wound-care');

  // General Wound Assessment
  const [keluhan, setKeluhan] = useState('');
  const [riwayatPenyakitDahulu, setRiwayatPenyakitDahulu] = useState('');
  const [lamanyaMenderita, setLamanyaMenderita] = useState('');
  const [alasanTerdiagnosa, setAlasanTerdiagnosa] = useState('');
  const [terapiDidapat, setTerapiDidapat] = useState('');
  const [statusGlycemic, setStatusGlycemic] = useState('Terkontrol');
  const [riwayatKeluarga, setRiwayatKeluarga] = useState('');
  const [riwayatLuka, setRiwayatLuka] = useState('');

  // Body map markers
  const [markers, setMarkers] = useState<{ id: number; x: number; y: number }[]>([
    { id: 1, x: 55, y: 88 },
  ]);

  // Inhibiting factors (Faktor Penghambat)
  const [inhibitors, setInhibitors] = useState<string[]>(['Diabetes']);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleInhibitor = (item: string) => {
    if (inhibitors.includes(item)) {
      setInhibitors(inhibitors.filter((i) => i !== item));
    } else {
      setInhibitors([...inhibitors, item]);
    }
  };

  const handleBodyMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setMarkers([...markers, { id: Date.now(), x, y }]);
  };

  const removeMarker = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setMarkers(markers.filter((m) => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !nik) {
      alert('Nama dan NIK wajib diisi.');
      return;
    }

    const created = addPatient({
      nik,
      nama,
      tanggalLahir: tanggalLahir || '1980-01-01',
      jenisKelamin,
      alamat: alamat || 'Kota Bontang',
      noHp: noHp || '-',
      pekerjaan: pekerjaan || '-',
      golonganDarah: 'O',
      riwayatAlergi: 'Tidak Ada',
      riwayatPenyakit: inhibitors,
      statusKunjungan: 'Antrean',
      diagnosisMedisUtama: keluhan || `${selectedService === 'wound-care' ? 'Wound Care Pasien Baru' : 'Pemeriksaan Klinis'}`,
    });

    setSaveSuccess(true);
    setNama('');
    setNik('');
    setAlamat('');
    setNoHp('');
    setKeluhan('');

    setTimeout(() => setSaveSuccess(false), 5000);
  };

  return (
    <main className="main-content">
      {/* Headerbar */}
      <header className="header" style={{ justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
        <div className="header-title">
          <h1 style={{ color: 'var(--text-main)', fontSize: '24px', fontWeight: 700 }}>Pendaftaran Pasien</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Registrasi pasien baru & asesmen klinis awal</p>
        </div>
        <div className="header-actions">
          <div
            className="draft-badge"
            style={{
              backgroundColor: 'var(--white)',
              border: '1px solid #e2e8f0',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-muted)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {saveSuccess ? 'Data Pasien Berhasil Disimpan!' : 'Draft • Formulir Aktif'}
          </div>
        </div>
      </header>

      {saveSuccess && (
        <div
          style={{
            backgroundColor: '#d1fae5',
            border: '1px solid #10b981',
            color: '#065f46',
            padding: '14px 20px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>Pasien baru berhasil didaftarkan ke sistem rekam medis Rumah Luka Borneo!</span>
          <Link
            href="/asesmen"
            style={{
              backgroundColor: '#059669',
              color: 'white',
              padding: '6px 14px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '12px',
            }}
          >
            Buka Asesmen Luka &rarr;
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Registration Form Card 1 */}
        <section className="registration-form-card">
          <div className="form-header">
            <h2>1. Data Identitas Pasien</h2>
            <p>Lengkapi identitas utama sebelum memilih jenis layanan.</p>
          </div>

          <div className="form-body">
            {/* Row 1 */}
            <div className="form-row">
              <div className="form-group-reg form-col">
                <label>Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama lengkap"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />
              </div>
              <div className="form-group-reg form-col">
                <label>Nomor Rekam Medis (No. RM)</label>
                <input
                  type="text"
                  placeholder="Otomatis diterbitkan sistem"
                  value={noRm}
                  onChange={(e) => setNoRm(e.target.value)}
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="form-row">
              <div className="form-group-reg form-col">
                <label>NIK *</label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  placeholder="16 digit NIK KTP"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                />
              </div>
              <div className="form-group-reg form-col">
                <label>Tanggal Lahir</label>
                <input
                  type="date"
                  value={tanggalLahir}
                  onChange={(e) => setTanggalLahir(e.target.value)}
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="form-row">
              <div className="form-group-reg form-col">
                <label>Jenis Kelamin</label>
                <select
                  value={jenisKelamin}
                  onChange={(e) => setJenisKelamin(e.target.value as any)}
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div className="form-group-reg form-col">
                <label>Agama</label>
                <select value={agama} onChange={(e) => setAgama(e.target.value)}>
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Konghucu">Konghucu</option>
                </select>
              </div>
              <div className="form-group-reg form-col">
                <label>Nomor Telepon / WhatsApp</label>
                <input
                  type="text"
                  placeholder="08xxxxxxxxxxx"
                  value={noHp}
                  onChange={(e) => setNoHp(e.target.value)}
                />
              </div>
              <div className="form-group-reg form-col">
                <label>Status Pernikahan</label>
                <select value={statusNikah} onChange={(e) => setStatusNikah(e.target.value)}>
                  <option value="Lajang">Lajang</option>
                  <option value="Menikah">Menikah</option>
                  <option value="Cerai">Cerai</option>
                </select>
              </div>
            </div>

            {/* Row 4 */}
            <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr', display: 'grid', gap: '20px' }}>
              <div className="form-group-reg form-col">
                <label>Pendidikan Terakhir</label>
                <select value={pendidikan} onChange={(e) => setPendidikan(e.target.value)}>
                  <option value="SD">SD</option>
                  <option value="SMP">SMP</option>
                  <option value="SMA">SMA</option>
                  <option value="D3/S1">D3/S1</option>
                </select>
              </div>
              <div className="form-group-reg form-col">
                <label>Pekerjaan</label>
                <input
                  type="text"
                  placeholder="Masukkan pekerjaan"
                  value={pekerjaan}
                  onChange={(e) => setPekerjaan(e.target.value)}
                />
              </div>
              <div className="form-group-reg form-col">
                <label>Suku</label>
                <input
                  type="text"
                  placeholder="Masukkan suku bangsa"
                  value={suku}
                  onChange={(e) => setSuku(e.target.value)}
                />
              </div>
            </div>

            {/* Row 5 */}
            <div className="form-row">
              <div className="form-group-reg form-col">
                <label>Alamat Lengkap</label>
                <input
                  type="text"
                  placeholder="Alamat lengkap tempat tinggal pasien"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                />
              </div>
            </div>

            {/* Row 6 */}
            <div className="form-row">
              <div className="form-group-reg form-col">
                <label>Kontak Darurat</label>
                <input
                  type="text"
                  placeholder="Nama dan nomor kontak darurat"
                  value={kontakDarurat}
                  onChange={(e) => setKontakDarurat(e.target.value)}
                />
              </div>
              <div className="form-group-reg form-col">
                <label>Hubungan</label>
                <input
                  type="text"
                  placeholder="Hubungan dengan pasien (Keluarga/Kerabat)"
                  value={hubungan}
                  onChange={(e) => setHubungan(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Service Category Card 2 */}
        <section className="registration-form-card">
          <div className="form-header">
            <h2>2. Kategori Pelayanan</h2>
            <p>Pilih satu layanan sesuai kebutuhan pasien.</p>
          </div>

          <div className="service-cards-container">
            {[
              { id: 'rawat-jalan', title: 'Rawat Jalan', desc: 'Kunjungan klinik umum' },
              { id: 'wound-care', title: 'Wound Care', desc: 'Perawatan dan monitoring luka' },
              { id: 'home-care', title: 'Home Care', desc: 'Perawatan di rumah pasien' },
              { id: 'khitan', title: 'Khitan', desc: 'Layanan khitan' },
            ].map((srv) => {
              const isSelected = selectedService === srv.id;
              return (
                <div
                  key={srv.id}
                  className={`service-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedService(srv.id as any)}
                  style={{
                    border: isSelected ? '2px solid var(--primary-blue)' : '1px solid #e2e8f0',
                    cursor: 'pointer',
                  }}
                >
                  <div className="service-card-header">
                    <div
                      className="checkbox-square"
                      style={{
                        backgroundColor: isSelected ? 'var(--primary-blue)' : 'transparent',
                        borderColor: isSelected ? 'var(--primary-blue)' : '#cbd5e1',
                        color: 'white',
                      }}
                    >
                      {isSelected && <i className="ph ph-check"></i>}
                    </div>
                    <h4>{srv.title}</h4>
                  </div>
                  <p>{srv.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* General Wound Assessment (Shown for Wound Care / Home Care) */}
        {(selectedService === 'wound-care' || selectedService === 'home-care') && (
          <>
            <section className="registration-form-card" style={{ border: '2px solid #3b82f6' }}>
              <div className="form-header">
                <h2>3. General Wound Assessment</h2>
                <p>Pengkajian riwayat keluhan luka pasien.</p>
              </div>

              <div className="form-body">
                <div className="form-row">
                  <div className="form-group-reg form-col">
                    <label>Keluhan Utama Terkait Luka</label>
                    <textarea
                      placeholder="Keluhan utama terkait luka..."
                      rows={3}
                      value={keluhan}
                      onChange={(e) => setKeluhan(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="form-group-reg form-col">
                    <label>Riwayat Penyakit Dahulu & Alergi</label>
                    <textarea
                      placeholder="DM, hipertensi, penyakit lain, alergi plester..."
                      rows={3}
                      value={riwayatPenyakitDahulu}
                      onChange={(e) => setRiwayatPenyakitDahulu(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1.5fr', display: 'grid', gap: '20px' }}>
                  <div className="form-group-reg form-col">
                    <label>Lamanya Menderita</label>
                    <input
                      type="text"
                      placeholder="Contoh: 3 bulan"
                      value={lamanyaMenderita}
                      onChange={(e) => setLamanyaMenderita(e.target.value)}
                    />
                  </div>
                  <div className="form-group-reg form-col">
                    <label>Alasan Terdiagnosa</label>
                    <input
                      type="text"
                      placeholder="Masukkan keterangan"
                      value={alasanTerdiagnosa}
                      onChange={(e) => setAlasanTerdiagnosa(e.target.value)}
                    />
                  </div>
                  <div className="form-group-reg form-col">
                    <label>Terapi yang Didapat</label>
                    <input
                      type="text"
                      placeholder="Obat/perawatan sebelumnya..."
                      value={terapiDidapat}
                      onChange={(e) => setTerapiDidapat(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1.5fr', display: 'grid', gap: '20px' }}>
                  <div className="form-group-reg form-col">
                    <label>Status Glycemic</label>
                    <input
                      type="text"
                      placeholder="Terkontrol / tidak"
                      value={statusGlycemic}
                      onChange={(e) => setStatusGlycemic(e.target.value)}
                    />
                  </div>
                  <div className="form-group-reg form-col">
                    <label>Riwayat Penyakit Keluarga</label>
                    <input
                      type="text"
                      placeholder="Ada / tidak"
                      value={riwayatKeluarga}
                      onChange={(e) => setRiwayatKeluarga(e.target.value)}
                    />
                  </div>
                  <div className="form-group-reg form-col">
                    <label>Riwayat Luka</label>
                    <input
                      type="text"
                      placeholder="Luka sebelumnya / berulang..."
                      value={riwayatLuka}
                      onChange={(e) => setRiwayatLuka(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Lokasi Luka Card (Peta Tubuh Interaktif) */}
            <section className="registration-form-card">
              <div className="form-header">
                <h2>4. Lokasi Luka – Peta Tubuh Interaktif</h2>
                <p>Sentuh titik pada gambar tubuh di bawah ini untuk menandai lokasi luka. Titik terpilih akan ditandai dengan bulatan biru.</p>
              </div>

              <div className="form-body">
                <div
                  className="body-map-container"
                  id="bodyMapContainer"
                  onClick={handleBodyMapClick}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    cursor: 'crosshair',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '16px',
                    minHeight: '360px',
                  }}
                >
                  <img
                    src="/body-map.png"
                    alt="Peta Tubuh"
                    className="body-map-image"
                    style={{ maxHeight: '340px', width: 'auto', objectFit: 'contain' }}
                  />

                  {markers.map((m) => (
                    <div
                      key={m.id}
                      onClick={(e) => removeMarker(m.id, e)}
                      title="Klik untuk menghapus tanda luka"
                      style={{
                        position: 'absolute',
                        left: `${m.x}%`,
                        top: `${m.y}%`,
                        width: '18px',
                        height: '18px',
                        backgroundColor: '#2563eb',
                        border: '2px solid white',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </div>

                <div
                  style={{
                    marginTop: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                  }}
                >
                  <div style={{ width: '12px', height: '12px', backgroundColor: '#2563eb', borderRadius: '50%' }}></div>
                  <span>Sentuh gambar untuk menandai / sentuh bulatan untuk menghapus tanda luka</span>
                </div>
              </div>
            </section>

            {/* Faktor Penghambat Card */}
            <section className="registration-form-card">
              <div className="form-header">
                <h2>5. Faktor Penghambat Penyembuhan Luka</h2>
                <p>Pilih faktor yang dapat menghambat proses penyembuhan luka.</p>
              </div>

              <div className="form-body">
                <div className="checkbox-grid-3">
                  {[
                    'Diabetes',
                    'Hipertensi',
                    'Gagal Ginjal',
                    'Edema',
                    'Sirkulasi',
                    'Imobilisasi',
                    'Luka Berulang',
                    'Kemoterapi',
                    'Luka Terinfeksi',
                    'Inkontinensia',
                    'Gaya Hidup',
                  ].map((item) => (
                    <label
                      key={item}
                      className="custom-checkbox-wrapper"
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      <input
                        type="checkbox"
                        checked={inhibitors.includes(item)}
                        onChange={() => toggleInhibitor(item)}
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* Action Buttons */}
        <div
          className="action-buttons"
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '16px',
            marginTop: '8px',
          }}
        >
          <Link
            href="/"
            className="btn-secondary"
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: 'white',
              color: 'var(--text-main)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            Batal
          </Link>
          <button
            type="submit"
            className="btn-primary"
            style={{
              padding: '12px 28px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'var(--primary-blue)',
              color: 'white',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            Simpan Data Pasien
          </button>
        </div>
      </form>

      {/* Tabel Pasien Terdaftar yang Sudah Ada di Sistem */}
      <section className="registration-form-card" style={{ marginTop: '32px' }}>
        <div className="form-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Daftar Pasien Terdaftar ({patients.length})</h2>
            <p>Data pasien yang sudah tersimpan di sistem rekam medis</p>
          </div>
        </div>

        <div style={{ overflowX: 'auto', marginTop: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px' }}>No. RM</th>
                <th style={{ padding: '12px 16px' }}>Nama Pasien</th>
                <th style={{ padding: '12px 16px' }}>NIK</th>
                <th style={{ padding: '12px 16px' }}>Diagnosis Utama</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--primary-blue)' }}>
                    {p.noRm}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{p.nama}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{p.nik}</td>
                  <td style={{ padding: '12px 16px' }}>{p.diagnosisMedisUtama}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: '#d1fae5',
                        color: '#065f46',
                      }}
                    >
                      {p.statusKunjungan}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <Link
                      href={`/asesmen?pasienId=${p.id}`}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'var(--primary-light)',
                        color: 'white',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontSize: '12px',
                        fontWeight: 500,
                        marginRight: '8px',
                      }}
                    >
                      Asesmen
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Hapus data pasien ${p.nama}?`)) deletePatient(p.id);
                      }}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                      title="Hapus"
                    >
                      <i className="ph ph-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
