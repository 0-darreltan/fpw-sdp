# Update Struktur Alamat Lengkap

## 📝 Perubahan yang Dilakukan

### Frontend - CheckoutPage.jsx

#### State Alamat yang Diperluas
Struktur alamat sekarang mencakup field lengkap sesuai alamat Indonesia:

```javascript
{
  houseNumber: "",      // Nomor rumah / blok
  street: "",           // Jalan / gang (WAJIB)
  rt: "",               // RT
  rw: "",               // RW
  kelurahan: "",        // Kelurahan / Desa (WAJIB)
  kecamatan: "",        // Kecamatan (WAJIB)
  city: "",             // Kota / Kabupaten (WAJIB)
  province: "",         // Provinsi (WAJIB)
  postalCode: "",       // Kode pos 5 digit (WAJIB)
  country: "Indonesia", // Default Indonesia
}
```

#### Field Wajib
- **Jalan / Gang** (`street`)
- **Kelurahan / Desa** (`kelurahan`)
- **Kecamatan** (`kecamatan`)
- **Kota / Kabupaten** (`city`)
- **Provinsi** (`province`)
- **Kode Pos** (`postalCode`)

Field opsional:
- Nomor Rumah / Blok
- RT
- RW

#### UI Form
Form sekarang menampilkan input field terpisah untuk setiap komponen alamat:
1. Nomor Rumah / Blok
2. Jalan / Gang *
3. RT dan RW (dalam 1 baris, 2 kolom)
4. Kelurahan / Desa *
5. Kecamatan *
6. Kota / Kabupaten *
7. Provinsi *
8. Kode Pos (5 digit) *

#### Auto-detect Lokasi
Fitur "Lokasi Saat Ini" juga telah diupdate untuk mengisi field lengkap dari OpenStreetMap API.

Display alamat current location sekarang menampilkan:
```
No. [houseNumber], [street]
RT [rt] / RW [rw]
Kel. [kelurahan], Kec. [kecamatan], [city], [province] [postalCode]
```

### Backend - Checkout Model

#### AddressSchema Update
Model `Checkout.js` telah diupdate dengan field lengkap:

```javascript
const AddressSchema = new Schema(
  {
    houseNumber: { type: String },
    street: { type: String, required: true },
    rt: { type: String },
    rw: { type: String },
    kelurahan: { type: String, required: true },
    kecamatan: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: "Indonesia" },
  },
  { _id: false }
);
```

#### Helper Method
Ditambahkan method `getFullAddress()` pada AddressSchema untuk format alamat lengkap:

```javascript
addressSchema.methods.getFullAddress = function () {
  // Returns: "No. 123, Jl. Merdeka, RT 01/RW 02, Kel. Sukamaju, Kec. Sukajadi, Bandung, Jawa Barat, 40123, Indonesia"
};
```

## 🔧 Cara Penggunaan

### Frontend - Saat Checkout
1. User pilih "Alamat Lain"
2. Isi minimal field yang wajib (bertanda *)
3. Klik "Bayar Sekarang"
4. Data lengkap akan dikirim ke backend

### Backend - Menyimpan Checkout
```javascript
const checkout = new Checkout({
  // ... other fields
  deliveryAddress: {
    houseNumber: "123",
    street: "Jl. Merdeka Raya",
    rt: "01",
    rw: "02",
    kelurahan: "Sukamaju",
    kecamatan: "Sukajadi",
    city: "Bandung",
    province: "Jawa Barat",
    postalCode: "40123",
    country: "Indonesia"
  }
});

// Format alamat lengkap
const fullAddress = checkout.deliveryAddress.getFullAddress();
// "No. 123, Jl. Merdeka Raya, RT 01/RW 02, Kel. Sukamaju, Kec. Sukajadi, Bandung, Jawa Barat, 40123, Indonesia"
```

## ✅ Validasi

### Frontend Validation
- Kode pos harus 5 digit angka
- Field wajib tidak boleh kosong
- Alert akan muncul jika ada field wajib yang belum diisi

### Backend Validation
- Mongoose schema validation memastikan field required terisi
- `kelurahan`, `kecamatan`, `city`, `province`, `postalCode` wajib ada

## 📦 Data yang Dikirim ke Backend

Contoh payload `initiateCheckout`:

```javascript
{
  "orderType": "MATERIAL_PURCHASE",
  "deliveryAddress": {
    "houseNumber": "123",
    "street": "Jl. Merdeka Raya",
    "rt": "01",
    "rw": "02",
    "kelurahan": "Sukamaju",
    "kecamatan": "Sukajadi",
    "city": "Bandung",
    "province": "Jawa Barat",
    "postalCode": "40123",
    "country": "Indonesia"
  },
  "shippingCost": 15000,
  "discount": 0
}
```

## 🚀 Next Steps

1. **Test form input** - Coba isi semua field dan submit
2. **Test validation** - Coba submit tanpa field wajib
3. **Test auto-location** - Coba fitur "Lokasi Saat Ini"
4. **Check database** - Pastikan data tersimpan dengan benar di MongoDB
5. **Integration test** - Test end-to-end checkout flow

## 📌 Notes

- Field `houseNumber`, `rt`, `rw` bersifat opsional karena tidak semua alamat memiliki informasi ini
- Fitur autocomplete alamat dari OpenStreetMap tetap berfungsi dan akan mengisi field yang tersedia
- Format display alamat dapat disesuaikan dengan kebutuhan tampilan (invoice, shipping label, dll)
