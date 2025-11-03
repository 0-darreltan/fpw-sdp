require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const { connectDB } = require("./src/config/database");

connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("FPW + SDP Backend is running!");
});

module.exports = app;