import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Password dan Konfirmasi Password tidak cocok');
      return;
    }
    setLoading(true);
    try {
      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      if (response.message === 'Registrasi berhasil') {
        alert('Registrasi berhasil! Silakan login.');
        navigate('/');
      } else {
        alert(response.message || 'Registrasi gagal');
      }
    } catch (error) {
      alert('Terjadi kesalahan server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f5f7fb',
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'white',
        padding: '40px',
        borderRadius: '24px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '40px' }}>📘</span>
        </div>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '8px',
          color: '#6366f1',
          fontSize: '28px',
          fontWeight: '700',
        }}>
          EduPath AI
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#64748b',
          marginBottom: '32px',
          fontSize: '15px',
        }}>
          Buat Akun Baru
        </p>

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '16px' }}>
            <label style={styles.label}>Nama Lengkap</label>
            <input
              type="text"
              name="name"
              placeholder="Masukkan nama lengkap"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Masukkan email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Masukkan password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={styles.label}>Konfirmasi Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Ulangi password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Mendaftar...' : 'Daftar'}
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
          Sudah punya akun?{' '}
          <Link to="/" style={{ color: '#6366f1', fontWeight: '600', textDecoration: 'none' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    fontSize: '14px',
    color: '#374151',
  },
  input: {
    width: '100%',
    padding: '13px 16px',
    borderRadius: '12px',
    border: '1.5px solid #e2e8f0',
    outline: 'none',
    fontSize: '15px',
    color: '#1e293b',
    background: '#f8fafc',
    boxSizing: 'border-box',
    transition: 'border 0.2s',
  },
  button: {
    width: '100%',
    padding: '14px',
    background: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'opacity 0.2s',
  },
};