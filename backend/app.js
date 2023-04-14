const express = require('express');
const app = express();
const mongoose = require('mongoose');

const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauce")
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

app.use(express.json())
app.use("/api/auth", userRoutes)
app.use("/api/sauces", saucesRoutes)

module.exports = app