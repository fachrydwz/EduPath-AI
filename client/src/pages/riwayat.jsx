import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const topicEmoji = {
  IT: '💻', Math: '➗', Science: '🔬', English: '📖',
  Arabic: '🌙', French: '🗼', Spanish: '💃', Quran: '📿',
  Biology: '🧬', Chemistry: '⚗️', Geology: '🪨', History: '🏛️',
};

export default function Riwayat() {
  const navigate = useNavigate();
  const [riwayat, setRiwayat] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterTopik, setFilterTopik] = useState('Semua');
  const [filterGrade, setFilterGrade] = useState('Semua');
  const [hapusId, setHapusId] = useState(null);

  const fetchRiwayat = () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    fetch('http://localhost:5000/api/riwayat', {
      headers: { 
        Authorization: `Bearer ${token}` 
      },
    })
      .then((r) => {
        // Jika backend mengembalikan 401 Unauthorized
        if (r.status === 401) {
          console.error("Sesi telah berakhir atau token tidak valid.");
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/');
          return null;
        }
        
        // Jika ada error internal server atau status code bukan 2xx
        if (!r.ok) {
          throw new Error("Gagal mengambil data dari server");
        }

        return r.json();
      })
      .then((res) => {
        // Pastikan res ada (tidak null karena redirect di atas)
        if (res) {
          if (res.success) {
            setRiwayat(res.data || []);
            setStats(res.stats || null);
          } else {
            console.warn("API mengembalikan success: false", res.message);
            navigate('/');
          }
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    console.log('user:', user);
    console.log('token:', token);
    
    if (!user || !token) { 
      navigate('/'); 
      return; 
    }
    
    fetchRiwayat();
  }, [navigate]);

  const handleHapus = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/riwayat/${id}`, {
        method: 'DELETE',
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
        return;
      }

      if (response.ok) {
        setRiwayat((prev) => prev.filter((r) => r.id !== id));
        setHapusId(null);
        fetchRiwayat();
      } else {
        alert('Gagal menghapus riwayat');
      }
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus riwayat');
    }
  };

  const topikList = ['Semua', ...new Set(riwayat.map((r) => r.topic))];

  const filtered = riwayat.filter((r) => {
    const matchTopik = filterTopik === 'Semua' || r.topic === filterTopik;
    const matchGrade = filterGrade === 'Semua' || r.grade === filterGrade;
    return matchTopik && matchGrade;
  });

  const formatTanggal = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const gradeInfo = {
    H: { label: 'Tinggi', color: '#10b981', bg: '#dcfce7' },
    M: { label: 'Sedang', color: '#f59e0b', bg: '#fef9c3' },
    L: { label: 'Rendah', color: '#ef4444', bg: '#fee2e2' },
  };

  return (
    <div style={{ display: 'flex', background: '#f5f7fb', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: '260px', flex: 1, padding: '32px', width: 'calc(100% - 260px)' }}>

        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
            📖 Riwayat Belajar
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>
            Semua hasil kuis yang pernah kamu kerjakan
          </p>
        </div>

        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
            {[
              { label: 'Total Kuis', value: stats.totalKuis, icon: '📝', color: '#6366f1' },
              { label: 'Rata-rata Skor', value: `${stats.rataRata}`, icon: '📊', color: '#10b981' },
              { label: 'Topik Dipelajari', value: stats.topikUnik, icon: '📚', color: '#f59e0b' },
              { label: 'Skor Tertinggi', value: stats.skorTertinggi, icon: '🏆', color: '#ec4899' },
            ].map((s) => (
              <div key={s.label} style={{ background: 'white', borderRadius: '18px', padding: '20px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{s.icon}</div>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>{s.label}</div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>Filter:</span>
          <select
            value={filterTopik}
            onChange={(e) => setFilterTopik(e.target.value)}
            style={{ padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px', background: 'white', color: '#374151', cursor: 'pointer', outline: 'none' }}
          >
            {topikList.map((t) => (
              <option key={t} value={t}>{t === 'Semua' ? '📚 Semua Topik' : `${topicEmoji[t] || '📖'} ${t}`}</option>
            ))}
          </select>
          {['Semua', 'H', 'M', 'L'].map((g) => (
            <button
              key={g}
              onClick={() => setFilterGrade(g)}
              style={{
                padding: '10px 18px', borderRadius: '10px', border: 'none',
                cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s',
                background: filterGrade === g ? (g === 'H' ? '#10b981' : g === 'M' ? '#f59e0b' : g === 'L' ? '#ef4444' : '#6366f1') : 'white',
                color: filterGrade === g ? 'white' : '#64748b',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              {g === 'Semua' ? 'Semua Grade' : g === 'H' ? '🟢 Tinggi' : g === 'M' ? '🟡 Sedang' : '🔴 Rendah'}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '14px', color: '#94a3b8' }}>{filtered.length} hasil</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b', fontSize: '18px' }}>⏳ Memuat riwayat...</div>
        ) : filtered.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '20px', padding: '60px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>📭</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>Belum ada riwayat kuis</div>
            <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px' }}>Kerjakan kuis untuk mulai melihat riwayat belajarmu!</div>
            <button
              onClick={() => navigate('/kuis')}
              style={{ padding: '12px 28px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}
            >
              📝 Mulai Kuis Sekarang
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map((r) => {
              const gi = gradeInfo[r.grade] || gradeInfo['M'];
              const emoji = topicEmoji[r.topic] || '📖';
              return (
                <div key={r.id} style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                    {emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '700', fontSize: '16px', color: '#1e293b' }}>Kuis {r.topic}</span>
                      <span style={{ fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '999px', background: gi.bg, color: gi.color }}>Grade {gi.label}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#94a3b8' }}>{formatTanggal(r.created_at)}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '2px' }}>Benar</div>
                      <div style={{ fontWeight: '700', color: '#10b981', fontSize: '18px' }}>{r.benar}/{r.total}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '2px' }}>Skor</div>
                      <div style={{ fontWeight: '800', fontSize: '24px', color: r.skor >= 80 ? '#10b981' : r.skor >= 60 ? '#f59e0b' : '#ef4444' }}>{r.skor}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button onClick={() => navigate(`/kuis/${r.topic}`)} style={{ padding: '9px 16px', borderRadius: '10px', border: 'none', background: '#6366f1', color: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>🔄 Ulangi</button>
                    <button onClick={() => setHapusId(r.id)} style={{ padding: '9px 14px', borderRadius: '10px', border: '1.5px solid #fecaca', background: '#fff5f5', color: '#ef4444', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>🗑️</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {hapusId && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
            <div style={{ background: 'white', borderRadius: '20px', padding: '36px', maxWidth: '380px', width: '90%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗑️</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>Hapus Riwayat?</h3>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '28px' }}>Riwayat kuis ini akan dihapus secara permanen dan tidak dapat dikembalikan.</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button onClick={() => setHapusId(null)} style={{ padding: '12px 24px', borderRadius: '12px', border: '2px solid #e2e8f0', background: 'white', color: '#374151', cursor: 'pointer', fontWeight: '600' }}>Batal</button>
                <button onClick={() => handleHapus(hapusId)} style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: '600' }}>Ya, Hapus</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}