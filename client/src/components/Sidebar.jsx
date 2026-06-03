import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: '🏠', text: 'Dashboard', path: '/dashboard' },
    { icon: '📚', text: 'Modul', path: '/modul' },
    { icon: '❓', text: 'Kuis', path: '/kuis' },
    { icon: '✨', text: 'Rekomendasi', path: '/rekomendasi' },
    { icon: '📖', text: 'Riwayat', path: '/riwayat' },
    { icon: '🏆', text: 'Pencapaian', path: '/pencapaian' },
    { icon: '📓', text: 'Catatan', path: '/catatan' },
    { icon: '⚙️', text: 'Pengaturan', path: '/pengaturan' },
  ];

  return (
    <div style={{
      width: '260px',
      height: '100vh',
      background: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      padding: '20px',
      position: 'fixed',
      left: 0,
      top: 0
    }}>
      <h3
        onClick={() => navigate('/dashboard')}
        style={{ cursor: 'pointer', marginBottom: '20px' }}
      >
        📘 EduPath AI
      </h3>

      {menuItems.map((item) => {
        const active = location.pathname === item.path;

        return (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              padding: '10px',
              marginBottom: '6px',
              borderRadius: '8px',
              cursor: 'pointer',
              background: active ? '#6366f1' : 'transparent',
              color: active ? 'white' : '#333'
            }}
          >
            {item.icon} {item.text}
          </div>
        );
      })}
    </div>
  );
}