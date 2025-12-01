const axios = require("axios");
require("dotenv").config();

const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY;
const RAJAONGKIR_BASE_URL =
  process.env.RAJAONGKIR_BASE_URL || "https://rajaongkir.komerce.id/api/v1";

const ORIGIN_DISTRICT_ID = process.env.RAJAONGKIR_ORIGIN_DISTRICT_ID || "3256";

// =====================================
// AXIOS CLIENT (DEFAULT CONFIG)
// =====================================
const rajaOngkirClient = axios.create({
  baseURL: RAJAONGKIR_BASE_URL,
  headers: {
    key: RAJAONGKIR_API_KEY,
    "Content-Type": "application/json",
  },
});

module.exports = {
  rajaOngkirClient,
  ORIGIN_DISTRICT_ID,
};
