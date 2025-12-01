import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

// Thunk untuk menghitung biaya pengiriman dari city name
export const calculateShippingCost = createAsyncThunk(
  "shipping/calculateShippingCost",
  async (
    { provinceName, cityName, districtName, weight },
    { rejectWithValue }
  ) => {
    try {
      console.log(provinceName, cityName, districtName, weight);

      // 1. Fetch all provinces
      const provincesData = await api.post("/shipping/provinces", {
        provinceName,
      });

      if (!provincesData) {
        return rejectWithValue(`Provinsi '${provinceName}' tidak ditemukan`);
      }
      console.log(provincesData.data[0].id);
      // 2. Fetch provincesData for the province
      const province_id = provincesData.data[0].id;
      const citiesData = await api.post("/shipping/cities", {
        province_id,
        cityName,
      });

      if (!citiesData) {
        return rejectWithValue(`Kota '${cityName}' tidak ditemukan`);
      }

      const city_id = citiesData.data[0].id;

      console.log(city_id, districtName);

      // 3. Fetch districts for this city
      const districtsData = await api.post(`/shipping/districts`, {
        city_id,
        districtName,
      });

      if (!districtsData) {
        return rejectWithValue(
          `Tidak ada kecamatan ditemukan untuk ${cityName}`
        );
      }

      console.log(districtsData.data[0].id);
      console.log(import.meta.env.VITE_RAJAONGKIR_ORIGIN_DISTRICT_ID);
      // 5. Calculate shipping cost
      const response = await api.post("/shipping/cost", {

        originDistrictId: import.meta.env.VITE_RAJAONGKIR_ORIGIN_DISTRICT_ID,
        destinationDistrictId: districtsData.data[0].id,
        weight,
        courier:
          "jne:sicepat:ide:sap:jnt:ninja:tiki:lion:anteraja:pos:ncs:rex:rpx:sentral:star:wahana:dse",
      });

      return response.data;
    } catch (error) {
      console.error("Error calculating shipping cost:", error.response || error.message);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Gagal menghitung biaya pengiriman"
      );
    }
  }
);

const shippingSlice = createSlice({
  name: "shipping",
  initialState: {
    shippingOptions: [],
    selectedShipping: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedShipping: (state, action) => {
      state.selectedShipping = action.payload;
    },
    clearShippingOptions: (state) => {
      state.shippingOptions = [];
      state.cheapestOption = null;
      state.selectedShipping = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Calculate Shipping Cost
      .addCase(calculateShippingCost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateShippingCost.fulfilled, (state, action) => {
        state.loading = false;
        state.shippingOptions = action.payload.data || [];
        
      })
      .addCase(calculateShippingCost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.shippingOptions = [];
      });
  },
});

export const { setSelectedShipping, clearShippingOptions, clearError } =
  shippingSlice.actions;

export default shippingSlice.reducer;
