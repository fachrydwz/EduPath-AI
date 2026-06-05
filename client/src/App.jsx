import { Routes, Route } from 'react-router-dom';

import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import Modul from './pages/modul';
import ModulDetail from './pages/ModulDetail';
import Kuis from './pages/kuis';
import Rekomendasi from './pages/rekomendasi';
import Riwayat from './pages/riwayat';
import Pencapaian from './pages/Pencapaian';
import Catatan from './pages/Catatan';
import Pengaturan from './pages/Pengaturan';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/modul" element={<Modul />} />
      <Route path="/modul/:topic" element={<ModulDetail />} />

      <Route path="/kuis" element={<Kuis />} />
      <Route path="/kuis/:topic" element={<Kuis />} />

      <Route path="/rekomendasi" element={<Rekomendasi />} />
      <Route path="/riwayat" element={<Riwayat />} />
      <Route path="/pencapaian" element={<Pencapaian />} />
      <Route path="/catatan" element={<Catatan />} />
      <Route path="/pengaturan" element={<Pengaturan />} />
    </Routes>
  );
}