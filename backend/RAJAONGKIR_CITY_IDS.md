# Daftar ID Kota RajaOngkir (Populer)

## 📍 Cara Mengubah Lokasi Origin

Edit file `backend/.env`:
```env
RAJAONGKIR_ORIGIN_CITY_ID=236  # ← Ubah sesuai kota Anda
```

## 🏙️ Daftar ID Kota Populer di Indonesia

### Pulau Jawa
| Kota | Province | City ID |
|------|----------|---------|
| Jakarta Pusat | DKI Jakarta | 151 |
| Jakarta Utara | DKI Jakarta | 152 |
| Jakarta Barat | DKI Jakarta | 153 |
| Jakarta Selatan | DKI Jakarta | 154 |
| Jakarta Timur | DKI Jakarta | 155 |
| Bandung | Jawa Barat | 23 |
| Bogor | Jawa Barat | 32 |
| Bekasi | Jawa Barat | 24 |
| Depok | Jawa Barat | 107 |
| Tangerang | Banten | 455 |
| Tangerang Selatan | Banten | 456 |
| Semarang | Jawa Tengah | 398 |
| Yogyakarta | DI Yogyakarta | 501 |
| Surabaya | Jawa Timur | 444 |
| Malang | Jawa Timur | 254 |

### Pulau Sumatera
| Kota | Province | City ID |
|------|----------|---------|
| Medan | Sumatera Utara | 258 |
| Palembang | Sumatera Selatan | 321 |
| Pekanbaru | Riau | 337 |
| Padang | Sumatera Barat | 318 |
| Bandar Lampung | Lampung | 35 |
| Batam | Kepulauan Riau | 25 |

### Pulau Kalimantan
| Kota | Province | City ID |
|------|----------|---------|
| Balikpapan | Kalimantan Timur | 21 |
| Samarinda | Kalimantan Timur | 388 |
| Pontianak | Kalimantan Barat | 347 |
| Banjarmasin | Kalimantan Selatan | 37 |

### Pulau Sulawesi
| Kota | Province | City ID |
|------|----------|---------|
| Makassar | Sulawesi Selatan | 248 |
| Manado | Sulawesi Utara | 255 |
| **Kendari** | **Sulawesi Tenggara** | **236** ← Default |
| Palu | Sulawesi Tengah | 322 |
| Gorontalo | Gorontalo | 138 |

### Pulau Bali & Nusa Tenggara
| Kota | Province | City ID |
|------|----------|---------|
| Denpasar | Bali | 106 |
| Mataram | Nusa Tenggara Barat | 257 |
| Kupang | Nusa Tenggara Timur | 238 |

### Papua & Maluku
| Kota | Province | City ID |
|------|----------|---------|
| Jayapura | Papua | 215 |
| Ambon | Maluku | 8 |
| Ternate | Maluku Utara | 464 |

## 🔍 Cara Mencari ID Kota Lain

### Via API Endpoint
```bash
# Get all cities
curl http://localhost:3000/api/shipping/cities

# Get cities by province
curl http://localhost:3000/api/shipping/cities/province/1
```

### Via RajaOngkir Documentation
1. Buka https://rajaongkir.com/dokumentasi
2. Login ke dashboard
3. Cek daftar kota di dokumentasi API

### Via Browser (setelah backend running)
```
GET http://localhost:3000/api/shipping/cities
```

Cari kota yang Anda inginkan di response JSON, lalu copy `city_id`-nya.

## 📝 Contoh Konfigurasi

### Contoh 1: Origin dari Jakarta
```env
RAJAONGKIR_ORIGIN_CITY_ID=151  # Jakarta Pusat
```

### Contoh 2: Origin dari Surabaya
```env
RAJAONGKIR_ORIGIN_CITY_ID=444  # Surabaya
```

### Contoh 3: Origin dari Bandung
```env
RAJAONGKIR_ORIGIN_CITY_ID=23   # Bandung
```

### Contoh 4: Origin dari Kendari (Default)
```env
RAJAONGKIR_ORIGIN_CITY_ID=236  # Kendari
```

## ⚠️ Penting!

1. **Restart Backend** setelah mengubah `.env`:
   ```bash
   cd backend
   npm start
   ```

2. **Verifikasi Origin**: 
   - Origin city akan digunakan untuk semua kalkulasi shipping
   - Pastikan ID kota sudah benar sebelum production

3. **Multi-Warehouse** (Future):
   - Untuk multiple origin, perlu modifikasi controller
   - Tambahkan parameter `originCityId` di request

## 🧪 Testing

Test apakah origin sudah berubah:
```bash
# Login dulu untuk dapat token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@email.com","password":"password"}'

# Test calculate shipping dari origin baru
curl -X POST http://localhost:3000/api/shipping/cost \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "cityName": "Jakarta",
    "weight": 5000
  }'
```

Biaya shipping akan berbeda sesuai jarak dari origin yang baru.
