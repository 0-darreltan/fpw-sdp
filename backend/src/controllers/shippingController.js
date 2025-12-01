const { rajaOngkirClient } = require("../config/rajaongkir.js");
const qs = require("qs");

const getAllProvinces = async (req, res) => {
  const { provinceName } = req.body;
  const response = await rajaOngkirClient.get("/destination/province");
  const filteredProvinces = response.data.data.filter((province) =>
    province.name.toLowerCase().includes(provinceName.toLowerCase())
  );
  return res.json(filteredProvinces);
};
const getCitiesByProvince = async (req, res) => {
  const { province_id, cityName } = req.body;
  console.log(province_id, cityName);
  const response = await rajaOngkirClient.get(
    `/destination/city/${province_id}`
  );
  const filteredCities = response.data.data.filter((city) =>
    city.name.toLowerCase().includes(cityName.toLowerCase())
  );
  return res.json(filteredCities);
};
const getDistrictsByCity = async (req, res) => {
  const { city_id, districtName } = req.body;
  const response = await rajaOngkirClient.get(
    `/destination/district/${city_id}`
  );
  const filteredDistricts = response.data.data.filter(
    (district) => district.name.toLowerCase() == districtName.toLowerCase()
  );
  return res.json(filteredDistricts);
};
const getShippingCostByDistrict = async (req, res) => {
  const { originDistrictId, destinationDistrictId, weight, courier } = req.body;
  const bodyData = qs.stringify({
    origin: originDistrictId,
    destination: destinationDistrictId,
    weight,
    courier,
    price: "lowest",
  });
  const response = await rajaOngkirClient.post(
    "/calculate/district/domestic-cost",
    bodyData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  console.log(response.data);
  return res.json(response.data);
};

module.exports = {
  getAllProvinces,
  getCitiesByProvince,
  getDistrictsByCity,
  getShippingCostByDistrict,
};
