import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Rekomendasi() {
  const navigate = useNavigate();
  const [rekomendasi, setRekomendasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [levelUser, setLevelUser] = useState(null);
  const [skor, setSkor] = useState(null);
  const [topik, setTopik] = useState(null);

  // Ambil data dari localStorage (hasil kuis terakhir)
  const lastQuiz = JSON.parse(localStorage.getItem('lastQuiz') || 'null');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) { navigate('/'); return; }

    const skorParam = lastQuiz?.skor ?? 70;
    const topikParam = lastQuiz?.topic ?? '';

    setSkor(skorParam);
    setTopik(topikParam);

    fetch(`http://localhost:5000/api/recommendation?skor=${skorParam}&topic=${topikParam}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setRekomendasi(res.data);
          setLevelUser(res.levelUser);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [navigate]);

  const levelInfo = {
    H: { label: 'Tinggi', color: '#10b981', bg: '#dcfce7', emoji: '🏆' },
    M: { label: 'Sedang', color: '#f59e0b', bg: '#fef9c3', emoji: '📈' },
    L: { label: 'Perlu Peningkatan', color: '#ef4444', bg: '#fee2e2', emoji: '💪' },
  };

  const info = levelInfo[levelUser] || levelInfo['M'];

  return (
    <div style={{ display: 'flex', background: '#f5f7fb', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: '260px', flex: 1, padding: '32px', width: 'calc(100% - 260px)' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
            ✨ Rekomendasi AI
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>
            Rekomendasi topik belajar yang dipersonalisasi khusus untukmu
          </p>
        </div>

        {/* Level User Card */}
        {levelUser && (
          <div style={{
            background: info.bg, borderRadius: '20px', padding: '24px 28px',
            marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '20px',
            border: `2px solid ${info.color}30`,
          }}>
            <div style={{ fontSize: '48px' }}>{info.emoji}</div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '18px', color: info.color, marginBottom: '4px' }}>
                Level Belajarmu: {info.label}
              </div>
              <div style={{ color: '#64748b', fontSize: '14px' }}>
                {skor !== null && topik
                  ? `Berdasarkan hasil kuis ${topik} kamu dengan skor ${skor}/100`
                  : 'Berdasarkan analisis pola belajar menggunakan data AI'
                }
              </div>
            </div>
            {skor !== null && (
              <div style={{
                marginLeft: 'auto', textAlign: 'center',
                background: 'white', borderRadius: '16px', padding: '16px 24px',
              }}>
                <div style={{ fontSize: '32px', fontWeight: '800', color: info.color }}>{skor}</div>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>Skor Terakhir</div>
              </div>
            )}
          </div>
        )}

        {/* Tidak ada data kuis */}
        {!lastQuiz && (
          <div style={{
            background: '#fefce8', border: '2px solid #fde68a', borderRadius: '14px',
            padding: '16px 20px', marginBottom: '24px', display: 'flex',
            alignItems: 'center', gap: '12px',
          }}>
            <span style={{ fontSize: '20px' }}>💡</span>
            <div>
              <span style={{ fontWeight: '600', color: '#92400e' }}>Tips: </span>
              <span style={{ color: '#78350f', fontSize: '14px' }}>
                Kerjakan kuis terlebih dahulu agar rekomendasi lebih akurat sesuai kemampuanmu!
              </span>
              <span
                onClick={() => navigate('/kuis')}
                style={{ color: '#6366f1', fontWeight: '600', cursor: 'pointer', marginLeft: '8px', fontSize: '14px' }}
              >
                Mulai Kuis →
              </span>
            </div>
          </div>
        )}

        {/* Grid Rekomendasi */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b', fontSize: '18px' }}>
            🤖 AI sedang menganalisis data belajarmu...
          </div>
        ) : (
          <>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>
              🎯 Topik yang Direkomendasikan
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
            }}>
              {rekomendasi.map((r, i) => (
                <RekomenCard key={r.topic} item={r} rank={i + 1} onStart={() => navigate(`/modul/${r.topic}`)} onKuis={() => navigate(`/kuis/${r.topic}`)} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function RekomenCard({ item, rank, onStart, onKuis }) {
  const [hovered, setHovered] = useState(false);

  const rankColor = rank === 1 ? '#f59e0b' : rank === 2 ? '#94a3b8' : rank === 3 ? '#cd7c2f' : '#6366f1';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'white', borderRadius: '20px', padding: '24px',
        boxShadow: hovered ? '0 8px 30px rgba(99,102,241,0.15)' : '0 4px 20px rgba(0,0,0,0.05)',
        transform: hovered ? 'translateY(-4px)' : 'none',
        transition: 'all 0.25s',
        border: `2px solid ${hovered ? '#6366f1' : 'transparent'}`,
        position: 'relative',
      }}
    >
      {/* Rank badge */}
      <div style={{
        position: 'absolute', top: '16px', right: '16px',
        background: rankColor + '20', color: rankColor,
        fontWeight: '700', fontSize: '13px', padding: '4px 10px',
        borderRadius: '999px',
      }}>
        #{rank}
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '14px',
          background: '#eef2ff', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: '26px',
        }}>
          {item.emoji}
        </div>
        <div>
          <div style={{ fontWeight: '700', fontSize: '18px', color: '#1e293b' }}>{item.topic}</div>
          <span style={{
            fontSize: '12px', fontWeight: '600', padding: '3px 10px',
            borderRadius: '999px', background: item.diffColor + '20', color: item.diffColor,
          }}>
            {item.difficulty}
          </span>
        </div>
      </div>

      {/* Alasan rekomendasi */}
      <div style={{
        background: '#f0fdf4', borderRadius: '10px', padding: '12px',
        marginBottom: '14px', fontSize: '13px', color: '#166534', lineHeight: '1.5',
      }}>
        🤖 {item.alasan}
      </div>

      {/* Match score */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>Kesesuaian</span>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#6366f1' }}>{item.skorRekomen}%</span>
        </div>
        <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${item.skorRekomen}%`,
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
            borderRadius: '999px', transition: 'width 0.5s',
          }} />
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', color: '#94a3b8' }}>👥 {item.totalSiswa} siswa</div>
        <div style={{ fontSize: '13px', color: '#94a3b8' }}>⭐ {item.highPct}% sukses</div>
      </div>

      {/* Tombol */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={onStart}
          style={{
            flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
            background: '#6366f1', color: 'white', cursor: 'pointer',
            fontWeight: '600', fontSize: '13px',
          }}
        >
          📚 Pelajari
        </button>
        <button
          onClick={onKuis}
          style={{
            flex: 1, padding: '10px', borderRadius: '10px',
            border: '2px solid #e2e8f0', background: 'white',
            color: '#374151', cursor: 'pointer', fontWeight: '600', fontSize: '13px',
          }}
        >
          📝 Kuis
        </button>
      </div>
    </div>
  );
}