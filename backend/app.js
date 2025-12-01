require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const { connectDB } = require("./src/config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration - allows both development and production origins
const allowedOrigins = [
  "http://localhost:5173", // Vite dev server
  "http://localhost:5174", // Backup Vite port
  "https://fpw-sdp.vercel.app", // Production (removed trailing slash)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // During development, accept any origin so debugging (local dev + Vite) isn't blocked
      if (process.env.NODE_ENV !== "production") return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const {
  userRouter,
  rabRouter,
  projectRouter,
  productRouter,
  orderRouter,
  webhookRouter,
  materialRequestRouter,
  activityRouter,
  cartRouter,
  checkoutRouter,
  geoRouter,
  shippingRouter,
} = require("./src/routes");

app.get("/", (req, res) => {
  res.send("FPW + SDP Backend is running!");
});

app.use("/api/users", userRouter);
app.use("/api/rabs", rabRouter);
app.use("/api/projects", projectRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/webhooks", webhookRouter);
app.use("/api/material-requests", materialRequestRouter);
app.use("/api/activities", activityRouter);
app.use("/api/cart", cartRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/geocode", geoRouter);
app.use("/api/shipping", shippingRouter);


app.get("/", (req, res) => {
  res.send("FPW + SDP Backend is running!");
});

module.exports = app;
