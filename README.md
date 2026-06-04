# EDUPATH AI: PLATFORM BELAJAR PERSONAL BERBASIS ADAPTIVE RECOMMENDATION

## Deskripsi
EduPath AI merupakan platform pembelajaran berbasis web yang adaptif dan inklusif. Aplikasi ini dirancang untuk membantu pengguna memperoleh materi yang sesuai dengan kemampuan dan kebutuhan belajar mereka melalui sistem rekomendasi cerdas, kuis interaktif, dashboard progres, serta berbagai fitur aksesibilitas yang mendukung pengalaman belajar yang lebih personal dan efektif.

## Teknologi yang Digunakan
1.	Frontend
   
  	 •	React

  	 •	Vite

  	 •	React Router DOM

  	 •	Axios
  	
2.	Backend

  	•	Node.js

  	•	Express.js

  	•	JWT Authentication

  	•	BcryptJS

  	•	Database

  	•	MySQL

## Instalasi
1.	Clone Repository
a.	git clone https://github.com/fachrydwz/EduPath-AI.git
2.	Instalasi Frontend
a.	cd client
b.	npm install
c.	npm run dev
d.	Frontend akan berjalan pada: http://localhost:5173
3.	Instalasi Backend
a.	cd server
b.	npm instal
c.	npm run dev
d.	Backend akan berjalan pada: http://localhost:5000

## Konfigurasi Database
1.	Buat database MySQL
2.	CREATE DATABASE edupath_ai
3.	Setelah database berhasil dibuat, import file database yang telah disediakan ke dalam database tersebut.

## Environment Variables
Buat file .env pada folder server dan tambahkan konfigurasi berikut:

•	PORT=5000

•	DB_HOST=localhost

•	DB_USER=root

•	DB_PASSWORD=

•	DB_NAME=edupath_ai

•	JWT_SECRET=your_secret_key

## Fitur Utama
1.	Login dan Register Pengguna
2.	Dashboard Progres Belajar
3.	Modul Pembelajaran Interaktif
4.	Kuis dan Evaluasi Pembelajaran
5.	Sistem Rekomendasi AI
6.	Riwayat Aktivitas Belajar
7.	Manajemen Akun Pengguna
8.	Fitur Aksesibilitas untuk Pembelajaran Inklusif

## Cara Menjalankan Aplikasi
1.	Jalankan layanan MySQL.
2.	Buat dan import database edupath_ai.
3.	Jalankan backend:
npm run dev
4.	Jalankan frontend:
npm run dev
5.	Buka browser dan akses: http://localhost:5173

## Struktur Proyek

EduPath-AI/

│

├── client/          # Frontend React + Vite

├── server/          # Backend Node.js + Express

├── sql/             # Database scripts

└── README.md

## Tim Pengembang
Proyek ini dikembangkan sebagai bagian dari Project Based Learning (PBL) dengan tema:
Accessible & Adaptive Learning.

