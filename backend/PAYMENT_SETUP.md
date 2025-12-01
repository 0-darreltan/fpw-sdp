# Setup Pembayaran Midtrans

## Masalah: Redirect ke `example.com` setelah pembayaran

Setelah pembayaran sukses, Midtrans akan redirect ke halaman yang di-set di callback `finish`. Jika tidak di-set, akan redirect ke `example.com`.

## Solusi

### 1. Tambahkan Environment Variable

Buka file `.env` di folder `backend` dan tambahkan:

```env
FRONTEND_URL=http://localhost:5173/customer/dashboard
```

**Catatan:** Ubah URL sesuai dengan URL frontend Anda:
- Development: `http://localhost:5173/customer/dashboard`
- Production: `https://yourdomain.com/customer/dashboard`

### 2. Restart Backend Server

Setelah menambahkan `FRONTEND_URL`, restart backend server:

```bash
npm run start
# atau
npm run dev
```

## Cara Kerja

### Backend (`checkoutController.js`)
```javascript
callbacks: {
  finish: process.env.FRONTEND_URL || "http://localhost:5173/customer",
}
```

### Frontend (`CheckoutPage.jsx`)
Callback Midtrans Snap akan:
- **onSuccess**: Redirect ke dashboard setelah 1 detik
- **onPending**: Redirect ke dashboard setelah 1 detik  
- **onError**: Redirect ke dashboard setelah 1 detik
- **onClose**: Redirect ke dashboard langsung

## Testing

1. Buat pembayaran baru
2. Setelah bayar di Midtrans popup
3. Klik "Return to merchant's page"
4. Seharusnya redirect ke `/customer/dashboard` bukan `example.com`

## Troubleshooting

**Masih redirect ke `example.com`?**
- Pastikan file `.env` ada di folder `backend`
- Pastikan sudah restart backend server
- Cek console browser untuk error
- Cek log backend untuk memastikan `FRONTEND_URL` terbaca

**Pembayaran sukses tapi tidak ke dashboard?**
- Buka browser console (F12)
- Lihat apakah ada error JavaScript
- Pastikan `navigate` function bekerja dengan baik
