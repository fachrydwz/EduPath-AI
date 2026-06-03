import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

export default function Pengaturan() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setForm({
          name: res.data.data.name,
          email: res.data.data.email,
          password: '',
        });
      })
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await axios.put(
      'http://localhost:5000/api/user/profile',
      form,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const user = JSON.parse(localStorage.getItem('user'));

    localStorage.setItem(
      'user',
      JSON.stringify({
        ...user,
        name: form.name,
        email: form.email,
      })
    );

    alert('✅ Pengaturan berhasil disimpan!');
  };

  return (
    <div style={{ display: 'flex', background: '#f5f7fb', minHeight: '100vh' }}>
      <Sidebar />

      <div style={{ marginLeft: '260px', flex: 1, padding: '32px' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: '700', color: '#1e293b' }}>
            ⚙️ Pengaturan Akun
          </h1>
          <p style={{ color: '#64748b' }}>
            Kelola data profil dan keamanan akun kamu
          </p>
        </div>

        {/* CARD */}
        <div style={{
          maxWidth: '520px',
          background: 'white',
          padding: '28px',
          borderRadius: '22px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        }}>

          {/* NAME */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '13px', color: '#64748b' }}>Nama</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                outline: 'none',
                marginTop: '6px',
              }}
            />
          </div>

          {/* EMAIL */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '13px', color: '#64748b' }}>Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                outline: 'none',
                marginTop: '6px',
              }}
            />
          </div>

          {/* PASSWORD */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', color: '#64748b' }}>
              Password Baru
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Kosongkan jika tidak ganti"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                outline: 'none',
                marginTop: '6px',
              }}
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSave}
            style={{
              width: '100%',
              padding: '12px',
              background: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: '0.2s',
            }}
            onMouseOver={(e) => (e.target.style.background = '#4f46e5')}
            onMouseOut={(e) => (e.target.style.background = '#6366f1')}
          >
            💾 Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}