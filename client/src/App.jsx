import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Modul from './pages/Modul';
import ModulDetail from './pages/ModulDetail';
import Kuis from './pages/Kuis';
import Rekomendasi from './pages/Rekomendasi';
import Riwayat from './pages/Riwayat';
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