# Dokumentasi Web Service: Profil Perusahaan dan Marketplace Material Kontraktor

## Deskripsi Proyek
Proyek ini adalah platform digital terintegrasi yang menggabungkan fungsi profil perusahaan PT Agung Beton Kendari dengan sistem perdagangan elektronik (E-Commerce) khusus untuk bahan bangunan dan kebutuhan kontraktor. 

Aplikasi ini dirancang menggunakan arsitektur modern berbasis MERN Stack (MongoDB, Express, React, Node.js) untuk memberikan pengalaman pengguna yang responsif di sisi klien serta layanan data yang aman di sisi server. Sistem ini mendukung pengadaan material secara daring, manajemen anggaran proyek, hingga pembayaran otomatis.

---

## Yang Digunakan

### Frontend (Client Side)
- **Library:** React.js
- **State Management:** React Context API / Redux
- **Routing:** React Router DOM
- **HTTP Client:** Axios (untuk integrasi ke API)

### Backend (Server Side)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB dengan Mongoose ODM
- **Autentikasi:** JSON Web Token (JWT) & Bcrypt
- **Payment Gateway:** Midtrans Node.js SDK

---

## Fitur Utama

1. **Company Profile & Portfolio:** Halaman informasi resmi perusahaan yang dikelola secara dinamis dari backend.
2. **E-Commerce Material:** Katalog produk bahan bangunan dengan fitur pencarian, filter kategori, dan detail spesifikasi material.
3. **Manajemen Proyek & RAB:** Dashboard untuk kontraktor dalam mengelola data proyek dan penyusunan Rencana Anggaran Biaya (RAB).
4. **Sistem Transaksi:** Keranjang belanja, kalkulasi biaya pengiriman melalui Geocoding API, dan proses checkout.
5. **Pembayaran Digital:** Pembayaran otomatis melalui Midtrans dengan status transaksi real-time (Virtual Account, E-Wallet, dll).
6. **Keamanan API:** Implementasi Rate Limiting dan validasi data (Joi) untuk melindungi integritas sistem.

---

## Struktur Direktori

```text
.
├── frontend/          # Aplikasi Client (React.js)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/  # Koneksi API
│
├── backend/           # Aplikasi Server (Node.js & Express)
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middleware/
│   ├── app.js
│   └── index.js
