const { Order } = require("../models");

async function generateOrderNumber(orderType) {
  // 1. Tentukan prefix berdasarkan tipe order
  const prefix = orderType === "PROJECT" ? "PROJ" : "INV";

  // 2. Buat bagian tanggal (YYYYMMDD)
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Bulan dimulai dari 0
  const day = String(now.getDate()).padStart(2, "0");
  const datePart = `${year}${month}${day}`;

  // 3. Cari nomor urut untuk hari ini
  // Kita hitung berapa banyak pesanan yang sudah dibuat pada hari ini
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const endOfDay = new Date(now.setHours(23, 59, 59, 999));

  // Hitung jumlah order yang dibuat hari ini dengan prefix yang sama
  const orderCountToday = await Order.countDocuments({
    orderNumber: new RegExp(`^${prefix}-${datePart}`),
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  // Nomor urut adalah jumlah order + 1
  const sequence = orderCountToday + 1;

  // 4. Format nomor urut dengan 4 digit (misal: 1 -> 0001)
  const sequencePart = String(sequence).padStart(4, "0");

  // 5. Gabungkan semua bagian menjadi satu
  return `${prefix}-${datePart}-${sequencePart}`;
}

module.exports = {
  generateOrderNumber,
};
