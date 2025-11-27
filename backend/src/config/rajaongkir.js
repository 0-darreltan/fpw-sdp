// config/rajaongkir.js
const axios = require("axios");
require("dotenv").config();

// =====================================
// ENV CONFIG
// =====================================
const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY;
const RAJAONGKIR_BASE_URL =
  process.env.RAJAONGKIR_BASE_URL || "https://rajaongkir.komerce.id/api/v1";

// Default origin (district)
const ORIGIN_DISTRICT_ID = process.env.RAJAONGKIR_ORIGIN_DISTRICT_ID || "3256";

// =====================================
// CACHE
// =====================================
const cache = {
  provinces: null,
  cities: {},
  districts: {},
  subdistricts: {},
};

// =====================================
// AXIOS CLIENT
// =====================================
const rajaOngkirClient = axios.create({
  baseURL: RAJAONGKIR_BASE_URL,
  headers: {
    key: RAJAONGKIR_API_KEY,
    "Content-Type": "application/json",
  },
});

// =====================================
// GET PROVINCES
// =====================================
const getProvinces = async () => {
  if (cache.provinces) return { data: cache.provinces };

  const res = await rajaOngkirClient.get("/destination/province");
  cache.provinces = res.data.data;
  return res.data;
};

// =====================================
// GET CITIES
// =====================================
const getCities = async (provinceId) => {
  if (!provinceId) throw new Error("provinceId is required");
  if (cache.cities[provinceId]) return { data: cache.cities[provinceId] };

  const res = await rajaOngkirClient.get(`/destination/city/${provinceId}`);
  cache.cities[provinceId] = res.data.data;
  return res.data;
};

// =====================================
// GET DISTRICTS
// =====================================
const getDistricts = async (cityId) => {
  if (!cityId) throw new Error("cityId is required");
  if (cache.districts[cityId]) return { data: cache.districts[cityId] };

  const res = await rajaOngkirClient.get(`/destination/district/${cityId}`);
  cache.districts[cityId] = res.data.data;
  return res.data;
};

// =====================================
// GET SUB-DISTRICT
// =====================================
const getSubDistricts = async (districtId) => {
  if (!districtId) throw new Error("districtId is required");
  if (cache.subdistricts[districtId])
    return { data: cache.subdistricts[districtId] };

  const res = await rajaOngkirClient.get(
    `/destination/sub-district/${districtId}`
  );
  cache.subdistricts[districtId] = res.data.data;
  return res.data;
};

// =====================================
// GET COST (DISTRICT)
// =====================================
const getCost = async ({
  originDistrictId,
  destinationDistrictId,
  weight,
  courier,
}) => {
  const res = await rajaOngkirClient.post("/v2/calculate/domestic", {
    origin: originDistrictId,
    originType: "district",
    destination: destinationDistrictId,
    destinationType: "district",
    weight,
    courier,
  });

  return res.data;
};

// =====================================
// CALCULATE SHIPPING (District → District)
// =====================================
const calculateShipping = async (
  originDistrictId,
  destinationDistrictId,
  weight
) => {
  console.log("\n=== CALCULATE SHIPPING (By District ID) ===");
  console.log("Origin District:", originDistrictId);
  console.log("Destination District:", destinationDistrictId);

  const couriers = ["jne", "pos", "tiki"];
  const results = [];

  for (const courier of couriers) {
    try {
      const res = await getCost({
        originDistrictId,
        destinationDistrictId,
        weight,
        courier,
      });

      const services = res?.data?.results?.[0]?.costs || [];

      services.forEach((svc) => {
        results.push({
          courier: courier.toUpperCase(),
          service: svc.service,
          description: svc.description,
          cost: svc.cost[0]?.value,
          etd: svc.cost[0]?.etd,
        });
      });
    } catch (err) {
      console.log(
        `Error fetching ${courier}:`,
        err.response?.data || err.message
      );
    }
  }

  return results;
};

// =====================================
// Wrapper function (uses default ORIGIN)
// =====================================
const calculateShippingByDistrict = async (destinationDistrictId, weight) => {
  return await calculateShipping(
    ORIGIN_DISTRICT_ID,
    destinationDistrictId,
    weight
  );
};

module.exports = {
  ORIGIN_DISTRICT_ID,
  rajaOngkirClient,
  getProvinces,
  getCities,
  getDistricts,
  getSubDistricts,
  calculateShipping,
  calculateShippingByDistrict,
  getCost,
};
