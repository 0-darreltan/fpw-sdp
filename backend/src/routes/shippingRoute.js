// routes/shippingRoute.js
const express = require('express');
const router = express.Router();
const {
  getAllProvinces,
  getCitiesByProvince,
  getAllCities,
  getDistrictsByCity,
  getShippingCostByDistrict,
  getCheapestShippingByDistrict,
} = require('../controllers/shippingController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public routes
router.get('/provinces', getAllProvinces);
router.get('/cities', getAllCities);
router.get('/cities/province/:provinceId', getCitiesByProvince);

// District route
router.get('/districts/city/:cityId', getDistrictsByCity);

// Protected routes
router.post('/cost', authMiddleware, getShippingCostByDistrict);
router.post('/cheapest', authMiddleware, getCheapestShippingByDistrict);

module.exports = router;
