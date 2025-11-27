import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

// Thunk untuk mengambil daftar provinsi
export const fetchProvinces = createAsyncThunk(
  "shipping/fetchProvinces",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/shipping/provinces");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal mengambil data provinsi"
      );
    }
  }
);

// Thunk untuk mengambil daftar kota berdasarkan provinsi
export const fetchCitiesByProvince = createAsyncThunk(
  "shipping/fetchCitiesByProvince",
  async (provinceId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shipping/cities/province/${provinceId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal mengambil data kota"
      );
    }
  }
);

// Thunk untuk mengambil semua kota
export const fetchAllCities = createAsyncThunk(
  "shipping/fetchAllCities",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/shipping/cities");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal mengambil data kota"
      );
    }
  }
);

// Thunk untuk mengambil daftar district berdasarkan city ID
export const fetchDistrictsByCity = createAsyncThunk(
  "shipping/fetchDistrictsByCity",
  async (cityId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shipping/districts/city/${cityId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal mengambil data kecamatan"
      );
    }
  }
);

// Thunk untuk menghitung biaya pengiriman dari city name
export const calculateShippingCost = createAsyncThunk(
  "shipping/calculateShippingCost",
  async ({ cityName, weight }, { rejectWithValue }) => {
    try {
      // 1. Fetch all cities
      const citiesResponse = await api.get("/shipping/cities");
      const cities = citiesResponse.data?.data || [];
      
      // 2. Find city by name (case insensitive)
      const city = cities.find(
        (c) => c.city_name?.toLowerCase() === cityName?.toLowerCase() ||
               c.name?.toLowerCase() === cityName?.toLowerCase()
      );
      
      if (!city) {
        return rejectWithValue(`Kota '${cityName}' tidak ditemukan`);
      }
      
      const cityId = city.city_id || city.id;
      
      // 3. Fetch districts for this city
      const districtsResponse = await api.get(`/shipping/districts/city/${cityId}`);
      const districts = districtsResponse.data?.data || [];
      
      if (districts.length === 0) {
        return rejectWithValue(`Tidak ada kecamatan ditemukan untuk ${cityName}`);
      }
      
      // 4. Use first district (or you can let user choose)
      const district = districts[0];
      const districtId = district.district_id || district.id;
      
      // 5. Calculate shipping cost
      const response = await api.post("/shipping/cost", {
        destinationDistrictId: districtId,
        weight,
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Gagal menghitung biaya pengiriman"
      );
    }
  }
);



// Thunk untuk mendapatkan opsi pengiriman termurah
export const getCheapestShipping = createAsyncThunk(
  "shipping/getCheapestShipping",
  async ({ destinationDistrictId, weight }, { rejectWithValue }) => {
    try {
      const response = await api.post("/shipping/cheapest", {
        destinationDistrictId,
        weight,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Gagal mendapatkan opsi pengiriman termurah"
      );
    }
  }
);


const shippingSlice = createSlice({
  name: "shipping",
  initialState: {
    provinces: [],
    cities: [],
    shippingOptions: [],
    cheapestOption: null,
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
      // Fetch Provinces
      .addCase(fetchProvinces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProvinces.fulfilled, (state, action) => {
        state.loading = false;
        state.provinces = action.payload.data || [];
      })
      .addCase(fetchProvinces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Cities by Province
      .addCase(fetchCitiesByProvince.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCitiesByProvince.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload.data || [];
      })
      .addCase(fetchCitiesByProvince.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch All Cities
      .addCase(fetchAllCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCities.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload.data || [];
      })
      .addCase(fetchAllCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

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
      })

      // Get Cheapest Shipping
      .addCase(getCheapestShipping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCheapestShipping.fulfilled, (state, action) => {
        state.loading = false;
        state.cheapestOption = action.payload.data || null;
      })
      .addCase(getCheapestShipping.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.cheapestOption = null;
      });
  },
});

export const { setSelectedShipping, clearShippingOptions, clearError } =
  shippingSlice.actions;

export default shippingSlice.reducer;
