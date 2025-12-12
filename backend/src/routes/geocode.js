// routes/geocode.js
const express = require("express");
const axios = require("axios");
const rateLimit = require("express-rate-limit"); // optional but recommended
const NodeCache = require("node-cache");

const router = express.Router();
const cache = new NodeCache({ stdTTL: 60 }); // cache 60s

// very small rate limiter to be polite to Nominatim
const limiter = rateLimit({
  windowMs: 1000, // 1 second window
  max: 1, // 1 request per IP per second
  message: "Too many requests, please slow down.",
});

router.use(limiter);

router.get("/search", async (req, res) => {
  const q = req.query.q || "";
  if (!q || q.length < 3) return res.json([]);

  const cacheKey = `search:${q}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log(`✅ [Geocode] Cache hit for: ${q}`);
    return res.json(cached);
  }

  console.log(`🔍 [Geocode] Searching for: ${q}`);

  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          format: "json",
          q: q + ", Indonesia", // Tambahkan Indonesia untuk hasil lebih akurat
          addressdetails: 1,
          limit: 10, // Tingkatkan dari 6 ke 10
          countrycodes: "id", // Batasi ke Indonesia saja
        },
        headers: {
          "User-Agent": "ProjectFPWSDP (darrel.t23@mhs.istts.ac.id)",
        },
        timeout: 5000,
      }
    );

    console.log(`✅ [Geocode] Found ${response.data.length} results for: ${q}`);
    cache.set(cacheKey, response.data);
    res.json(response.data);
  } catch (err) {
    console.error("❌ [Geocode] Nominatim search error:", err.message || err);
    res.status(500).json({ error: "Failed to fetch from geocoding provider" });
  }
});

router.get("/reverse", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: "Missing lat/lon" });

  const cacheKey = `rev:${lat}:${lon}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          format: "json",
          lat,
          lon,
          addressdetails: 1,
        },
        headers: {
          "User-Agent": "ProjectFPWSDP (darrel.t23@mhs.istts.ac.id)",
        },
        timeout: 5000,
      }
    );

    cache.set(cacheKey, response.data);
    res.json(response.data);
  } catch (err) {
    console.error("Nominatim reverse error:", err.message || err);
    res.status(500).json({ error: "Failed to reverse geocode" });
  }
});

module.exports = router;
