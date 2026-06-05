import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Kuis() {
  const navigate = useNavigate();
  const { topic } = useParams();

  const [topikList, setTopikList] = useState([]);
  const [topikDipilih, setTopikDipilih] = useState(topic || null);
  const [soal, setSoal] = useState([]);
  const [jawaban, setJawaban] = useState({});
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(topic ? 'kuis' : 'pilih');
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) { navigate('/'); return; }

    fetch('http://localhost:5000/api/modul')
      .then((r) => r.json())
      .then((res) => { if (res.success) setTopikList(res.data); })
      .catch(console.error);
  }, [navigate]);

  useEffect(() => {
    if (topikDipilih && step === 'kuis') {
      setLoading(true);
      fetch(`http://localhost:5000/api/quiz/${topikDipilih}`)
        .then((r) => r.json())
        .then((res) => {
          if (res.success) { setSoal(res.data); setJawaban({}); setCurrent(0); }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [topikDipilih, step]);

  const handlePilihTopik = (t) => {
    setTopikDipilih(t);
    setHasil(null);
    setStep('kuis');
  };

  const handleJawab = (jawab) => {
    setJawaban((prev) => ({ ...prev, [soal[current].id]: jawab }));
  };

  const handleNext = () => {
    if (current < soal.length - 1) setCurrent((c) => c + 1);
  };

  const handlePrev = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  const handleSubmit = async () => {
    const answers = Object.entries(jawaban).map(([id, jawaban]) => ({
      id: parseInt(id), jawaban,
    }));
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ topic: topikDipilih, answers }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('lastQuiz', JSON.stringify({ topic: topikDipilih, skor: data.skor }));
        setHasil(data);
        setStep('hasil');
      }
    } catch (err) {
      alert('Gagal submit kuis');
    }
  };

  const terjawab = Object.keys(jawaban).length;
  const progress = soal.length > 0 ? Math.round((terjawab / soal.length) * 100) : 0;

  return (
    <div style={{ display: 'flex', background: '#f5f7fb', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: '260px', flex: 1, padding: '32px', width: 'calc(100% - 260px)' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
            📝 Kuis Interaktif
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>
            Uji pemahamanmu dengan kuis per topik!
          </p>
        </div>

        {/* STEP: Pilih Topik */}
        {step === 'pilih' && (
          <div>
            <p style={{ color: '#64748b', marginBottom: '20px', fontWeight: '500' }}>
              Pilih topik yang ingin kamu kerjakan:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {topikList.map((t) => (
                <div
                  key={t.id}
                  onClick={() => handlePilihTopik(t.topic)}
                  style={{
                    background: 'white', borderRadius: '16px', padding: '20px',
                    textAlign: 'center', cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    border: '2px solid transparent',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = '2px solid #6366f1';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = '2px solid transparent';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{ fontSize: '36px', marginBottom: '10px' }}>{t.emoji}</div>
                  <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '16px' }}>{t.topic}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>5 soal</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP: Kuis */}
        {step === 'kuis' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#64748b', fontSize: '18px' }}>
                ⏳ Memuat soal...
              </div>
            ) : soal.length > 0 ? (
              <div style={{ maxWidth: '700px', margin: '0 auto' }}>

                {/* Info topik + progress */}
                <div style={{
                  background: 'white', borderRadius: '16px', padding: '20px',
                  marginBottom: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ fontWeight: '700', color: '#6366f1', fontSize: '16px' }}>
                      📝 Kuis {topikDipilih}
                    </div>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>
                      {terjawab}/{soal.length} terjawab
                    </div>
                  </div>
                  <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${progress}%`,
                      background: '#6366f1', borderRadius: '999px', transition: 'width 0.3s',
                    }} />
                  </div>
                </div>

                {/* Navigasi soal */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  {soal.map((s, i) => (
                    <div
                      key={s.id}
                      onClick={() => setCurrent(i)}
                      style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', fontWeight: '600', fontSize: '14px',
                        background: jawaban[s.id] ? '#6366f1' : i === current ? '#e0e7ff' : 'white',
                        color: jawaban[s.id] ? 'white' : i === current ? '#6366f1' : '#94a3b8',
                        border: i === current ? '2px solid #6366f1' : '2px solid #e2e8f0',
                        transition: 'all 0.2s',
                      }}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>

                {/* Soal */}
                <div style={{
                  background: 'white', borderRadius: '20px', padding: '32px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '20px',
                }}>
                  <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '12px', fontWeight: '600' }}>
                    SOAL {current + 1} dari {soal.length}
                  </div>
                  <p style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '28px', lineHeight: '1.6' }}>
                    {soal[current].question}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {soal[current].options.map((opt, i) => {
                      const dipilih = jawaban[soal[current].id] === opt;
                      return (
                        <div
                          key={i}
                          onClick={() => handleJawab(opt)}
                          style={{
                            padding: '16px 20px', borderRadius: '12px', cursor: 'pointer',
                            border: `2px solid ${dipilih ? '#6366f1' : '#e2e8f0'}`,
                            background: dipilih ? '#eef2ff' : 'white',
                            color: dipilih ? '#4f46e5' : '#374151',
                            fontWeight: dipilih ? '600' : '400',
                            transition: 'all 0.2s',
                            display: 'flex', alignItems: 'center', gap: '12px',
                          }}
                          onMouseEnter={(e) => {
                            if (!dipilih) e.currentTarget.style.background = '#f8fafc';
                          }}
                          onMouseLeave={(e) => {
                            if (!dipilih) e.currentTarget.style.background = 'white';
                          }}
                        >
                          <div style={{
                            width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                            background: dipilih ? '#6366f1' : '#e2e8f0',
                            color: dipilih ? 'white' : '#94a3b8',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: '700', fontSize: '13px',
                          }}>
                            {['A', 'B', 'C', 'D'][i]}
                          </div>
                          {opt}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tombol navigasi */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    onClick={handlePrev}
                    disabled={current === 0}
                    style={{
                      padding: '12px 24px', borderRadius: '12px', border: 'none',
                      background: current === 0 ? '#e2e8f0' : 'white',
                      color: current === 0 ? '#94a3b8' : '#374151',
                      cursor: current === 0 ? 'not-allowed' : 'pointer',
                      fontWeight: '600', fontSize: '15px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    ← Sebelumnya
                  </button>

                  <button
                    onClick={() => setStep('pilih')}
                    style={{
                      padding: '12px 24px', borderRadius: '12px', border: 'none',
                      background: 'transparent', color: '#94a3b8',
                      cursor: 'pointer', fontWeight: '500', fontSize: '14px',
                    }}
                  >
                    Ganti Topik
                  </button>

                  {current < soal.length - 1 ? (
                    <button
                      onClick={handleNext}
                      style={{
                        padding: '12px 24px', borderRadius: '12px', border: 'none',
                        background: '#6366f1', color: 'white',
                        cursor: 'pointer', fontWeight: '600', fontSize: '15px',
                      }}
                    >
                      Selanjutnya →
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={terjawab < soal.length}
                      style={{
                        padding: '12px 24px', borderRadius: '12px', border: 'none',
                        background: terjawab < soal.length ? '#e2e8f0' : '#10b981',
                        color: terjawab < soal.length ? '#94a3b8' : 'white',
                        cursor: terjawab < soal.length ? 'not-allowed' : 'pointer',
                        fontWeight: '600', fontSize: '15px',
                      }}
                    >
                      {terjawab < soal.length ? `Jawab semua soal dulu (${terjawab}/${soal.length})` : '✅ Submit Kuis'}
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* STEP: Hasil */}
        {step === 'hasil' && hasil && (
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              background: 'white', borderRadius: '24px', padding: '48px 40px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>
                {hasil.skor >= 80 ? '🎉' : hasil.skor >= 60 ? '👍' : '💪'}
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                Kuis {topikDipilih} Selesai!
              </h2>
              <p style={{ color: '#64748b', marginBottom: '32px' }}>{hasil.pesan}</p>

              <div style={{
                width: '140px', height: '140px', borderRadius: '50%', margin: '0 auto 32px',
                background: hasil.skor >= 80 ? '#dcfce7' : hasil.skor >= 60 ? '#fef9c3' : '#fee2e2',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  fontSize: '42px', fontWeight: '800',
                  color: hasil.skor >= 80 ? '#16a34a' : hasil.skor >= 60 ? '#ca8a04' : '#dc2626',
                }}>
                  {hasil.skor}
                </div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>/ 100</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '36px' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>{hasil.benar}</div>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>Benar</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>{hasil.total - hasil.benar}</div>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>Salah</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#6366f1' }}>{hasil.grade}</div>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>Grade</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={() => { setStep('kuis'); setHasil(null); }}
                  style={{
                    padding: '13px 24px', borderRadius: '12px', border: 'none',
                    background: '#6366f1', color: 'white',
                    cursor: 'pointer', fontWeight: '600', fontSize: '15px',
                  }}
                >
                  🔄 Ulangi Kuis
                </button>
                <button
                  onClick={() => navigate('/riwayat')}
                  style={{
                    padding: '13px 24px', borderRadius: '12px',
                    border: '2px solid #e2e8f0', background: 'white',
                    color: '#374151', cursor: 'pointer', fontWeight: '600', fontSize: '15px',
                  }}
                >
                  📖 Lihat Riwayat
                </button>
                <button
                  onClick={() => setStep('pilih')}
                  style={{
                    padding: '13px 24px', borderRadius: '12px',
                    border: '2px solid #e2e8f0', background: 'white',
                    color: '#374151', cursor: 'pointer', fontWeight: '600', fontSize: '15px',
                  }}
                >
                  📚 Topik Lain
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}