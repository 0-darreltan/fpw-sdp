# Integrasi RajaOngkir API

## Deskripsi
Sistem ini menggunakan RajaOngkir API untuk menghitung biaya pengiriman material dari Agung Beton Kendari ke alamat customer di seluruh Indonesia.

## Konfigurasi

### 1. Environment Variables
Tambahkan API key RajaOngkir ke file `.env`:

```env
RAJAONGKIR_API_KEY=your_rajaongkir_api_key_here
```

### 2. Origin City
Origin pengiriman sudah dikonfigurasi di `backend/src/config/rajaongkir.js`:
- **City**: Kendari
- **City ID**: 236

### 3. Supported Couriers
- **JNE** - Jalur Nugraha Ekakurir
- **POS** - POS Indonesia
- **TIKI** - Titipan Kilat

## API Endpoints

### Public Endpoints

#### 1. Get All Provinces
```
GET /api/shipping/provinces
```
Response:
```json
{
  "success": true,
  "data": [
    {
      "province_id": "1",
      "province": "Bali"
    }
  ]
}
```

#### 2. Get Cities by Province
```
GET /api/shipping/cities/province/:provinceId
```
Response:
```json
{
  "success": true,
  "data": [
    {
      "city_id": "1",
      "province_id": "1",
      "type": "Kabupaten",
      "city_name": "Badung",
      "postal_code": "80351"
    }
  ]
}
```

#### 3. Get All Cities
```
GET /api/shipping/cities
```
Response:
```json
{
  "success": true,
  "data": [...]
}
```

### Protected Endpoints (Require Authentication)

#### 4. Calculate Shipping Cost
```
POST /api/shipping/cost
Authorization: Bearer <token>
Content-Type: application/json

{
  "cityName": "Jakarta",
  "weight": 5000
}
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "courier": "jne",
      "service": "REG",
      "description": "Layanan Reguler",
      "cost": 25000,
      "etd": "2-3 hari"
    },
    {
      "courier": "jne",
      "service": "YES",
      "description": "Yakin Esok Sampai",
      "cost": 35000,
      "etd": "1-1 hari"
    }
  ]
}
```

#### 5. Get Cheapest Shipping Option
```
POST /api/shipping/cheapest
Authorization: Bearer <token>
Content-Type: application/json

{
  "cityName": "Surabaya",
  "weight": 3000
}
```

Response:
```json
{
  "success": true,
  "data": {
    "courier": "pos",
    "service": "Paket Kilat Khusus",
    "description": "Paket Kilat Khusus",
    "cost": 18000,
    "etd": "2-4 hari"
  }
}
```

## Frontend Integration

### Redux Store Setup
Shipping slice sudah terintegrasi di store:
```javascript
import shippingReducer from "../features/shipping/shippingSlice";

export const store = configureStore({
  reducer: {
    // ... other reducers
    shipping: shippingReducer,
  },
});
```

### Usage in Checkout Page

#### 1. Auto-calculate Shipping
Sistem akan otomatis menghitung biaya pengiriman ketika:
- User memilih/mengubah alamat pengiriman
- User menambah/mengurangi item di keranjang

#### 2. Display Shipping Options
User dapat memilih dari berbagai opsi kurir dan layanan yang tersedia:
- Nama kurir (JNE, POS, TIKI)
- Jenis layanan (REG, YES, OKE, dll)
- Biaya pengiriman
- Estimasi waktu pengiriman

#### 3. Calculate Total
Total pembayaran = Subtotal + Biaya Pengiriman

## Weight Calculation

### Default Weight
Saat ini, setiap product dihitung dengan berat default:
- **1 item = 1000 gram (1 kg)**

### Custom Weight (Future Enhancement)
Untuk lebih akurat, tambahkan field `weight` di Product model:

```javascript
// backend/src/models/Product.js
const ProductSchema = new mongoose.Schema({
  // ... existing fields
  weight: {
    type: Number, // dalam gram
    default: 1000,
  },
});
```

Kemudian update weight calculation di frontend:
```javascript
const totalWeight = selectedItems.reduce(
  (total, item) => total + (item.weight || 1000) * item.quantity,
  0
);
```

## Error Handling

### Common Errors
1. **City not found**: Pastikan nama kota sesuai dengan database RajaOngkir
2. **API limit exceeded**: RajaOngkir starter plan memiliki limit request
3. **Invalid weight**: Weight harus dalam gram (minimum 1 gram)

### Error Messages
```javascript
{
  "success": false,
  "message": "City not found: [cityName]"
}
```

## Testing

### Test Shipping Calculation
```bash
# Login terlebih dahulu untuk mendapatkan token
POST /api/auth/login

# Test calculate shipping
POST /api/shipping/cost
Authorization: Bearer <your_token>
{
  "cityName": "Jakarta",
  "weight": 5000
}
```

### Test Cities
```bash
# Get all cities
GET /api/shipping/cities

# Get cities in specific province
GET /api/shipping/cities/province/6
```

## RajaOngkir Account

### Starter Plan Features
- ✅ Cek ongkir domestic
- ✅ Cost calculation
- ❌ International shipping
- ❌ Tracking
- ❌ Waybill

### Upgrade untuk Fitur Tambahan
- **Basic Plan**: Tracking, waybill
- **Pro Plan**: International shipping, currency conversion

## Notes

1. **City Name Matching**: 
   - RajaOngkir API case-insensitive untuk city name
   - Pastikan nama kota sesuai (e.g., "Jakarta", bukan "Jakarta Pusat")

2. **Weight Format**:
   - Harus dalam satuan **gram**
   - Minimum: 1 gram
   - Contoh: 5 kg = 5000 gram

3. **Origin City**:
   - Hardcoded: Kendari (ID: 236)
   - Untuk multi-warehouse, perlu modifikasi config

4. **Cache Consideration**:
   - Province dan city data jarang berubah
   - Bisa di-cache untuk performa lebih baik

## Support

Dokumentasi RajaOngkir: https://rajaongkir.com/dokumentasi

API Type: **Starter** (Free)
Base URL: `https://api.rajaongkir.com/starter`
