// controllers/shippingController.js
const {
  getProvinces,
  getCities,
  getDistricts,
  calculateShipping, // <-- yang benar dari config
  ORIGIN_DISTRICT_ID, // <-- untuk origin district
} = require("../config/rajaongkir");

/**
 * Get all provinces
 */
const getAllProvinces = async (req, res) => {
  try {
    const data = await getProvinces();
    return res.status(200).json({
      success: true,
      data: data.data || [],
    });
  } catch (error) {
    console.error("Get provinces error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch provinces",
    });
  }
};

/**
 * Get cities by province
 */
const getCitiesByProvince = async (req, res) => {
  try {
    const { provinceId } = req.params;
    const data = await getCities(provinceId);

    return res.status(200).json({
      success: true,
      data: data.data || [],
    });
  } catch (error) {
    console.error("Get cities error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cities",
    });
  }
};

/**
 * Get all cities (optional)
 */
const getAllCities = async (req, res) => {
  try {
    const data = await getCities();

    return res.status(200).json({
      success: true,
      data: data.data || [],
    });
  } catch (error) {
    console.error("Get all cities error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cities",
    });
  }
};

/**
 * Get districts by city ID
 */
const getDistrictsByCity = async (req, res) => {
  try {
    const { cityId } = req.params;
    const data = await getDistricts(cityId);

    return res.status(200).json({
      success: true,
      data: data.data || [],
    });
  } catch (error) {
    console.error("Get districts error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch districts",
    });
  }
};

/**
 * Calculate shipping cost using DISTRICT ID
 * Body: { destinationDistrictId, weight }
 */
const getShippingCostByDistrict = async (req, res) => {
  try {
    const { destinationDistrictId, weight } = req.body;

    if (!destinationDistrictId || !weight) {
      return res.status(400).json({
        success: false,
        message: "destinationDistrictId and weight are required",
      });
    }

    const result = await calculateShipping(
      ORIGIN_DISTRICT_ID, // <-- origin otomatis
      destinationDistrictId,
      weight
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Calculate shipping (district) error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to calculate shipping",
    });
  }
};

/**
 * Get cheapest shipping option
 */
const getCheapestShippingByDistrict = async (req, res) => {
  try {
    const { destinationDistrictId, weight } = req.body;

    if (!destinationDistrictId || !weight) {
      return res.status(400).json({
        success: false,
        message: "destinationDistrictId and weight are required",
      });
    }

    const allOptions = await calculateShipping(
      ORIGIN_DISTRICT_ID,
      destinationDistrictId,
      weight
    );

    if (!allOptions.length) {
      return res.status(404).json({
        success: false,
        message: "No shipping options found",
      });
    }

    const cheapest = allOptions.reduce((min, item) =>
      item.cost < min.cost ? item : min
    );

    return res.status(200).json({
      success: true,
      data: {
        destinationDistrictId,
        weight,
        cheapest,
      },
    });
  } catch (error) {
    console.error("Get cheapest shipping error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get cheapest shipping",
    });
  }
};

module.exports = {
  getAllProvinces,
  getCitiesByProvince,
  getAllCities,
  getDistrictsByCity,
  getShippingCostByDistrict,
  getCheapestShippingByDistrict,
};
