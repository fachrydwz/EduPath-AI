import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { icon: '🏠', text: 'Dashboard', path: '/dashboard' },
  { icon: '📚', text: 'Modul Pembelajaran', path: '/modul' },
  { icon: '❓', text: 'Kuis Interaktif', path: '/kuis' },
  { icon: '✨', text: 'Rekomendasi AI', path: '/rekomendasi' },
  { icon: '📖', text: 'Riwayat Belajar', path: '/riwayat' },
  { icon: '🏆', text: 'Pencapaian', path: '/pencapaian' },
  { icon: '📓', text: 'Catatan', path: '/catatan' },
  { icon: '⚙️', text: 'Pengaturan', path: '/pengaturan' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{
      width: '260px',
      height: '100vh',
      background: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      padding: '24px 16px',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
    }}>
      {/* Logo */}
      <div
        onClick={() => navigate('/dashboard')}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          marginBottom: '36px', paddingLeft: '10px', cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: '24px' }}>📘</span>
        <span style={{ color: '#6366f1', fontWeight: '700', fontSize: '20px' }}>EduPath AI</span>
      </div>

      {/* Menu */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              text={item.text}
              active={isActive}
              onClick={() => navigate(item.path)}
            />
          );
        })}
      </div>

      {/* Footer user */}
      <div style={{
        borderTop: '1px solid #e2e8f0',
        paddingTop: '16px',
        paddingLeft: '10px',
      }}>
        <div style={{ fontSize: '13px', color: '#94a3b8' }}>Login sebagai</div>
        <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '15px', marginTop: '2px' }}>
          {JSON.parse(localStorage.getItem('user') || '{}')?.name || 'Pengguna'}
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, text, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '12px 18px',
        borderRadius: '12px',
        background: active ? '#e0e7ff' : 'transparent',
        color: active ? '#4f46e5' : '#475569',
        fontWeight: active ? '600' : '500',
        cursor: 'pointer',
        transition: 'background 0.2s, color 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '15px',
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = '#f8fafc';
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = 'transparent';
      }}
    >
      <span style={{ fontSize: '18px' }}>{icon}</span>
      {text}
    </div>
  );
}