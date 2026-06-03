import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

export default function Pencapaian() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get(
        'http://localhost:5000/api/pencapaian',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setData(res.data.data);
      })
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <div style={{ padding: 40 }}>
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        background: '#f5f7fb',
        minHeight: '100vh',
      }}
    >
      <Sidebar />

      <div
        style={{
          marginLeft: '260px',
          flex: 1,
          padding: '32px',
        }}
      >
        <h1
          style={{
            color: '#1e293b',
            marginBottom: '25px',
          }}
        >
          🏆 Pencapaian Belajar
        </h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(4,1fr)',
            gap: '20px',
            marginBottom: '30px',
          }}
        >
          <StatCard
            title="Total Kuis"
            value={data.totalQuiz}
            icon="📝"
          />

          <StatCard
            title="Rata-rata Nilai"
            value={data.avgScore}
            icon="📈"
          />

          <StatCard
            title="Topik Dipelajari"
            value={data.uniqueTopics}
            icon="📚"
          />

          <StatCard
            title="Nilai Tertinggi"
            value={data.highestScore}
            icon="⭐"
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill,minmax(250px,1fr))',
            gap: '20px',
          }}
        >
          {data.achievements.map(
            (item) => (
              <div
                key={item.title}
                style={{
                  background: item.unlocked
                    ? '#6366f1'
                    : '#fff',
                  color: item.unlocked
                    ? '#fff'
                    : '#1e293b',
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow:
                    '0 4px 15px rgba(0,0,0,0.05)',
                }}
              >
                <div
                  style={{
                    fontSize: '40px',
                    marginBottom: '12px',
                  }}
                >
                  {item.icon}
                </div>

                <h3>{item.title}</h3>

                <p
                  style={{
                    opacity: 0.8,
                  }}
                >
                  {item.desc}
                </p>

                <div
                  style={{
                    marginTop: '12px',
                    fontWeight: '700',
                  }}
                >
                  {item.unlocked
                    ? '✅ Terbuka'
                    : '🔒 Terkunci'}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '24px',
        boxShadow:
          '0 4px 15px rgba(0,0,0,0.05)',
      }}
    >
      <div
        style={{
          fontSize: '30px',
          marginBottom: '10px',
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: '#64748b',
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#1e293b',
        }}
      >
        {value}
      </div>
    </div>
  );
}