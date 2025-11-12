require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const { connectDB } = require("./src/config/database");
const cors = require("cors");

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://fpw-sdp.vercel.app/",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const {
  userRouter,
  rabRouter,
  proposalRouter,
  projectRouter,
  productRouter,
  orderRouter,
} = require("./src/routes");

app.use("/api/users", userRouter);
app.use("/api/rabs", rabRouter);
app.use("/api/proposals", proposalRouter);
app.use("/api/projects", projectRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);

app.get("/", (req, res) => {
  res.send("FPW + SDP Backend is running!");
});

module.exports = app;
