import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Modul() {
  const navigate = useNavigate();
  const [moduls, setModuls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Semua');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) { navigate('/'); return; }

    fetch('http://localhost:5000/api/modul')
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setModuls(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [navigate]);

  const filtered = moduls.filter((m) => {
    const matchSearch = m.topic.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'Semua' || m.difficulty === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ display: 'flex', background: '#f5f7fb', minHeight: '100vh' }}>
      <Sidebar />

      <div style={{ marginLeft: '260px', flex: 1, padding: '32px', width: 'calc(100% - 260px)' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
            📚 Modul Pembelajaran
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>
            Pilih topik yang ingin kamu pelajari dan mulai belajar sekarang!
          </p>
        </div>

        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="🔍 Cari topik..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1, minWidth: '200px', padding: '12px 16px',
              borderRadius: '12px', border: '1.5px solid #e2e8f0',
              fontSize: '15px', background: 'white', outline: 'none',
            }}
          />
          {['Semua', 'Mudah', 'Sedang', 'Sulit'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '12px 20px', borderRadius: '12px', border: 'none',
                cursor: 'pointer', fontWeight: '600', fontSize: '14px',
                background: filter === f ? '#6366f1' : 'white',
                color: filter === f ? 'white' : '#64748b',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.2s',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid Modul */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b', fontSize: '18px' }}>
            ⏳ Memuat modul...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b', fontSize: '18px' }}>
            😕 Tidak ada modul ditemukan
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {filtered.map((m) => (
              <ModulCard key={m.id} modul={m} onStart={() => navigate(`/modul/${m.topic}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ModulCard({ modul, onStart }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'white',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: hovered ? '0 8px 30px rgba(99,102,241,0.15)' : '0 4px 20px rgba(0,0,0,0.05)',
        transform: hovered ? 'translateY(-4px)' : 'none',
        transition: 'all 0.25s',
        cursor: 'pointer',
        border: `2px solid ${hovered ? '#6366f1' : 'transparent'}`,
      }}
    >
      {/* Emoji & Topic */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '14px',
          background: '#eef2ff', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: '26px',
        }}>
          {modul.emoji}
        </div>
        <div>
          <div style={{ fontWeight: '700', fontSize: '18px', color: '#1e293b' }}>{modul.topic}</div>
          <span style={{
            fontSize: '12px', fontWeight: '600', padding: '3px 10px',
            borderRadius: '999px', background: modul.diffColor + '20', color: modul.diffColor,
          }}>
            {modul.difficulty}
          </span>
        </div>
      </div>

      {/* Desc */}
      <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', marginBottom: '16px' }}>
        {modul.desc}
      </p>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        {[
          { label: 'Tinggi', pct: modul.highPct, color: '#10b981' },
          { label: 'Sedang', pct: modul.mediumPct, color: '#f59e0b' },
          { label: 'Rendah', pct: modul.lowPct, color: '#ef4444' },
        ].map((s) => (
          <div key={s.label} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: s.color }}>{s.pct}%</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '999px', marginBottom: '16px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${modul.highPct}%`, background: '#6366f1', borderRadius: '999px' }} />
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', color: '#94a3b8' }}>👥 {modul.totalSiswa} siswa</span>
        <button
          onClick={onStart}
          style={{
            padding: '9px 18px', background: '#6366f1', color: 'white',
            border: 'none', borderRadius: '10px', cursor: 'pointer',
            fontWeight: '600', fontSize: '13px',
          }}
        >
          Mulai Belajar →
        </button>
      </div>
    </div>
  );
}