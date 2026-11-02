'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClinic } from '@/context/ClinicContext';

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser } = useClinic();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [adminOpen, setAdminOpen] = useState(true);
  const [woundCareOpen, setWoundCareOpen] = useState(true);
  const [homeCareOpen, setHomeCareOpen] = useState(false);
  const [khitanOpen, setKhitanOpen] = useState(false);
  const [arsipOpen, setArsipOpen] = useState(false);

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <img
          src="/logo.png"
          alt="Rumah Luka Borneo Logo"
          className="sidebar-logo"
        />
        <button
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title="Toggle Sidebar"
          type="button"
        >
          <i className="ph ph-list"></i>
        </button>
      </div>

      <nav className="sidebar-nav">
        <Link
          href="/"
          className={`nav-item ${pathname === '/' ? 'active' : ''}`}
        >
          <i className="ph ph-squares-four"></i>
          <span>Dashboard</span>
        </Link>

        <Link
          href="/jadwal"
          className={`nav-item ${pathname === '/jadwal' ? 'active' : ''}`}
        >
          <i className="ph ph-calendar-blank"></i>
          <span>Jadwal Perawatan</span>
        </Link>

        {/* Dropdown Administrasi */}
        <div className="nav-dropdown-container">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setAdminOpen(!adminOpen);
            }}
            className={`nav-item has-dropdown ${pathname === '/pendaftaran' ? 'active' : ''}`}
          >
            <i className="ph ph-folder"></i>
            <span>Administrasi</span>
            <i
              className="ph ph-caret-down"
              style={{
                transition: 'transform 0.2s',
                transform: adminOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            ></i>
          </a>
          <div className={`nav-dropdown-menu ${adminOpen ? 'expanded' : ''}`} style={{ display: adminOpen ? 'flex' : 'none', flexDirection: 'column' }}>
            <Link
              href="/pendaftaran"
              className={`nav-dropdown-item ${pathname === '/pendaftaran' ? 'active' : ''}`}
              style={{ color: pathname === '/pendaftaran' ? 'var(--white)' : 'inherit', fontWeight: pathname === '/pendaftaran' ? 600 : 400 }}
            >
              Pendaftaran
            </Link>
          </div>
        </div>

        {/* Dropdown Wound Care */}
        <div className="nav-dropdown-container">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setWoundCareOpen(!woundCareOpen);
            }}
            className={`nav-item has-dropdown ${pathname === '/asesmen' || pathname === '/rekam-medis' ? 'active' : ''}`}
          >
            <i className="ph ph-bandaids"></i>
            <span>Wound Care</span>
            <i
              className="ph ph-caret-down"
              style={{
                transition: 'transform 0.2s',
                transform: woundCareOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            ></i>
          </a>
          <div className={`nav-dropdown-menu ${woundCareOpen ? 'expanded' : ''}`} style={{ display: woundCareOpen ? 'flex' : 'none', flexDirection: 'column' }}>
            <Link
              href="/asesmen"
              className={`nav-dropdown-item ${pathname === '/asesmen' ? 'active' : ''}`}
            >
              Asesmen Luka
            </Link>
            <Link
              href="/rekam-medis"
              className={`nav-dropdown-item ${pathname === '/rekam-medis' ? 'active' : ''}`}
            >
              Rekam Medis (CPPT)
            </Link>
          </div>
        </div>

        {/* Dropdown Home Care */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setHomeCareOpen(!homeCareOpen);
          }}
          className="nav-item has-dropdown"
        >
          <i className="ph ph-house"></i>
          <span>Home Care</span>
          <i
            className="ph ph-caret-down"
            style={{
              transition: 'transform 0.2s',
              transform: homeCareOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          ></i>
        </a>

        {/* Dropdown Khitan */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setKhitanOpen(!khitanOpen);
          }}
          className="nav-item has-dropdown"
        >
          <i className="ph ph-first-aid"></i>
          <span>Khitan</span>
          <i
            className="ph ph-caret-down"
            style={{
              transition: 'transform 0.2s',
              transform: khitanOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          ></i>
        </a>

        {/* Dropdown Arsip */}
        <div className="nav-dropdown-container">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setArsipOpen(!arsipOpen);
            }}
            className="nav-item has-dropdown"
          >
            <i className="ph ph-archive"></i>
            <span>Arsip</span>
            <i
              className="ph ph-caret-down"
              style={{
                transition: 'transform 0.2s',
                transform: arsipOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            ></i>
          </a>
          <div className={`nav-dropdown-menu ${arsipOpen ? 'expanded' : ''}`} style={{ display: arsipOpen ? 'flex' : 'none', flexDirection: 'column' }}>
            <Link href="/rekam-medis" className="nav-dropdown-item">
              Rekam Medis
            </Link>
          </div>
        </div>

        <Link
          href="/kelola-pengguna"
          className={`nav-item ${pathname === '/kelola-pengguna' ? 'active' : ''}`}
        >
          <i className="ph ph-users"></i>
          <span>Kelola Pengguna</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="user-status">
          <p className="status-label">Pengguna Aktif</p>
          <div className="status-indicator">
            <span className="dot"></span>
            <span className="role">{currentUser.role}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
