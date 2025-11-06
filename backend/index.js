require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const { connectDB } = require("./src/config/database");

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
