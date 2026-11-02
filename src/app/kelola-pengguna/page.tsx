'use client';

import React, { useState } from 'react';

interface StaffUser {
  id: number;
  username: string;
  role: 'Admin' | 'User';
}

export default function KelolaPenggunaPage() {
  const [users, setUsers] = useState<StaffUser[]>([
    { id: 1, username: 'admin', role: 'Admin' },
    { id: 2, username: 'azhari', role: 'User' },
    { id: 3, username: 'intan', role: 'User' },
    { id: 4, username: 'oktabilla', role: 'User' },
  ]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    setUsers([
      ...users,
      {
        id: users.length + 1,
        username,
        role: isAdmin ? 'Admin' : 'User',
      },
    ]);

    setUsername('');
    setPassword('');
    setIsAdmin(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Hapus pengguna ini?')) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const handleToggleRole = (id: number) => {
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, role: u.role === 'Admin' ? 'User' : 'Admin' } : u
      )
    );
  };

  return (
    <main className="main-content">
      {/* Headerbar */}
      <header className="header" style={{ background: 'transparent', border: 'none' }}>
        <div className="header-title">
          <h1 style={{ color: '#1e293b', fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>
            Kelola Pengguna
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Menu khusus admin untuk manajemen akun pengguna
          </p>
        </div>

        <div className="header-actions">
          <div className="user-avatar">A</div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Tambah Pengguna Baru */}
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
            height: 'fit-content',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '24px' }}>
            Tambah Pengguna Baru
          </h2>

          <form onSubmit={handleAdd}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                Username
              </label>
              <input
                type="text"
                required
                placeholder="admin / username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  backgroundColor: '#f1f5f9',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                Password
              </label>
              <input
                type="password"
                required
                placeholder="•••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  backgroundColor: '#f1f5f9',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '24px',
                fontSize: '14px',
                color: '#334155',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                style={{ width: '18px', height: '18px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#1e1b4b' }}
              />
              Beri Akses Admin
            </label>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#23223b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontFamily: 'inherit',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Tambah Pengguna
            </button>
          </form>
        </div>

        {/* Daftar Pengguna */}
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '24px' }}>
            Daftar Pengguna
          </h2>

          <div style={{ border: '1px solid #f1f5f9', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                  <th style={{ padding: '16px 24px', color: '#94a3b8', fontWeight: 600, fontSize: '12px' }}>ID</th>
                  <th style={{ padding: '16px 24px', color: '#94a3b8', fontWeight: 600, fontSize: '12px' }}>USERNAME</th>
                  <th style={{ padding: '16px 24px', color: '#94a3b8', fontWeight: 600, fontSize: '12px' }}>ROLE</th>
                  <th style={{ padding: '16px 24px', color: '#94a3b8', fontWeight: 600, fontSize: '12px', textAlign: 'right' }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '20px 24px', color: '#334155' }}>{u.id}</td>
                    <td style={{ padding: '20px 24px', fontWeight: 600, color: '#1e293b' }}>{u.username}</td>
                    <td style={{ padding: '20px 24px' }}>
                      <span
                        style={{
                          backgroundColor: u.role === 'Admin' ? '#e0e7ff' : '#f1f5f9',
                          color: u.role === 'Admin' ? '#3730a3' : '#64748b',
                          padding: '6px 16px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => handleDelete(u.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#fee2e2',
                            color: '#ef4444',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 600,
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          Hapus
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleRole(u.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#d1fae5',
                            color: '#059669',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 600,
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          Ubah Role
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
