import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import StatsCard from '../components/StatsCard';


export default function Dashboard() {
   const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] =
  useState({
    progress: 0,
    totalQuiz: 0,
    avgScore: 0,
    topicCount: 0,
    latestTopics: [],
  });

  const token =
  localStorage.getItem('token');


  
  const navigate = useNavigate();

  const [accessibility, setAccessibility] = useState({
    tts: false,
    subtitle: false,
    highContrast: false,
    darkMode: false,
  });

useEffect(() => {
  const savedUser = localStorage.getItem('user');

  if (savedUser) {
    setUser(JSON.parse(savedUser));
  } else {
    navigate('/');
    return;
  }

  const token = localStorage.getItem('token');

  if (token) {
    axios
      .get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDashboardData(res.data.data);
      })
      .catch((err) => {
        console.error('Dashboard Error:', err);
      });
  }
}, [navigate]);


  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const toggleAccessibility = (key) => {
    setAccessibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

const stats = [
  {
    label: 'Topik Dipelajari',
    value: dashboardData.topicCount,
    sub: 'Topik unik',
    icon: '📘',
  },
  {
    label: 'Kuis Dikerjakan',
    value: dashboardData.totalQuiz,
    sub: 'Total kuis',
    icon: '📝',
  },
  {
    label: 'Rata-rata Nilai',
    value: dashboardData.avgScore,
    sub: 'Hasil belajar',
    icon: '📈',
  },
];
const topikAktif =
  dashboardData.latestTopics;


  const accessibilityOptions = [
    { key: 'tts', icon: '🔊', label: 'Teks ke Suara', desc: 'Dengarkan materi dengan audio' },
    { key: 'subtitle', icon: '💬', label: 'Subtitle', desc: 'Tampilkan subtitle pada video' },
    { key: 'highContrast', icon: '👁️', label: 'Kontras Tinggi', desc: 'Tingkatkan kontras tampilan' },
    { key: 'darkMode', icon: '🌙', label: 'Mode Gelap', desc: 'Tampilan lebih nyaman belajar malam hari' },
  ];

  return (
    <div style={{ display: 'flex', background: '#f5f7fb', minHeight: '100vh' }}>
      <Sidebar />

      <div style={{ marginLeft: '260px', flex: 1, padding: '32px', width: 'calc(100% - 260px)' }}>

        {/* TOPBAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '28px', color: '#1e293b', marginBottom: '6px', fontWeight: '700' }}>
              Halo, {user?.name || 'Pengguna'}! 👋
            </h1>
            <p style={{ color: '#64748b', fontSize: '15px' }}>
              Semangat belajar hari ini! Yuk capai target belajarmu 🚀
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '600', color: '#1e293b' }}>{user?.name || 'Pengguna'}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Siswa</div>
            </div>
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%',
              background: '#6366f1', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '700', fontSize: '18px'
            }}>
              {(user?.name || 'P')[0].toUpperCase()}
            </div>
            <button onClick={handleLogout} style={{
              padding: '10px 18px', border: 'none', borderRadius: '10px',
              background: '#ef4444', color: 'white', cursor: 'pointer',
              fontWeight: '600', fontSize: '14px'
            }}>
              Logout
            </button>
          </div>
        </div>

        {/* ROW 1: Progress + Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>

          {/* Progress Belajar */}
          <Card>
            <h3 style={styles.cardTitle}>Progres Belajarmu</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>

              {/* Donut Chart */}
              <div style={{ position: 'relative', width: '110px', height: '110px', flexShrink: 0 }}>
                <svg width="110" height="110" viewBox="0 0 110 110">
                  <circle cx="55" cy="55" r="45" fill="none" stroke="#e2e8f0" strokeWidth="14" />
                  <circle
                    cx="55" cy="55" r="45" fill="none"
                    stroke="#6366f1" strokeWidth="14"
                    strokeDasharray={`${2 * Math.PI * 45 * dashboardData.progress / 100} ${2 * Math.PI * 45}`}
                    strokeLinecap="round"
                    transform="rotate(-90 55 55)"
                  />
                </svg>
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontWeight: '700', fontSize: '18px', color: '#6366f1'
                }}>{dashboardData.progress}%</div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { color: '#6366f1', label: 'Selesai' },
                  { color: '#a5b4fc', label: 'Sedang belajar' },
                  { color: '#e2e8f0', label: 'Belum Dimulai' },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.color }} />
                    <span style={{ fontSize: '13px', color: '#64748b' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {stats.map((s) => (
<StatsCard
  key={s.label}
  icon={s.icon}
  label={s.label}
  value={s.value}
  sub={s.sub}
/>            ))}
          </div>
        </div>

        {/* ROW 2: Lanjutkan Belajar + Topik Aktif */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>

          {/* Lanjutkan Belajar */}
          <Card>
            <h3 style={styles.cardTitle}>Lanjutkan Belajar</h3>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginTop: '8px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '14px',
                background: '#6366f1', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', flexShrink: 0
              }}>📘</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', fontSize: '17px', color: '#1e293b', marginBottom: '6px' }}>
                  Dasar Pemrograman Python
                </div>
                <div style={styles.progressBg}>
                  <div style={{ ...styles.progressFill, width: '60%' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>
                    Pelajari dasar sintaks, tipe data, dan kontrol alur dalam python
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#6366f1' }}>60%</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/modul')}
              style={{ ...styles.learnButton, marginTop: '20px', width: '100%' }}
            >
              Lanjutkan Belajar →
            </button>
          </Card>

          {/* Topik yang Sedang Dipelajari */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ ...styles.cardTitle, marginBottom: 0 }}>Topik yang Sedang Dipelajari</h3>
              <span
                onClick={() => navigate('/modul')}
                style={{ fontSize: '13px', color: '#6366f1', cursor: 'pointer', fontWeight: '600' }}
              >
                Lihat semua
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {topikAktif.map((t) => (
                <div key={t.nama}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '14px', color: '#1e293b' }}>{t.nama}</span>
                    <span style={{ fontSize: '13px', color: '#6366f1', fontWeight: '600' }}>{t.persen}%</span>
                  </div>
                  <div style={styles.progressBg}>
                    <div style={{ ...styles.progressFill, width: `${t.persen}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ROW 3: Aksesibilitas */}
        <Card>
          <h3 style={styles.cardTitle}>Aksesibilitas Untuk Semua</h3>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '-10px', marginBottom: '24px' }}>
            Kami menyediakan berbagai fitur untuk mendukung pengalaman belajar yang inklusif
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {accessibilityOptions.map((opt) => (
              <div key={opt.key} style={{
                background: '#f8fafc', borderRadius: '14px', padding: '18px',
                border: `2px solid ${accessibility[opt.key] ? '#6366f1' : '#e2e8f0'}`,
                transition: 'border 0.2s'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{opt.icon}</span>
                  <span style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>{opt.label}</span>
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '14px', lineHeight: '1.5' }}>
                  {opt.desc}
                </p>
                {/* Toggle */}
                <div
                  onClick={() => toggleAccessibility(opt.key)}
                  style={{
                    width: '44px', height: '24px', borderRadius: '999px',
                    background: accessibility[opt.key] ? '#6366f1' : '#cbd5e1',
                    cursor: 'pointer', position: 'relative', transition: 'background 0.2s'
                  }}
                >
                  <div style={{
                    position: 'absolute', top: '3px',
                    left: accessibility[opt.key] ? '23px' : '3px',
                    width: '18px', height: '18px', borderRadius: '50%',
                    background: 'white', transition: 'left 0.2s',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}

function Card({ children }) {
  return (
    <div style={{
      background: 'white',
      padding: '28px',
      borderRadius: '22px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    }}>
      {children}
    </div>
  );
}

const styles = {
  cardTitle: {
    marginBottom: '18px',
    color: '#1e293b',
    fontSize: '18px',
    fontWeight: '700',
  },
  progressBg: {
    width: '100%',
    height: '8px',
    background: '#e2e8f0',
    borderRadius: '999px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: '#6366f1',
    borderRadius: '999px',
  },
  learnButton: {
    padding: '12px 20px',
    border: 'none',
    borderRadius: '10px',
    background: '#6366f1',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '15px',
  },
};