# Quick Start Guide - RajaOngkir Shipping Integration

## 🚀 Setup

### 1. Dapatkan API Key RajaOngkir

1. Daftar di [RajaOngkir.com](https://rajaongkir.com)
2. Login ke dashboard
3. Copy API Key dari menu **API Key**
4. Pilih plan **Starter** (gratis)

### 2. Konfigurasi Backend

Edit file `backend/.env`:
```env
RAJAONGKIR_API_KEY=your_actual_api_key_here
```

### 3. Install Dependencies (jika belum)

```bash
cd backend
npm install
```

### 4. Start Backend Server

```bash
cd backend
npm start
```

Server akan berjalan di `http://localhost:3000`

### 5. Start Frontend

```bash
cd frontend
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

---

## 📦 Cara Menggunakan Fitur Shipping

### Untuk Customer (Buyer)

#### 1. Tambahkan Produk ke Keranjang
- Buka halaman katalog produk
- Klik "Tambah ke Keranjang" untuk material yang ingin dibeli

#### 2. Buka Halaman Checkout
- Klik icon keranjang atau menu Checkout
- Pilih tab **"Keranjang"** untuk pembelian material

#### 3. Pilih Alamat Pengiriman

**Opsi A: Lokasi Saat Ini**
1. Pilih radio button "Lokasi Saat Ini"
2. Izinkan browser mengakses lokasi Anda
3. Alamat akan otomatis terdeteksi

**Opsi B: Alamat Lain (Manual)**
1. Pilih radio button "Alamat Lain"
2. Ketik alamat di search box (min. 3 karakter)
3. Pilih dari dropdown suggestions
4. Atau isi manual: Jalan, Kota, Provinsi, Kode Pos

#### 4. Pilih Metode Pengiriman
- Setelah alamat dipilih, sistem akan otomatis menghitung biaya pengiriman
- Pilih salah satu opsi kurir (JNE, POS, atau TIKI)
- Lihat detail: jenis layanan, biaya, dan estimasi waktu

#### 5. Review Total Pembayaran
- **Subtotal**: Total harga produk
- **Biaya Pengiriman**: Biaya kurir yang dipilih
- **Total**: Subtotal + Biaya Pengiriman

#### 6. Bayar
- Klik tombol "Bayar Sekarang"
- Selesaikan pembayaran melalui Midtrans

---

## 🧪 Testing API (untuk Developer)

### Test 1: Get All Cities
```bash
curl http://localhost:3000/api/shipping/cities
```

### Test 2: Calculate Shipping Cost
Pertama, login untuk mendapatkan token:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'
```

Kemudian, hitung biaya shipping:
```bash
curl -X POST http://localhost:3000/api/shipping/cost \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "cityName": "Jakarta",
    "weight": 5000
  }'
```

### Test 3: Get Cheapest Option
```bash
curl -X POST http://localhost:3000/api/shipping/cheapest \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "cityName": "Surabaya",
    "weight": 3000
  }'
```

---

## 🔍 Troubleshooting

### Problem: "City not found"
**Solution**: 
- Pastikan nama kota sesuai dengan database RajaOngkir
- Contoh: gunakan "Jakarta" bukan "Jakarta Pusat"
- Cek list kota: `GET /api/shipping/cities`

### Problem: Biaya pengiriman tidak muncul
**Solution**:
1. Pastikan alamat sudah terisi lengkap (minimal **Kota**)
2. Pastikan ada item di keranjang
3. Check console browser untuk error messages
4. Periksa backend logs

### Problem: "API key invalid"
**Solution**:
1. Pastikan API key sudah diset di `.env`
2. Restart backend server setelah update `.env`
3. Verifikasi API key di dashboard RajaOngkir

### Problem: Shipping options kosong
**Solution**:
- RajaOngkir API mungkin down
- Check limit API (Starter: 1000 request/hari)
- Verifikasi koneksi internet

---

## 📊 Weight Calculation

### Default
Saat ini: **1 item = 1 kg (1000 gram)**

### Untuk Produk Berat Berbeda
Tambahkan field `weight` saat create/update product:
```json
{
  "productName": "Semen",
  "price": 50000,
  "weight": 50000,  // 50 kg dalam gram
  "stock": 100,
  "unit": "sak"
}
```

---

## 💡 Tips

1. **Alamat Akurat**: Semakin akurat alamat, semakin akurat biaya pengiriman
2. **Pilih Kurir**: Bandingkan harga dan estimasi waktu antar kurir
3. **Berat Total**: Berat total dihitung otomatis dari semua item
4. **Refresh Options**: Ubah alamat untuk melihat opsi pengiriman baru

---

## 📞 Support

- **Backend Issues**: Check `backend/RAJAONGKIR_INTEGRATION.md`
- **API Documentation**: https://rajaongkir.com/dokumentasi
- **RajaOngkir Support**: support@rajaongkir.com

---

## 🎯 Fitur Mendatang

- [ ] Tracking pengiriman
- [ ] Multi-warehouse (origin berbeda)
- [ ] Custom weight per produk
- [ ] Cache city data
- [ ] Shipping insurance
- [ ] International shipping (upgrade plan)
