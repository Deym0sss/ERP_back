const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/logos", express.static("public/logos"));
app.use("/images", express.static("public/images"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/location", require("./routes/locationRoutes"));
app.use("/asset", require("./routes/assetRoutes"));
app.use("/order", require("./routes/orderRoutes"));

async function start() {
  try {
    await mongoose.connect(MONGO_URI, {});
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.log("Server error", error);
    process.exit(1);
  }
}

start();
