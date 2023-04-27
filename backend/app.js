const express = require('express');
const app = express();
const mongoose = require('mongoose');
const corsMiddleware = require("./middlewares/cors");
const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauce")
const path = require("path")
// load .env
require('dotenv').config()

function exit(message) {
  console.log("Error occured:", message)
  process.exit(1)
}


let dsn = process.env.MONGO || exit("MONGO variable not provided");

mongoose.connect(dsn)
  .then(() => {
    console.log("Connected to database")
  })
  .catch((error) => {
    console.log("Error connecting to database:", error)
  });
  

app.use(corsMiddleware)
app.use(express.json())
app.use("/images",express.static(path.join(__dirname,"images")));
app.use("/api/auth", userRoutes)
app.use("/api/sauces", saucesRoutes)

module.exports = app