import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

export default function ModulDetail() {
  const { topic } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    axios
      .get(`https://carefree-balance-production-20cb.up.railway.app/api/modul-detail/${topic}`)
      .then((res) => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [topic]);

  if (loading) {
    return (
      <div style={{ padding: 40, fontSize: 18 }}>
        ⏳ Loading modul...
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: 40 }}>
        Data tidak ditemukan
      </div>
    );
  }

  const current = data.materi[stepIndex];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f7fb' }}>
      <Sidebar />

      <div style={{ marginLeft: 260, flex: 1, padding: 32 }}>

        {/* HEADER CARD */}
        <div style={{
          background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
          padding: 28,
          borderRadius: 22,
          color: 'white',
          marginBottom: 24
        }}>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>
            📘 {data.topic}
          </h1>

          <p style={{ opacity: 0.9 }}>
            Learning Path Interaktif • {data.totalStep} Step
          </p>

          {/* progress bar */}
          <div style={{
            marginTop: 16,
            height: 8,
            background: 'rgba(255,255,255,0.3)',
            borderRadius: 999
          }}>
            <div style={{
              height: '100%',
              width: `${((stepIndex + 1) / data.totalStep) * 100}%`,
              background: 'white',
              borderRadius: 999
            }} />
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{
          background: 'white',
          padding: 28,
          borderRadius: 22,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>

          <div style={{ marginBottom: 10, color: '#6366f1', fontWeight: 600 }}>
            Step {stepIndex + 1}
          </div>

          <h2 style={{ fontSize: 22, marginBottom: 10 }}>
            {current.title}
          </h2>

          <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.7 }}>
            {current.content}
          </p>

          {/* example box */}
          <div style={{
            marginTop: 18,
            padding: 14,
            borderRadius: 12,
            background: '#f1f5f9'
          }}>
            💡 <b>Contoh:</b> {current.example}
          </div>
        </div>

        {/* STEP LIST (BIAR KELIHATAN LMS) */}
        <div style={{
          display: 'flex',
          gap: 10,
          marginTop: 20,
          flexWrap: 'wrap'
        }}>
          {data.materi.map((m, i) => (
            <div
              key={i}
              onClick={() => setStepIndex(i)}
              style={{
                padding: '8px 12px',
                borderRadius: 999,
                cursor: 'pointer',
                fontSize: 13,
                background: i === stepIndex ? '#6366f1' : 'white',
                color: i === stepIndex ? 'white' : '#64748b',
                border: '1px solid #e2e8f0'
              }}
            >
              Step {m.step}
            </div>
          ))}
        </div>

        {/* NAVIGATION */}
        <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
          <button
            disabled={stepIndex === 0}
            onClick={() => setStepIndex(stepIndex - 1)}
            style={{
              padding: '10px 16px',
              borderRadius: 10,
              border: 'none',
              background: stepIndex === 0 ? '#cbd5e1' : '#6366f1',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            ⬅ Prev
          </button>

          <button
            disabled={stepIndex === data.totalStep - 1}
            onClick={() => setStepIndex(stepIndex + 1)}
            style={{
              padding: '10px 16px',
              borderRadius: 10,
              border: 'none',
              background: stepIndex === data.totalStep - 1 ? '#cbd5e1' : '#6366f1',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Next ➡
          </button>

          <button
            onClick={() => navigate('/modul')}
            style={{
              marginLeft: 'auto',
              padding: '10px 16px',
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            ⬅ Back
          </button>
        </div>

      </div>
    </div>
  );
}