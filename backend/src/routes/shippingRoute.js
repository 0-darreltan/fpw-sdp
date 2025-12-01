// routes/shippingRoute.js
const express = require("express");
const router = express.Router();
const {
  getAllProvinces,
  getCitiesByProvince,
  getDistrictsByCity,
  getShippingCostByDistrict,
} = require("../controllers/shippingController");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/provinces", getAllProvinces);
router.post("/cities", getCitiesByProvince);
router.post("/districts", getDistrictsByCity);
router.post("/cost", authMiddleware, getShippingCostByDistrict);

module.exports = router;
